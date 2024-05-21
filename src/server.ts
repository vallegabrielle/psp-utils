import * as express from "express"
import { Request, Response } from "express"
import * as fs from "fs"

import * as cards from "@/json/cards.json"
import * as sites from "@/json/sites.json"
import { createSiteDataFile } from "@/services/create-site-data-file"
import { findCarrossel } from "@/services/find-carrossel"
import { findHeading } from "@/services/find-heading"
import { findInAPage } from "@/services/find-in-a-page"
import { getByClass } from "@/services/get-by-class"
import { getCardsInfo } from "@/services/get-cards-info"
import { getCarrossel } from "@/services/get-carrossel"
import { getHeadingContent } from "@/services/get-heading-content"
import { getSecretarias } from "@/services/get-secretarias"
import { getServicos } from "@/services/get-servicos"
import { uploadImages } from "@/services/upload-images"
import { readUrlsFromFile } from "@/utils/read-urls-from-file"

const PORT = 3000

const app = express()

app.get(
  "/list-servicos-from-all-secretarias",
  async (req: Request, res: Response) => {
    try {
      const url = req.query.site as string

      const secretarias = await getSecretarias(url)

      if (!secretarias) {
        res.status(404).send("Section not found")
        return
      }

      for (const secretaria of secretarias) {
        const servicos = await getServicos(secretaria.url)

        if (!servicos) return

        secretaria.servicos = servicos
      }

      res.send(secretarias)
    } catch (error) {
      res.status(500).send(error)
    }
  }
)

app.get("/has-carrossel", async (req: Request, res: Response) => {
  try {
    const targetDivPrefeitura = "#carouselContent"
    const targetDivAtual = ".lfr-layout-structure-item-itens-de-carrossel"

    const carrosselData = []
    for (const [i, site] of sites.entries()) {
      const id = i + 1

      const temCarrosselNaPrefeitura = await findCarrossel(
        site.urlPrefeitura,
        targetDivPrefeitura
      )
      const temCarrosselNoAtual = await findCarrossel(
        site.urlAtual,
        targetDivAtual
      )

      carrosselData.push({
        id,
        infoDaPagina: `${site.site} - ${site.pagina}`,
        temCarrosselNaPrefeitura,
        temCarrosselNoAtual,
        temNaPrefeituraMasNaoTemNoAtual:
          temCarrosselNaPrefeitura && !temCarrosselNoAtual,
      })

      console.log(`${id}/${sites.length}`)
    }

    res.send(carrosselData)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.get("/get-carrossel-info", async (req: Request, res: Response) => {
  try {
    const url = req.query.site as string

    const carrossel = await getCarrossel(url)

    res.send(carrossel)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.get("/get-servicos-info", async (req: Request, res: Response) => {
  try {
    const url = req.query.site as string

    const servicos = await getServicos(url)

    res.send(servicos)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.post("/upload-carrossel-images", async (req: Request, res: Response) => {
  try {
    const url = req.query.site as string
    const parentFolderId = req.query.folderId as string
    const login = req.query.login as string
    const password = req.query.password as string

    const carrossel = await getCarrossel(url)

    if (!carrossel) return

    const imageSources = carrossel.map((item) => item.imgSrc || "")

    await uploadImages(imageSources, parentFolderId, login, password)

    res.send("Images uploaded successfully")
  } catch (error) {
    res.status(500).send(error)
  }
})

app.post("/upload-servicos-images", async (req: Request, res: Response) => {
  try {
    const url = req.query.site as string
    const parentFolderId = req.query.folderId as string
    const login = req.query.login as string
    const password = req.query.password as string

    const servicos = await getServicos(url)

    if (!servicos) return

    const imageSources = servicos.map((item) => item.img.src || "")

    await uploadImages(imageSources, parentFolderId, login, password)

    res.send("Images uploaded successfully")
  } catch (error) {
    res.status(500).send(error)
  }
})

app.post("/create-cards-queries-file", async (req: Request, res: Response) => {
  try {
    const queries: (string | undefined)[] = []

    for (const card of cards) {
      const cardsInfo = await getCardsInfo(card)

      if (!cardsInfo) return

      const cardsInfoQueries = cardsInfo.map((item) => item.query)

      queries.push(...cardsInfoQueries)

      console.log(card, "done")
    }

    const filePath = `./queries.txt`
    const content = queries.join("\n")

    fs.writeFileSync(filePath, content)

    res.send("File created successfully")
  } catch (error) {
    res.status(500).send(error)
  }
})

app.post("/create-site-types-file", async (req: Request, res: Response) => {
  try {
    const sitesData = []

    const secretariaUrls = await readUrlsFromFile(
      "./src/files/txt/urls-da-secretaria.txt"
    )

    if (!secretariaUrls) return

    for (const url of secretariaUrls) {
      const res = await fetch(url)

      if (res.status === 500) {
        sitesData.push({ url })
      } else {
        const hasCarrossel = await findInAPage(url, "#carouselContent")
        const hasServicos = await findHeading(url, "SERVIÇOS")
        const isNoticia = await findInAPage(url, ".media-list")
        const isCard = await findInAPage(url, ".panel-notices")
        const isConteudo = await findInAPage(url, ".post-text")

        sitesData.push({
          url,
          hasCarrossel,
          hasServicos,
          isNoticia,
          isCard,
          isConteudo,
        })
      }

      console.log(url, "done")
    }

    createSiteDataFile(sitesData)

    res.send(sitesData)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.get("/get-home-data", async (req: Request, res: Response) => {
  try {
    const homeData = []

    const secretariaUrls = await readUrlsFromFile(
      "./src/files/txt/urls-da-secretaria.txt"
    )

    if (!secretariaUrls) return

    for (const [i, url] of secretariaUrls.entries()) {
      const acessoRapido =
        (await getHeadingContent(url, "ACESSO RÁPIDO", true)) || []
      const servicos = (await getHeadingContent(url, "SERVIÇOS", true)) || []
      const noticas = (await getHeadingContent(url, "NOTÍCIAS", true)) || []
      const saibaMais = (await getHeadingContent(url, "SAIBA MAIS", true)) || []
      const banners =
        (await getByClass(
          url,
          "div.thumbnail-aside a",
          "imagens-em-destaque",
          true
        )) || []
      const videos =
        (await getByClass(
          url,
          "div.embed-responsive iframe",
          "videos",
          true
        )) || []
      const carrosseis = (await getCarrossel(url, true)) || []
      const cardsHeading =
        (await getByClass(url, "div.media", "topo-de-pagina", true)) || []
      const cards = (await getByClass(url, "a.lnk-panel", "capas", true)) || []

      const urlData = [
        ...acessoRapido,
        ...servicos,
        ...noticas,
        ...saibaMais,
        ...banners,
        ...videos,
        ...carrosseis,
        ...cardsHeading,
        ...cards,
      ]

      homeData.push(...urlData)
      console.log(`${i + 1}/${secretariaUrls.length} done: ${url}`)
    }

    res.send(homeData)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

import * as express from "express"
import { Request, Response } from "express"
import * as fs from "fs"

import * as cards from "@/json/cards.json"
import * as sites from "@/json/sites.json"
import { createSiteDataFile } from "@/services/create-site-data-file"
import { findInAPage } from "@/services/find-in-a-page"
import { findServicos } from "@/services/find-servicos"
import { getCardsInfo } from "@/services/get-cards-info"
import { getCarrossel } from "@/services/get-carrossel"
import { getSecretarias } from "@/services/get-secretarias"
import { getServicos } from "@/services/get-servicos"
import { hasCarrossel } from "@/services/has-carrossel"
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

    const checkArr = []
    for (const [i, site] of sites.entries()) {
      const current = i + 1

      console.log(current, "/", sites.length)
      const temCarrosselNaPrefeitura = await hasCarrossel(
        site.urlPrefeitura,
        targetDivPrefeitura
      )
      const temCarrosselNoAtual = await hasCarrossel(
        site.urlAtual,
        targetDivAtual
      )

      checkArr.push({
        id: current,
        infoDaPagina: `${site.site} - ${site.pagina}`,
        temCarrosselNaPrefeitura,
        temCarrosselNoAtual,
        temNaPrefeituraMasNaoTemNoAtual:
          temCarrosselNaPrefeitura && !temCarrosselNoAtual,
      })
    }

    res.send(checkArr)
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

    console.log("Images uploaded successfully")

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

    console.log("Images uploaded successfully")

    res.send("Images uploaded successfully")
  } catch (error) {
    res.status(500).send(error)
  }
})

app.post("/create-cards-queries-file", async (req: Request, res: Response) => {
  try {
    const queriesArr: (string | undefined)[] = []

    for (const card of cards) {
      const cardsInfo = await getCardsInfo(card)

      if (!cardsInfo) return

      const queries = cardsInfo.map((item) => item.query)

      queriesArr.push(...queries)

      console.log(card, "done")
    }

    const filePath = `./queries.txt`
    const content = queriesArr.join("\n")

    fs.writeFileSync(filePath, content)

    console.log("File created successfully")

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
        const hasServicos = await findServicos(url)
        const isNoticia = await findInAPage(url, ".media-list")
        const isCard = await findInAPage(url, ".panel-notices")
        const isConteudo = await findInAPage(url, ".post-text")

        const foundData = {
          url,
          hasCarrossel,
          hasServicos,
          isNoticia,
          isCard,
          isConteudo,
        }

        sitesData.push(foundData)
      }

      console.log(url, "done")
    }

    createSiteDataFile(sitesData)

    res.send(sitesData)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

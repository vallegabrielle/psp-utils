import * as express from "express"
import { Request, Response } from "express"
import { getSecretarias } from "@/services/get-secretarias"
import { getServicos } from "@/services/get-servicos"
import { hasCarrossel } from "@/services/has-carrossel"
import { getCarrossel } from "@/services/get-carrossel"
import { uploadImages } from "@/services/upload-images"
import * as sites from "@/json/sites.json"

const PORT = 3000

const app = express()

app.get("/list-servicos-from-all-secretarias", async (req: Request, res: Response) => {
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
})

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

app.get("/upload-carrossel-images", async (req: Request, res: Response) => {
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

app.get("/upload-servicos-images", async (req: Request, res: Response) => {
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

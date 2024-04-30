import * as express from "express"
import { Request, Response } from "express"
import { getSecretarias } from "@/services/get-secretarias"
import { getServicos } from "@/services/get-servicos"
import { hasCarrossel } from "@/services/has-carrossel"
import * as sites from "@/sites.json"

const PORT = 3000

const app = express()

app.get("/", async (req: Request, res: Response) => {
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

app.get("/carrossel", async (req: Request, res: Response) => {
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

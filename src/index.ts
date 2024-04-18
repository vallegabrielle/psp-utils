import * as express from "express"
import { Request, Response } from "express"
import { scraper } from "@/scraper"
import { getSecretarias } from "@/services/get-secretarias"
import { getServicos } from "@/services/get-servicos"

const app = express()

app.get("/", async (req: Request, res: Response) => {
  const url = req.query.site as string

  const scraperRes = await scraper(url)

  if (!scraperRes) {
    res.status(404).send("SERVIÇOS section not found :(")
    return
  }

  res.send(scraperRes)
})

app.get("/servicos", async (req: Request, res: Response) => {
  const url = req.query.site as string

  const secretarias = await getSecretarias(url)

  if (!secretarias) {
    res.status(404).send("Secretarias section not found :(")
    return
  }

  for (const secretaria of secretarias) {
    const servicos = await getServicos(secretaria.link)

    if (!servicos) return

    secretaria.servicos = servicos
  }

  res.send(secretarias)
})

const PORT = 3000

app.listen(PORT, () => console.log(`🌐 Server is running on port ${PORT}`))

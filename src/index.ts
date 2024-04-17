import * as express from "express"
import { Request, Response } from "express"
import { scraper } from "@/scraper"

const app = express()

app.get("/", async (req: Request, res: Response) => {
  const url = req.query.site as string

  const scraperRes = await scraper({
    url,
  })

  if (!scraperRes) {
    res.status(404).send("SERVIÇOS section not found :(")
    return
  }

  res.send(scraperRes)
})

const PORT = 3000

app.listen(PORT, () => console.log(`🌐 Server is running on port ${PORT}`))

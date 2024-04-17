import axios from "axios"
import * as cheerio from "cheerio"

type ScraperProps = {
  url: string
}

export async function scraper({ url }: ScraperProps) {
  try {
    const res = await axios.get(url)
    if (res.status === 200) {
      const html = res.data
      const $ = cheerio.load(html)

      const hasServices = $('h2:contains("SERVIÇOS")').html()

      if (hasServices) {
        return $("div.panel.panel-default.panel-content.panel-notices").html()
      }
    }
    return
  } catch (err) {
    console.log("Error @ scraper:", err)
  }
}

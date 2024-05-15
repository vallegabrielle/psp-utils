import axios from "axios"
import * as cheerio from "cheerio"

export async function findHeading(url: string, heading: string) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const hasHeading =
      $(".panel-heading h2").filter(function () {
        return $(this).text().trim() === heading
      }).length > 0

    return hasHeading
  } catch (error) {
    console.log("Error @ findHeading:", error)
  }
}

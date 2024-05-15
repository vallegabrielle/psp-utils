import axios from "axios"
import * as cheerio from "cheerio"

export async function findServicos(url: string) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const hasServices =
      $(".panel-heading h2").filter(function () {
        return $(this).text().trim() === "SERVIÇOS"
      }).length > 0

    return hasServices
  } catch (error) {
    console.log("Error @ findServicos:", error)
  }
}

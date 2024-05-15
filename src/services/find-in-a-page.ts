import axios from "axios"
import * as cheerio from "cheerio"

export async function findInAPage(url: string, target: string) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const targetContent = $(`${target}`)
    if (!targetContent) return ""

    if (targetContent.length > 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log("Error @ findInAPage:", error)
  }
}

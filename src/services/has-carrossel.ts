import axios from "axios"
import * as cheerio from "cheerio"

export async function hasCarrossel(url: string, target: string) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const targetDiv = $(`${target}`)
    if (!targetDiv) return ""

    if (targetDiv.length > 0) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log("Error @ getSecretarias:", error)
  }
}

import axios from "axios"
import * as cheerio from "cheerio"

type Secretarias = {
  secretaria: string
  link: string
  servicos?: string[]
}[]

export async function getSecretarias(url: string) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const secretarias: Secretarias = []

    $("tbody tr td a").each((index, element) => {
      const secretaria = $(element).text().trim()
      const link = $(element).attr("href")

      if (!link) return

      secretarias.push({
        secretaria,
        link,
      })
    })

    return secretarias
  } catch (error) {
    console.log("Error @ getSecretarias:", error)
  }
}

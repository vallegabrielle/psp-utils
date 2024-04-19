import axios from "axios"
import * as cheerio from "cheerio"
import { Servicos } from "@/services/get-servicos"

type Secretarias = {
  secretaria: string
  url: string
  servicos?: Servicos
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
      const url = $(element).attr("href")

      if (!url) return

      secretarias.push({
        secretaria,
        url,
      })
    })

    return secretarias
  } catch (error) {
    console.log("Error @ getSecretarias:", error)
  }
}

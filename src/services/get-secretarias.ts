import axios from "axios"
import * as cheerio from "cheerio"

type Secretarias = {
  secretaria: string
  link: string
}[]

export async function getSecretarias() {
  try {
    const homeSecretarias =
      "https://www.prefeitura.sp.gov.br/cidade/secretarias/comunicacao/organizacao/index.php?p=192643"

    const res = await axios.get(homeSecretarias)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const secretarias: Secretarias = []

    $("tbody tr td a").each((index, element) => {
      const secretaria = $(element).text()
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

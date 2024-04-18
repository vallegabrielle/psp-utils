import axios from "axios"
import * as cheerio from "cheerio"

type Servicos = string[]

export async function getServicos(url: string) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const hasServicos = $('h2:contains("SERVIÇOS")').html()

    if (!hasServicos) return []

    const content = $(
      "div.panel.panel-default.panel-content.panel-notices"
    ).html()

    if (!content) return

    const $contentHtml = cheerio.load(content)

    const servicos: Servicos = []

    $contentHtml("a").each((index, element) => {
      const link = $(element).attr("href")

      if (!link) return

      servicos.push(link)
    })

    return servicos
  } catch (error) {
    console.log("Error @ getServicos", error)
  }
}

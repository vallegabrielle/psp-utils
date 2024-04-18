import axios from "axios"
import * as cheerio from "cheerio"

type Servicos = string[]

export async function getServicos(url: string) {
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

  $contentHtml(".col-md-6.col-xs-12").each((index, element) => {
    const link = $(element).find("a").attr("href")

    if (!link) return

    servicos.push(link)
  })

  return servicos
}

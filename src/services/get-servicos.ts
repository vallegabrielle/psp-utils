import axios from "axios"
import * as cheerio from "cheerio"

export type Servicos = {
  url: string
  img: {
    src: string
    alt: string
  }
  titulo: string
  descricao: string
}[]

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
      const url = $(element).attr("href")
      const imgSrc = $(element).find("img").attr("src")
      const imgAlt = $(element).find("img").attr("alt")
      const titulo = $(element).find("h3").text().trim()
      const descricao = $(element).find("p").text().trim()

      if (!url) return

      servicos.push({
        url,
        img: {
          src: imgSrc || "",
          alt: imgAlt || "",
        },
        titulo,
        descricao,
      })
    })

    return servicos
  } catch (error) {
    console.log("Error @ getServicos", error)
  }
}

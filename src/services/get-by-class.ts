import axios from "axios"
import * as cheerio from "cheerio"

import { categorizeUrl } from "@/utils/categorize-url"
import { isAbsoluteUrl } from "@/utils/is-absolute-url"

export async function getByClass(
  url: string,
  className: string,
  heading: string
) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const divsWithClass = $(`${className}`)

    const links: string[] = []
    divsWithClass.each((index, element) => {
      const href = $(element).attr("href") || ""
      const src = $(element).attr("src") || ""
      const imgSrc = $(element).find("img").attr("src") || ""
      const imgAlt = $(element).find("img").attr("alt") || ""
      const title = $(element).find("h3").text().trim()
      const description = $(element).find("p").text().trim()

      const linkExterno =
        (isAbsoluteUrl(href) && !href.includes("www.prefeitura.sp.gov.br")) ||
        src !== ""

      const originalPath = url.split("secretarias/")[1]
      let urlPath = originalPath || ""

      if (originalPath?.includes("index.php")) {
        urlPath = originalPath.split("index.php")[0]
      }

      let id = ""
      if (href.includes("p=")) id = href.split("p=")[1]

      let linkFinal = href
      if (src !== "") linkFinal = src

      const categoria = heading.toLowerCase().replace(" ", "-")

      const idWaram = id
      const sessao = categoria
      const titulo = title
      const resumo = description
      const urlImg = imgSrc
      const altImg = imgAlt
      const path = urlPath
      const isLinkExterno = linkExterno
      const link = linkFinal
      const tipoLink = categorizeUrl(linkFinal)

      const str = `${idWaram}; ${sessao}; ${titulo}; ${resumo}; ${urlImg}; ${altImg}; ${path}; ${isLinkExterno}; ${link}; ${tipoLink};`

      links.push(str)
    })

    return links
  } catch (error) {
    console.log("Error @ getByClass:", error)
  }
}

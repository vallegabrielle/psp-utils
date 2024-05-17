import axios from "axios"
import * as cheerio from "cheerio"

import { categorizeUrl } from "@/utils/categorize-url"
import { isAbsoluteUrl } from "@/utils/is-absolute-url"

export async function getHeadingContent(url: string, heading: string) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const divsWithASD = $(`div > div > h2:contains(${heading})`)
      .parent()
      .parent()

    const links: string[] = []
    divsWithASD.each((index, element) => {
      $(element)
        .find("a")
        .each((_, anchor) => {
          const href = $(anchor).attr("href") || ""
          const imgSrc = $(element).find("img").attr("src") || ""
          const imgAlt = $(element).find("img").attr("alt") || ""
          const title = $(element).find("h3").text().trim()
          const description = $(element).find("p").text().trim()

          const linkExterno =
            isAbsoluteUrl(href) && !href.includes("www.prefeitura.sp.gov.br")

          const originalPath = url.split("secretarias/")[1]
          let urlPath = originalPath || ""

          if (originalPath?.includes("index.php")) {
            urlPath = originalPath.split("index.php")[0]
          }

          let id = ""
          if (href.includes("p=")) id = href.split("p=")[1]

          const categoria = heading.toLowerCase().replace(" ", "-")

          const idWaram = id
          const sessao = categoria
          const titulo = title
          const resumo = description
          const urlImg = imgSrc
          const altImg = imgAlt
          const path = urlPath
          const isLinkExterno = linkExterno
          const link = href
          const tipoLink = categorizeUrl(href)

          const query = `${idWaram}; ${sessao}; ${titulo}; ${resumo}; ${urlImg}; ${altImg}; ${path}; ${isLinkExterno}; ${link}; ${tipoLink}`

          links.push(query)
        })
    })

    if (heading === "NOTÍCIAS") {
      links.splice(-1)
    }

    return links
  } catch (error) {
    console.log("Error @ getHeadingContent", error)
  }
}

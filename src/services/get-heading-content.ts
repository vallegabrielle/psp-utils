import axios from "axios"
import * as cheerio from "cheerio"

import { categorizeUrl } from "@/utils/categorize-url"
import { isAbsoluteUrl } from "@/utils/is-absolute-url"

type Data = {
  idWaram: string
  secao: string
  titulo: string
  descricao: string
  urlImg: string
  altImg: string
  path: string
  isLinkExterno: boolean
  link: string
  tipoLink: string
}

export async function getHeadingContent(
  url: string,
  heading: string,
  shouldSendJSON = false
) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const divsWithHeading = $(`div > div > h2:contains(${heading})`)
      .parent()
      .parent()

    const headingContent: (string | Data)[] = []
    divsWithHeading.each((index, element) => {
      $(element)
        .find("a")
        .each((_, anchor) => {
          const href = $(anchor).attr("href") || ""
          const imgSrc = $(anchor).find("img").attr("src") || ""
          const imgAlt = $(anchor).find("img").attr("alt") || ""
          const title = $(anchor).find("h3").text().trim()
          const description = $(anchor).find("p").text().trim()

          const linkExterno =
            isAbsoluteUrl(href) && !href.includes("www.prefeitura.sp.gov.br")

          const originalPath = url.split("secretarias/")[1]
          let urlPath = originalPath || ""

          if (originalPath?.includes("index.php")) {
            urlPath = originalPath.split("index.php")[0]
          }

          let id = ""
          if (href.includes("p=")) id = href.split("p=")[1]

          const categoria = heading
            .toLowerCase()
            .replace(" ", "-")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")

          const headingContentData = {
            idWaram: id,
            secao: categoria,
            titulo: title,
            descricao: description,
            urlImg: imgSrc,
            altImg: imgAlt,
            path: urlPath,
            isLinkExterno: linkExterno,
            link: href,
            tipoLink: categorizeUrl(href),
          }

          const query = `${headingContentData.idWaram}; ${headingContentData.secao}; ${headingContentData.titulo}; ${headingContentData.descricao}; ${headingContentData.urlImg}; ${headingContentData.altImg}; ${headingContentData.path}; ${headingContentData.isLinkExterno}; ${headingContentData.link}; ${headingContentData.tipoLink};`

          if (shouldSendJSON) {
            headingContent.push(headingContentData)
          } else {
            headingContent.push(query)
          }
        })
    })

    if (heading === "NOTÍCIAS") {
      headingContent.splice(-1)
    }

    return headingContent
  } catch (error) {
    console.log("Error @ getHeadingContent", error)
  }
}

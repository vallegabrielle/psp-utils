import axios from "axios"
import * as cheerio from "cheerio"

import { categorizeUrl } from "@/utils/categorize-url"
import { isAbsoluteUrl } from "@/utils/is-absolute-url"

type Data = {
  idWaram: string
  sessao: string
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

    const divsWithASD = $(`div > div > h2:contains(${heading})`)
      .parent()
      .parent()

    const links: (string | Data)[] = []
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

          const categoria = heading
            .toLowerCase()
            .replace(" ", "-")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")

          const data = {
            idWaram: id,
            sessao: categoria,
            titulo: title,
            descricao: description,
            urlImg: imgSrc,
            altImg: imgAlt,
            path: urlPath,
            isLinkExterno: linkExterno,
            link: href,
            tipoLink: categorizeUrl(href),
          }

          const query = `${data.idWaram}; ${data.sessao}; ${data.titulo}; ${data.descricao}; ${data.urlImg}; ${data.altImg}; ${data.path}; ${data.isLinkExterno}; ${data.link}; ${data.tipoLink};`

          if (shouldSendJSON) {
            links.push(data)
          } else {
            links.push(query)
          }
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

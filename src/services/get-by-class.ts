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

export async function getByClass(
  url: string,
  className: string,
  heading: string,
  shouldSendJSON = false
) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const divsWithClass = $(`${className}`)

    let titleHeading = "h3"
    if (heading === "cards-heading" || heading === "cards") {
      titleHeading = "h2"
    }

    const links: (string | Data)[] = []
    divsWithClass.each((index, element) => {
      const href = $(element).attr("href") || ""
      const src = $(element).attr("src") || ""
      const imgSrc = $(element).find("img").attr("src") || ""
      const imgAlt = $(element).find("img").attr("alt") || ""
      const title = $(element).find(titleHeading).text().trim()
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

      const data = {
        idWaram: id,
        sessao: categoria,
        titulo: title,
        descricao: description,
        urlImg: imgSrc,
        altImg: imgAlt,
        path: urlPath,
        isLinkExterno: linkExterno,
        link: linkFinal,
        tipoLink: categorizeUrl(linkFinal),
      }

      const str = `${data.idWaram}; ${data.sessao}; ${data.titulo}; ${data.descricao}; ${data.urlImg}; ${data.altImg}; ${data.path}; ${data.isLinkExterno}; ${data.link}; ${data.tipoLink};`

      if (shouldSendJSON) {
        links.push(data)
      } else {
        links.push(str)
      }
    })

    return links
  } catch (error) {
    console.log("Error @ getByClass:", error)
  }
}

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

    const elementsData: (string | Data)[] = []
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

      const categoria = heading
        .toLowerCase()
        .replace(" ", "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

      const elementData = {
        idWaram: id,
        secao: categoria,
        titulo: title,
        descricao: description,
        urlImg: imgSrc,
        altImg: imgAlt,
        path: urlPath,
        isLinkExterno: linkExterno,
        link: linkFinal,
        tipoLink: categorizeUrl(linkFinal),
      }

      const query = `${elementData.idWaram}; ${elementData.secao}; ${elementData.titulo}; ${elementData.descricao}; ${elementData.urlImg}; ${elementData.altImg}; ${elementData.path}; ${elementData.isLinkExterno}; ${elementData.link}; ${elementData.tipoLink};`

      if (shouldSendJSON) {
        elementsData.push(elementData)
      } else {
        elementsData.push(query)
      }
    })

    return elementsData
  } catch (error) {
    console.log("Error @ getByClass:", error)
  }
}

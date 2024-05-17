import axios from "axios"
import * as cheerio from "cheerio"

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

      let link = href
      if (src !== "") link = src

      const categoria = heading.toLowerCase().replace(" ", "-")
      const urlLinkExterno = linkExterno ? link : ""

      links.push(
        `${id}; ${categoria}; ${urlPath}; ${linkExterno}; ${urlLinkExterno};`
      )
    })

    return links
  } catch (error) {
    console.log("Error @ getByClass:", error)
  }
}

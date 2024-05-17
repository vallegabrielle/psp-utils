import axios from "axios"
import * as cheerio from "cheerio"

import { isAbsoluteUrl } from "@/utils/is-absolute-url"

type Carousel = {
  id: number
  href: string | undefined
  imgSrc: string | undefined
  imgAlt: string | undefined
  titulo: string | undefined
  descricao: string | undefined
  query?: string
}[]

export async function getCarrossel(url: string) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const carouselHtml = $("#carouselContent").html()

    if (!carouselHtml) return

    const $carouselContent = cheerio.load(carouselHtml)

    const carousel: Carousel = []

    $carouselContent(".item").each((index, element) => {
      const href = $(element).find("a").attr("href") || ""
      const imgSrc = $(element).find("img").attr("src")
      const imgAlt = $(element).find("img").attr("alt")
      const h2Text = $(element).find("h2").text().trim()
      const pText = $(element).find("p").text().trim()

      let id = ""
      if (href.includes("p=")) id = href.split("p=")[1]

      const originalPath = url.split("secretarias/")[1]
      let urlPath = originalPath || ""

      if (originalPath?.includes("index.php")) {
        urlPath = originalPath.split("index.php")[0]
      }

      const linkExterno =
        isAbsoluteUrl(href) && !href.includes("www.prefeitura.sp.gov.br")

      const urlLinkExterno = linkExterno ? href : ""

      carousel.push({
        id: index + 1,
        href,
        imgSrc,
        imgAlt,
        titulo: h2Text,
        descricao: pText,
        query: `${id}; carrosseis; ${urlPath}; ${linkExterno}; ${urlLinkExterno};`,
      })
    })

    return carousel
  } catch (error) {
    console.log("Error @ getCarrossel:", error)
  }
}

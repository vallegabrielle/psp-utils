import axios from "axios"
import * as cheerio from "cheerio"

import { categorizeUrl } from "@/utils/categorize-url"
import { isAbsoluteUrl } from "@/utils/is-absolute-url"

type Carousel = {
  id: number
  href: string | undefined
  imgSrc: string | undefined
  imgAlt: string | undefined
  titulo: string | undefined
  descricao: string | undefined
  query?: string
}

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
  query?: string
  imgSrc?: string
}

export async function getCarrossel(url: string, shouldSendHomeData = false) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const carouselHtml = $("#carouselContent").html()

    if (!carouselHtml) return

    const $carouselContent = cheerio.load(carouselHtml)

    const carousel: (Carousel | Data)[] = []

    $carouselContent(".item").each((index, element) => {
      const href = $(element).find("a").attr("href") || ""
      const imgSrc = $(element).find("img").attr("src") || ""
      const imgAlt = $(element).find("img").attr("alt") || ""
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

      const data = {
        idWaram: id,
        secao: "carrosseis",
        titulo: h2Text,
        descricao: pText,
        urlImg: imgSrc,
        altImg: imgAlt,
        path: urlPath,
        isLinkExterno: linkExterno,
        link: href,
        tipoLink: categorizeUrl(href),
      }

      const query = `${data.idWaram}; ${data.secao}; ${data.titulo}; ${data.descricao}; ${data.urlImg}; ${data.altImg}; ${data.path}; ${data.isLinkExterno}; ${data.link}; ${data.tipoLink};`

      if (shouldSendHomeData) {
        carousel.push(data)
      } else {
        carousel.push({
          id: index + 1,
          href,
          imgSrc,
          imgAlt,
          titulo: h2Text,
          descricao: pText,
          query,
        })
      }
    })

    return carousel
  } catch (error) {
    console.log("Error @ getCarrossel:", error)
  }
}

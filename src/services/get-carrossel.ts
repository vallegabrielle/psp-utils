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
      const anchor = $(element).find("a") || ""
      const href = anchor.attr("href") || ""
      const imgSrc = $(element).find("img").attr("src") || ""
      const imgAlt = $(element).find("img").attr("alt") || ""
      const h2Text = $(element).find("h2").text().trim()
      const pText = $(element).find("p").text().trim()
      const hasCarouselCaption = anchor.find("div").hasClass("carousel-caption");

      let id = ""
      if (href.includes("p=")) id = href.split("p=")[1]

      const originalPath = url.split("secretarias/")[1]
      let urlPath = originalPath || ""

      if (originalPath?.includes("index.php")) {
        urlPath = originalPath.split("index.php")[0]
      }

      const linkExterno =
        isAbsoluteUrl(href) && !href.includes("www.prefeitura.sp.gov.br")

      const carouselData = {
        idWaram: id,
        secao: "carrossel",
        titulo: hasCarouselCaption ? h2Text : "",
        descricao: hasCarouselCaption ? pText : "",
        urlImg: imgSrc,
        altImg: imgAlt,
        path: urlPath,
        isLinkExterno: linkExterno,
        link: href,
        tipoLink: categorizeUrl(href),
      }

      const query = `${carouselData.idWaram}; ${carouselData.secao}; ${carouselData.titulo}; ${carouselData.descricao}; ${carouselData.urlImg}; ${carouselData.altImg}; ${carouselData.path}; ${carouselData.isLinkExterno}; ${carouselData.link}; ${carouselData.tipoLink};`

      if (shouldSendHomeData) {
        carousel.push(carouselData)
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

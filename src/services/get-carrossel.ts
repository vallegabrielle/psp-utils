import axios from "axios"
import * as cheerio from "cheerio"

type Carousel = {
  href: string | undefined
  imgSrc: string | undefined
  imgAlt: string | undefined
  h2Text: string | undefined
  pText: string | undefined
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
      const href = $(element).find("a").attr("href")
      const imgSrc = $(element).find("img").attr("src")
      const imgAlt = $(element).find("img").attr("alt")
      const h2Text = $(element).find("h2").text().trim()
      const pText = $(element).find("p").text().trim()

      carousel.push({
        href,
        imgSrc,
        imgAlt,
        h2Text,
        pText,
      })
    })

    return carousel
  } catch (error) {
    console.log("Error @ getSecretarias:", error)
  }
}

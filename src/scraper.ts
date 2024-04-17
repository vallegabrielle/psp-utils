import axios from "axios"
import * as cheerio from "cheerio"

type ServiceInfo = {
  url: string
  image: string
  isExternalLink: boolean
}[]

type Contents = {
  title: string | null
  description: string | null
}[]

type MergedObj = {
  url: string
  image: string
  isExternalLink: boolean
  title: string | null
  description: string | null
}[]

async function getPageContent(url: string) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const title = $("#content > header > h2").html()
    const description = $("#content > header > h3").html()

    return { title, description }
  } catch (err) {
    console.log("Error @ getPageContent:", err)
  }
}

export async function scraper(url: string) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const hasServices = $('h2:contains("SERVIÇOS")').html()

    if (!hasServices) return

    const servicesSection = $(
      "div.panel.panel-default.panel-content.panel-notices"
    ).html()

    if (!servicesSection) return

    const $servicesSectionHtml = cheerio.load(servicesSection)

    const serviceInfo: ServiceInfo = []

    $servicesSectionHtml(".col-md-6.col-xs-12").each((index, element) => {
      const url = $(element).find("a").attr("href")
      const image = $(element).find("img").attr("src")

      if (!url || !image) return

      serviceInfo.push({
        url,
        image,
        isExternalLink: !url.includes("prefeitura.sp.gov.br"),
      })
    })

    const contents: Contents = []

    for (const info of serviceInfo) {
      try {
        const content = await getPageContent(info.url)
        if (!content) return
        contents.push(content)
      } catch (err) {
        console.log(err)
      }
    }

    const scraperRes = serviceInfo.map((obj, index) => {
      const mergedObj: MergedObj[number] = { ...obj, ...contents[index] }
      Object.keys(mergedObj).forEach(
        (key) =>
          mergedObj[key as keyof typeof mergedObj] === null &&
          delete mergedObj[key as keyof typeof mergedObj]
      )
      return mergedObj
    })

    return scraperRes
  } catch (err) {
    console.log("Error @ scraper:", err)
  }
}

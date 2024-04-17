import axios from "axios"
import * as cheerio from "cheerio"

type ScraperProps = {
  url: string
}

type ServiceInfo = {
  url: string
  image: string
  isExternalLink: boolean
}[]

export async function scraper({ url }: ScraperProps) {
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

    return serviceInfo
  } catch (err) {
    console.log("Error @ scraper:", err)
  }
}

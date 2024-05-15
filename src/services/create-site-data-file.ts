import * as fs from "fs"

type SitesData = {
  url: string
  hasCarrossel?: string | boolean | undefined
  hasServicos?: string | boolean | undefined
  isNoticia?: string | boolean | undefined
  isCard?: string | boolean | undefined
  isConteudo?: string | boolean | undefined
}[]

export function createSiteDataFile(sitesData: SitesData) {
  try {
    const sitesType = []

    let type = "NÃO FAZER"
    for (const [i, siteData] of sitesData.entries()) {
      if (Object.keys(siteData).length === 1 && "url" in siteData) {
        type = "NÃO FAZER"
      } else if (siteData.hasCarrossel || siteData.hasServicos) {
        type = "Home"
      } else if (siteData.isNoticia) {
        type = "Notícias"
      } else if (
        siteData.isCard &&
        !siteData.hasCarrossel &&
        !siteData.hasServicos
      ) {
        type = "Cards"
      } else if (siteData.isConteudo) {
        type = "Conteúdos"
      }

      sitesType.push(type)
      console.log(`${i + 1}/${sitesData.length} done`)
    }

    const filePath = `./secretaria-site-types.txt`
    const content = sitesType.join("\n")

    fs.writeFileSync(filePath, content)

    console.log(`File ${filePath} created successfully`)

    return sitesType
  } catch (error) {
    console.log("Error @ createSiteDataFile:", error)
  }
}

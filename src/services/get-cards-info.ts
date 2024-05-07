import axios from "axios"
import * as cheerio from "cheerio"

type CardInfo = {
  id: string
  isUrlExterna: boolean
  urlRedirect: string
  tipoPost: string
  urlImagem: string
  urlPath: string
  resumoPost: string
  query?: string
}[]

export async function getCardsInfo(url: string) {
  try {
    const res = await axios.get(url)

    if (res.status !== 200) return

    const html = res.data
    const $ = cheerio.load(html)

    const cardInfo: CardInfo = []

    $(".lnk-panel").each((index, element) => {
      const href = $(element).attr("href") || ""
      const urlImagem = $(element).find("img").attr("src") || ""
      const resumoPost = $(element).find("p").text().trim().replace(/\n/g, " ")
      const isUrlExterna = !href.includes("www.prefeitura.sp.gov.br")
      const urlRedirect = isUrlExterna ? href : ""

      const originalPath = href.split("secretarias/")[1]
      let urlPath = originalPath || ""

      if (originalPath?.includes("index.php")) {
        urlPath = originalPath.split("index.php")[0]
      }

      let id = "''"

      if (href.includes("p=")) id = href.split("p=")[1]

      let tipoPost = "text"
      const isImgText = urlImagem !== "" && resumoPost !== ""
      const isImg = urlImagem !== ""

      if (isImgText) {
        tipoPost = "text/img"
      } else if (isImg) {
        tipoPost = "img"
      }

      const query = `update posts set resumo_post='${resumoPost}', iscard=true, tipo_post='${tipoPost}', url_imagem='${urlImagem}', url_path='${urlPath}', url_externa=${isUrlExterna}, url_redirect='${urlRedirect}' where id=${id};`

      cardInfo.push({
        id,
        isUrlExterna,
        urlRedirect,
        tipoPost,
        urlImagem,
        urlPath,
        resumoPost,
        query,
      })
    })

    return cardInfo
  } catch (error) {
    console.log("Error @ getCardsInfo:", error)
  }
}

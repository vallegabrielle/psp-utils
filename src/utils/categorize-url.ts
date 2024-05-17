export function categorizeUrl(url: string) {
  const imagePattern = /\.(jpeg|jpg|gif|png|bmp|svg|webp)$/i
  const documentPattern = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i
  const webpagePattern = /\.(html|htm|php|asp|aspx|jsp)$/i

  if (imagePattern.test(url)) {
    return "imagem"
  } else if (documentPattern.test(url)) {
    return "documento"
  } else if (webpagePattern.test(url) || !/\.[a-z]{2,4}$/i.test(url)) {
    return "link"
  } else {
    return "link"
  }
}

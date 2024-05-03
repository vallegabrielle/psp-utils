async function getFile(url: string) {
  const file = await fetch(url.replace("http://", "https://"))
  const fileBLOB = await file.blob()
  return fileBLOB
}

async function postFile(file: Blob, parentFolderId: string) {
  const formData = new FormData()
  formData.append("file", file, "img_" + Math.random())

  const login = ""
  const password = ""

  const response = await fetch(
    `https://webserver-prefeiturasp-prd.lfr.cloud/o/headless-delivery/v1.0/document-folders/${parentFolderId}/documents`,
    {
      headers: {
        Authorization: "Basic " + btoa(`${login}:${password}`),
      },
      method: "POST",
      body: formData,
    }
  )
  const data = await response.json()
  return data
}

export async function uploadImages(
  imageSources: string[],
  parentFolderId: string
) {
  for (let i = 0; i < imageSources.length; i++) {
    const file = imageSources[i]

    console.log(`Processando imagem ${i + 1} de ${imageSources.length}`)

    const fileBLOB = await getFile(file)

    if (fileBLOB) {
      await postFile(fileBLOB, parentFolderId)
    }
  }
}

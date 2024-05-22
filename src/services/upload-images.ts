async function getFile(url: string) {
  const file = await fetch(url.replace("http://", "https://"))
  const fileBlob = await file.blob()
  return fileBlob
}

async function postFile(
  file: Blob,
  parentFolderId: string,
  login: string,
  password: string
) {
  const formData = new FormData()
  formData.append("file", file, "img_" + Math.random())

  const uploadInDocumentFoldersUrl = `https://webserver-prefeiturasp-prd.lfr.cloud/o/headless-delivery/v1.0/document-folders/${parentFolderId}/documents`

  const postFile = await fetch(uploadInDocumentFoldersUrl, {
    headers: {
      Authorization: "Basic " + btoa(`${login}:${password}`),
    },
    method: "POST",
    body: formData,
  })
  const postFileData = await postFile.json()
  return postFileData
}

export async function uploadImages(
  imageSources: string[],
  parentFolderId: string,
  login: string,
  password: string
) {
  for (let i = 0; i < imageSources.length; i++) {
    const file = imageSources[i]

    console.log(`Processando imagem ${i + 1} de ${imageSources.length}`)

    if (file === "") continue

    const fileBlob = await getFile(file)

    if (fileBlob) {
      await postFile(fileBlob, parentFolderId, login, password)
    }
  }
}

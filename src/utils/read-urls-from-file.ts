import * as fs from "fs"

export async function readUrlsFromFile(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err)
        return
      }
      const lines = data.trim().split("\n")
      const urls = lines
        .map((line) => line.trim())
        .filter((line) => line !== "")
      resolve(urls)
    })
  })
}

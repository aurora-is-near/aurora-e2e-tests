import * as path from "node:path"
import axios from "axios"
import fs from "fs-extra"

type DownloaderOptions = {
  url: string
  outputDir: string
  fileName: string
}

export const downloadFile = async ({
  url,
  outputDir,
  fileName,
}: DownloaderOptions): Promise<string> => {
  const filePath = path.join(outputDir, fileName)

  console.log(`[DEBUG] Downloading file from ${url}`)

  const res = await axios.get(url, {
    responseType: "stream",
  })

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath)

    res.data.pipe(writer)

    writer.on("finish", () => {
      resolve(filePath)
    })

    writer.on("error", (error) => {
      reject(new Error(`[Writer] ${error.message}`))
    })
  })
}

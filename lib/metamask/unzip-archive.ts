import * as path from "node:path"
import * as fs from "fs-extra"
import { Parse } from "unzipper"

export const unzipArchive = async (archivePath: string): Promise<string> => {
  const archiveFileExtension = archivePath.split(".").slice(-1)
  const outputPath = archivePath.replace(`.${archiveFileExtension}`, "")

  // Create the output directory
  fs.mkdirSync(outputPath, { recursive: true })

  // Unzip the archive
  return new Promise((resolve, reject) => {
    fs.createReadStream(archivePath)
      .pipe(Parse())
      .on("entry", (entry) => {
        const fileName = entry.path
        const type = entry.type as "Directory" | "File"

        if (type === "Directory") {
          fs.mkdirSync(path.join(outputPath, fileName), { recursive: true })

          return
        }

        if (type === "File") {
          const outputFilePath = path.join(outputPath, fileName)
          const outputFilePathDir = path.dirname(outputFilePath)

          if (!fs.existsSync(outputFilePathDir)) {
            fs.mkdirSync(outputFilePathDir, { recursive: true })
          }

          entry.pipe(fs.createWriteStream(outputFilePath))
        }
      })
      .promise()
      .then(() => {
        resolve(outputPath)
      })
      .catch((error: Error) => {
        fs.unlinkSync(outputPath)
        reject(new Error(`[Pipe] ${error.message}`))
      })
  })
}

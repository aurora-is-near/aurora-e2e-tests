import fs from "fs-extra"

import {
  METAMASK_EXTENSION_NAME,
  METAMASK_VERSION,
} from "../constants/metamask"
import { downloadFile } from "./download-file"
import { ensureCacheDirExists } from "./ensure-cache-dir-exists"
import { unzipArchive } from "./unzip-archive"

export const EXTENSION_DOWNLOAD_URL = `https://github.com/MetaMask/metamask-extension/releases/download/v${METAMASK_VERSION}/${METAMASK_EXTENSION_NAME}.zip`

export const prepareMetaMaskExtension = async () => {
  const cacheDirPath = ensureCacheDirExists()

  const extensionDetails = {
    url: EXTENSION_DOWNLOAD_URL,
    outputDir: cacheDirPath,
    fileName: `${METAMASK_EXTENSION_NAME}.zip`,
  }

  const filePath = `${extensionDetails.outputDir}/${extensionDetails.fileName}`

  if (!fs.existsSync(filePath)) {
    await downloadFile(extensionDetails)
  }

  return unzipArchive(filePath)
}

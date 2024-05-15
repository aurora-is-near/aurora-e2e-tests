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

  const downloadPath = await downloadFile({
    url: EXTENSION_DOWNLOAD_URL,
    outputDir: cacheDirPath,
    fileName: `${METAMASK_EXTENSION_NAME}.zip`,
  })

  return unzipArchive(downloadPath)
}

import * as path from "node:path"
import fs from "fs-extra"
import { CACHE_DIR } from "../constants/cache"

export const ensureCacheDirExists = () => {
  const cacheDirPath = path.join(process.cwd(), CACHE_DIR)

  fs.ensureDirSync(cacheDirPath)

  return cacheDirPath
}

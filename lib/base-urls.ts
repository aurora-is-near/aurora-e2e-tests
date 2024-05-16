import type { AppName } from "./types/app"

export const BASE_URLS: Record<AppName, string> = {
  "aurora-plus": process.env.AURORA_PLUS_BASE_URL ?? "https://aurora.plus",
}

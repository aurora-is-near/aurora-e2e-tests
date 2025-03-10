import type { BrowserContext } from "playwright"

export function parseFloatWithRounding(
  str: string,
  decimalPlaces: number,
): number {
  const parsed = parseFloat(str)
  const factor = 10 ** decimalPlaces // 10^decimalPlaces

  return Math.round(parsed * factor) / factor
}

export async function clearCountryCookie(context: BrowserContext) {
  let cookies = await context.cookies()
  cookies = cookies.filter((cookie) => cookie.name !== "aurora-plus-country")
  await context.clearCookies()
  await context.addCookies(cookies)
}

import type { APIRequestContext } from "playwright"

export async function getNearTokenValue(
  apiContextRequest: APIRequestContext,
): Promise<number> {
  const response = await apiContextRequest.get(
    "https://welcome-to-near.org/api/coingecko/all",
  )
  const responseBody = await response.json()
  const currentValueUSD = responseBody.near.usd

  return Math.round(parseFloat(currentValueUSD) * 0.01 * 100) / 1000
}

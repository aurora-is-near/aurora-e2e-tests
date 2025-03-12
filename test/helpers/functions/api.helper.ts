import type { APIRequestContext } from "playwright"
import { parseFloatWithRounding } from "./helper-functions"

export async function getNearTokenValue(
  apiContextRequest: APIRequestContext,
): Promise<number> {
  const response = await apiContextRequest.get(
    "https://welcome-to-near.org/api/coingecko/all",
  )
  const responseBody = await response.json()
  const currentValueUSD = responseBody.near.usd
  const oneCent = parseFloatWithRounding(currentValueUSD, 3)

  return parseFloatWithRounding((oneCent * 0.001).toString(), 6)
}

import type { Locator } from "playwright"

export function parseFloatWithRounding(
  str: string,
  decimalPlaces: number,
): number {
  const parsed = parseFloat(str)
  const factor = 10 ** decimalPlaces // 10^decimalPlaces

  return Math.round(parsed * factor) / factor
}

export const waitForStablePosition = async (
  locator: Locator,
  attempts = 10,
  delay = 1000,
): Promise<boolean> => {
  let prevBox = await locator.boundingBox()

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < attempts; i++) {
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      setTimeout(resolve, delay)
    })
    // eslint-disable-next-line no-await-in-loop
    const newBox = await locator.boundingBox()

    if (
      newBox &&
      prevBox &&
      Math.abs(newBox.x - prevBox.x) < 0.5 &&
      Math.abs(newBox.y - prevBox.y) < 0.5
    ) {
      return true
    }

    prevBox = newBox
  }

  return false
}

export function parseFloatWithRounding(
  str: string,
  decimalPlaces: number,
): number {
  const parsed = parseFloat(str)
  const factor = 10 ** decimalPlaces // 10^decimalPlaces

  return Math.round(parsed * factor) / factor
}

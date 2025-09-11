export function parseFloatWithRounding(
  str: string,
  decimalPlaces: number,
): number {
  const parsed = parseFloat(str)
  const factor = 10 ** decimalPlaces // 10^decimalPlaces

  return Math.round(parsed * factor) / factor
}

export function truncateAddress(addr: string, startChars = 6, endChars = 5) {
  if (!addr) {
    return addr
  }

  if (addr.length <= startChars + endChars) {
    return addr
  }

  return `${addr.slice(0, startChars)}…${addr.slice(-endChars)}`
}

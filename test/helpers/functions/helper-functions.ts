import type { BrowserContext, Page } from "playwright"

export function parseFloatWithRounding(
  str: string,
  decimalPlaces: number,
): number {
  const parsed = parseFloat(str)
  const factor = 10 ** decimalPlaces // 10^decimalPlaces

  return Math.round(parsed * factor) / factor
}

export async function waitForMetaMaskPage(
  context: BrowserContext,
  timeout = 10_000,
) {
  const start = Date.now()

  while (Date.now() - start < timeout) {
    const extPage = context.pages().find((p) => {
      const u = p.url()

      return (
        u &&
        (u.startsWith("chrome-extension://") ||
          u.startsWith("moz-extension://"))
      )
    })

    if (extPage) {
      // eslint-disable-next-line no-await-in-loop
      await extPage.waitForLoadState("domcontentloaded")

      return extPage
    }

    // eslint-disable-next-line no-promise-executor-return, no-await-in-loop
    await new Promise((r) => setTimeout(r, 150))
  }

  throw new Error("Timed out waiting for MetaMask extension page")
}

export async function waitForMetaMaskPageClosed(
  context: BrowserContext,
  timeout = 30_000,
) {
  const start = Date.now()

  while (Date.now() - start < timeout) {
    const allPages = context.pages()

    const extPages = allPages.filter((p) => {
      try {
        const u = p.url()

        return (
          u &&
          (u.startsWith("chrome-extension://") ||
            u.startsWith("moz-extension://"))
        )
      } catch {
        // Page is closed if we can't access it
        return false
      }
    })

    // Check if any extension pages are still visible/active
    const visibleExtPages = extPages.filter((page) => {
      try {
        return !page.isClosed()
      } catch {
        // Page is closed if we can't access it
        return false
      }
    })

    // MetaMask always keeps one extension page open when initialized
    // We consider MetaMask "closed" when only the persistent page remains
    if (visibleExtPages.length <= 1) {
      return true
    }

    // eslint-disable-next-line no-promise-executor-return, no-await-in-loop
    await new Promise((r) => setTimeout(r, 150))
  }

  throw new Error("Timed out waiting for MetaMask extension page to close")
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

type WagmiConnection = {
  accounts?: string[]
  chainId?: number
  connector?: { id?: string; name?: string; type?: string; uid?: string }
  [k: string]: unknown
}

type WagmiStore = {
  state?: {
    connections?: {
      __type?: string
      value?: [string, WagmiConnection][]
    }
    chainId?: number
    current?: string
  }
  version?: number
}

export async function waitForSingleWagmiAccount(
  page: Page,
  timeoutMs = 30_000,
  intervalMs = 1_000,
): Promise<{ account: string; connection: WagmiConnection }> {
  const deadline = Date.now() + timeoutMs

  while (Date.now() <= deadline) {
    // eslint-disable-next-line no-await-in-loop
    const cookies = await page.context().cookies()
    const wagmiCookie = cookies.find((c) => c.name === "wagmi.store")
    console.log(wagmiCookie)

    if (wagmiCookie?.value) {
      const tryValues: string[] = [wagmiCookie.value]

      try {
        const decoded = decodeURIComponent(wagmiCookie.value)

        if (decoded !== wagmiCookie.value) {
          tryValues.unshift(decoded)
        }
      } catch {
        /* empty */
      }

      let parsed: WagmiStore | null = null

      for (const raw of tryValues) {
        try {
          parsed = JSON.parse(raw)
          break
        } catch {
          /* empty */
        }
      }

      if (
        parsed?.state?.connections?.__type === "Map" &&
        Array.isArray(parsed.state.connections.value)
      ) {
        const foundAccounts: {
          account: string
          connection: WagmiConnection
        }[] = []

        for (const [, conn] of parsed.state.connections.value) {
          if (Array.isArray(conn.accounts)) {
            for (const acct of conn.accounts) {
              if (acct != null) {
                foundAccounts.push({ account: String(acct), connection: conn })
              }
            }
          }
        }

        if (foundAccounts.length === 1) {
          return foundAccounts[0]
        }
      }
    }

    // eslint-disable-next-line no-promise-executor-return, no-await-in-loop
    await new Promise((res) => setTimeout(res, intervalMs))
  }

  throw new Error(
    `Did not find exactly one account in cookies within ${timeoutMs}ms`,
  )
}

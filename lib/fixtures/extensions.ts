import { type BrowserContext, chromium, test } from "@playwright/test"
import path from "path"
import appRoot from "app-root-path"
import { CACHE_DIR } from "../constants/cache"
import { METAMASK_EXTENSION_NAME } from "../constants/metamask"

const METAMASK_EXTENSION_PATH = path.join(
  appRoot.path,
  CACHE_DIR,
  METAMASK_EXTENSION_NAME,
)

/**
 * Setup test fixtures for Chrome extensions.
 *
 * @see https://playwright.dev/docs/chrome-extensions
 */
export const extensionsTest = test.extend<{
  context: BrowserContext
  metamaskExtensionId: string
  baseUrl: string
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({ }, use) => {
    const browserArgs = [
      `--disable-extensions-except=${METAMASK_EXTENSION_PATH}`,
      `--load-extension=${METAMASK_EXTENSION_PATH}`,
      "--remote-debugging-port=9222",
    ]

    // if (process.env.CI) {
    //   browserArgs.push("--disable-gpu")
    // }

    if (process.env.HEADLESS_MODE) {
      browserArgs.push("--headless=new")
    }

    // launch browser
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: browserArgs,
    })

    await use(context)
    await context.close()
  },
})

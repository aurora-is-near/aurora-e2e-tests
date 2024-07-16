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
  extensionId: string
  baseUrl: string
}>({
  // eslint-disable-next-line no-empty-pattern, prettier/prettier
  context: async ({ }, use) => {
    // const pathToExtension = path.join(__dirname, 'my-extension');
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${METAMASK_EXTENSION_PATH}`,
        `--load-extension=${METAMASK_EXTENSION_PATH}`,
      ],
    })
    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    /*
    // for manifest v2:
    let [background] = context.backgroundPages()
    if (!background)
      background = await context.waitForEvent('backgroundpage')
    */

    // for manifest v3:
    let [background] = context.serviceWorkers()

    if (!background) {
      background = await context.waitForEvent("serviceworker")
    }

    const extensionId = background.url().split("/")[2]
    await use(extensionId)
  },
})
export const { expect } = test

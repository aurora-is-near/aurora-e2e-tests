// eslint-disable-next-line no-restricted-imports
import { test } from "@playwright/test"

const PASSWORD = "password"
const SEED_PHRASE =
  "test test test test test test test test test test test junk"

const RPC_URL = "https://mainnet.aurora.dev"
const CHAIN_ID = "1313161554"
const CURRENCY = "ETH"

/**
 * Setup test fixtures for MetaMask.
 */
export const metamaskTest = test.extend<{
  metamaskExtensionId: string
  setupMetaMask: () => Promise<void>
}>({
  metamaskExtensionId: async ({ page }, use) => {
    await page.goto("chrome://extensions")

    const devModeToggle = page.locator("id=devMode")

    if (!(await devModeToggle.getAttribute("checked"))) {
      await devModeToggle.click()
    }

    const extensionId = (
      await page.locator("id=extension-id").textContent()
    )?.match(/ID:\s(.+)/)?.[1]

    if (!extensionId) {
      throw new Error("Metamask extension ID not found")
    }

    await use(extensionId)
  },
  setupMetaMask: async ({ page, metamaskExtensionId }, use) => {
    await use(async () => {
      await page.goto(`chrome-extension://${metamaskExtensionId}/home.html`)
      await page.bringToFront()
      await page.getByTestId("onboarding-terms-checkbox").click()
      await page.getByTestId("onboarding-import-wallet").click()
      await page.getByTestId("metametrics-i-agree").click()

      for (const [index, word] of SEED_PHRASE.split(" ").entries()) {
        // eslint-disable-next-line no-await-in-loop
        await page.getByTestId(`import-srp__srp-word-${index}`).fill(word)
      }

      await page.getByTestId("import-srp-confirm").click()
      await page.getByTestId("create-password-new").fill(PASSWORD)
      await page.getByTestId("create-password-confirm").fill(PASSWORD)
      await page.getByTestId("create-password-terms").click()
      await page.getByTestId("create-password-import").click()
      await page.getByTestId("onboarding-complete-done").click()
      await page.getByTestId("pin-extension-next").click()
      await page.getByTestId("pin-extension-done").click()

      await page.goto(
        `chrome-extension://${metamaskExtensionId}/home.html#settings/networks/add-network`,
      )

      await page.getByTestId("network-form-network-name").fill("Aurora Mainnet")
      await page.getByTestId("network-form-rpc-url").fill(RPC_URL)
      await page.getByTestId("network-form-chain-id").fill(CHAIN_ID)
      await page.getByTestId("network-form-ticker-input").fill(CURRENCY)
      await page.getByText("Save").click()
    })
  },
})

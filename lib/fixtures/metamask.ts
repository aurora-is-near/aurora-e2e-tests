import { test } from "@playwright/test"
import generatePassword from "generate-password"

type Metamask = {
  setup: () => Promise<void>
}

const DEFAULT_WALLET_SEED_PHRASE =
  "test test test test test test test test test test test junk"

/**
 * Setup test fixtures for MetaMask.
 */
export const metamaskTest = test.extend<{
  metamaskExtensionId: string
  metamask: Metamask
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
  metamask: async ({ page, metamaskExtensionId }, use) => {
    const password =
      process.env.WALLET_PASSWORD ??
      generatePassword.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        strict: true,
      })

    const seedPhrase =
      process.env.WALLET_SEED_PHRASE ?? DEFAULT_WALLET_SEED_PHRASE

    const getExtensionUrl = (path: string) =>
      `chrome-extension://${metamaskExtensionId}/${path.replace(/^\//, "")}`

    await use({
      setup: async () => {
        await page.goto(getExtensionUrl("home.html"))
        await page.bringToFront()
        await page.getByTestId("onboarding-terms-checkbox").click()
        await page.getByTestId("onboarding-import-wallet").click()
        await page.getByTestId("metametrics-i-agree").click()

        for (const [index, word] of seedPhrase.split(" ").entries()) {
          // eslint-disable-next-line no-await-in-loop
          await page.getByTestId(`import-srp__srp-word-${index}`).fill(word)
        }

        await page.getByTestId("import-srp-confirm").click()
        await page.getByTestId("create-password-new").fill(password)
        await page.getByTestId("create-password-confirm").fill(password)
        await page.getByTestId("create-password-terms").click()
        await page.getByTestId("create-password-import").click()

        await page.waitForTimeout(1000)

        await page.getByTestId("onboarding-complete-done").click()
        await page.getByTestId("pin-extension-next").click()
        await page.getByTestId("pin-extension-done").click()
      },
    })
  },
})

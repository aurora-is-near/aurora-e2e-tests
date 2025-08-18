import { expect } from "@playwright/test"
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright"
import { testWithSynpress } from "@synthetixio/synpress"

import { shortTimeout } from "../../helpers/constants/timeouts"
import trisolarisSetup from "../../wallet-setup/trisolaris.setup"

export const test = testWithSynpress(metaMaskFixtures(trisolarisSetup)).extend<{
  trisolarisPreconditions: {
    loginToTrisolaris: () => Promise<void>
  }
}>({
  trisolarisPreconditions: async ({ page, context, extensionId }, use) => {
    const metamask = new MetaMask(
      context,
      page,
      trisolarisSetup.walletPassword,
      extensionId,
    )
    const loginButton = page.getByRole("button", {
      name: "Connect Wallet",
    })
    const metamaskOptionInPopUp = page.locator("button#connect-METAMASK")

    const accountDetailsCloseBtn = page.getByRole("img").first()

    const loginToTrisolaris = async () => {
      let messageOnFail: string = '"Connect Wallet" button is not visible'
      await expect(loginButton, messageOnFail).toBeVisible(shortTimeout)
      await loginButton.click()

      messageOnFail = "MetaMask login option is not visible in pop up"
      await expect(metamaskOptionInPopUp, messageOnFail).toBeVisible(
        shortTimeout,
      )
      await metamaskOptionInPopUp.click()

      await metamask.connectToDapp()

      await accountDetailsCloseBtn.click()
    }

    await use({
      loginToTrisolaris,
    })
  },
})

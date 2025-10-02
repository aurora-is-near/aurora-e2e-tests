import { expect } from "@playwright/test"
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright"
import { testWithSynpress } from "@synthetixio/synpress"

import { shortTimeout } from "../../helpers/constants/timeouts"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"

export const test = testWithSynpress(
  metaMaskFixtures(nearWeb3ProdSetup),
).extend<{
  calyxPreconditions: {
    loginToCalyx: () => Promise<void>
    signInMetamaskAccount: () => Promise<void>
  }
}>({
  calyxPreconditions: async ({ page, context, extensionId }, use) => {
    const metamask = new MetaMask(
      context,
      page,
      nearWeb3ProdSetup.walletPassword,
      extensionId,
    )

    const signInButton = page.getByRole("button", { name: "Sign in" })

    const continueWithWalletBtn = page.getByRole("button", {
      name: "Continue with a wallet",
    })

    const metamaskConnectBtn = page.getByRole("button", { name: "MetaMask" })

    const loginToCalyx = async () => {
      const messageOnFail: string = '"Sign in" button is not visible'
      await expect(signInButton, messageOnFail).toBeVisible(shortTimeout)
      await expect(signInButton, messageOnFail).toBeEnabled(shortTimeout)
      await signInButton.click()

      await expect(continueWithWalletBtn).toBeVisible(shortTimeout)
      await expect(continueWithWalletBtn).toBeEnabled(shortTimeout)
      await continueWithWalletBtn.click()

      await expect(metamaskConnectBtn).toBeVisible(shortTimeout)
      await expect(metamaskConnectBtn).toBeEnabled(shortTimeout)
      await metamaskConnectBtn.click()

      await metamask.connectToDapp()
    }

    const signInMetamaskAccount = async () => {
      await metamask.approveNewNetwork()
      await metamask.approveSwitchNetwork()

      // find the popup window
      // confirm sign-in button is visible and click it
      const pages = context.pages()

      for (const p of pages) {
        // Example: match chrome-extension:// to detect extension UI
        if (p.url().endsWith("notification.html#")) {
          console.log("Found extension page:", p.url())
          // bring to front and interact:
          // eslint-disable-next-line no-await-in-loop
        //   await p.bringToFront()
          // eslint-disable-next-line no-await-in-loop
          await p.click('button[data-testid="page-container-footer-next"]')
        }
      }

      await page.pause()

      await metamask.confirmSignature()
    }

    await use({
      loginToCalyx,
      signInMetamaskAccount,
    })
  },
})

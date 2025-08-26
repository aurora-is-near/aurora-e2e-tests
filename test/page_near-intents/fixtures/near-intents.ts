import { expect } from "@playwright/test"
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright"
import { testWithSynpress } from "@synthetixio/synpress"

import { shortTimeout } from "../../helpers/constants/timeouts"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"

export const test = testWithSynpress(
  metaMaskFixtures(nearWeb3ProdSetup),
).extend<{
  nearIntentsPreconditions: {
    loginToNearIntents: () => Promise<void>
    loginToNearIntentsAccount: (accountString: string) => Promise<void>
    isSignatureCheckRequired: () => Promise<void>
  }
}>({
  nearIntentsPreconditions: async ({ page, context, extensionId }, use) => {
    const metamask = new MetaMask(
      context,
      page,
      nearWeb3ProdSetup.walletPassword,
      extensionId,
    )

    const signInButton = page
      .getByRole("banner")
      .getByRole("button", { name: "Sign in" })

    const metamaskButton = page.getByRole("button", {
      name: "MetaMask MetaMask",
    })

    const signatureCheckRequiredPopup = page.getByLabel(
      "Signature Check Required",
    )

    const checkCompatibility = page.getByRole("button", {
      name: "Check Compatibility",
    })

    const loginToNearIntents = async () => {
      let messageOnFail: string = '"Sign in" button is not visible'
      await expect(signInButton, messageOnFail).toBeVisible(shortTimeout)
      await signInButton.click()

      messageOnFail = "MetaMask login option is not visible in pop up"
      await expect(metamaskButton, messageOnFail).toBeVisible(shortTimeout)
      await metamaskButton.click()

      await metamask.connectToDapp()
    }

    const loginToNearIntentsAccount = async (accountString: string) => {
      let messageOnFail: string = '"Log in with Ethereum" button is not visible'
      await expect(signInButton, messageOnFail).toBeVisible(shortTimeout)
      await signInButton.click()

      messageOnFail = "MetaMask login option is not visible in pop up"
      await expect(metamaskButton, messageOnFail).toBeVisible(shortTimeout)
      await metamaskButton.click()

      await metamask.connectToDapp([accountString])
    }

    const isSignatureCheckRequired = async () => {
      const isPopupVisible =
        await signatureCheckRequiredPopup.isVisible(shortTimeout)

      if (isPopupVisible) {
        await expect(checkCompatibility).toBeVisible(shortTimeout)
        await checkCompatibility.click()
        await metamask.confirmSignature()
      }
    }

    await use({
      loginToNearIntents,
      loginToNearIntentsAccount,
      isSignatureCheckRequired,
    })
  },
})

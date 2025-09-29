import { expect } from "@playwright/test"
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright"
import { testWithSynpress } from "@synthetixio/synpress"

import { longTimeout, shortTimeout } from "../../helpers/constants/timeouts"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"
import { waitForMetaMaskPage } from "../../helpers/functions/helper-functions"

export const test = testWithSynpress(
  metaMaskFixtures(nearWeb3ProdSetup),
).extend<{
  nearIntentsPreconditions: {
    loginToNearIntents: () => Promise<void>
    loginToNearIntentsAccount: (accountString: string) => Promise<void>
    isSignatureCheckRequired: () => Promise<void>
    waitForAccountSync: () => Promise<void>
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
      await expect(signatureCheckRequiredPopup).toBeVisible(shortTimeout)
      await expect(checkCompatibility).toBeVisible(shortTimeout)
      await expect(checkCompatibility).toBeEnabled(shortTimeout)
      await checkCompatibility.click()
      await waitForMetaMaskPage(context)
      await metamask.confirmSignature()
    }

    const getAccountAddress = async (
      opts = { timeout: 5000, polling: 200 },
    ) => {
      const { timeout, polling } = opts

      const address = await page.waitForFunction(
        () => {
          if (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            !(window as any).ethereum ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            typeof (window as any).ethereum.request !== "function"
          ) {
            return null
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
          return (window as any).ethereum
            .request({ method: "eth_accounts" })
            .then((accounts: string[]) => {
              return accounts?.length ? accounts[0] : null
            })
            .catch(() => null)
        },
        { timeout, polling },
      )

      const currentAddress = await address.jsonValue()

      if (currentAddress) {
        return String(currentAddress).toLowerCase()
      }

      return ""
    }

    const waitForAccountSync = async (
      opts = { timeout: 5000, polling: 200 },
    ) => {
      const accountIndicator = page
        .locator('div[data-sentry-component="ConnectWallet"]')
        .getByRole("button")
      await expect(accountIndicator).toBeVisible(longTimeout)

      const currentAddress = await getAccountAddress(opts)

      const truncatedAddress = currentAddress.substring(0, 4)

      const uiAccountIndicator = await accountIndicator.innerText()
      expect(
        uiAccountIndicator.toLocaleLowerCase().startsWith(truncatedAddress),
      ).toBeTruthy()
    }

    await use({
      loginToNearIntents,
      loginToNearIntentsAccount,
      isSignatureCheckRequired,
      waitForAccountSync,
    })
  },
})

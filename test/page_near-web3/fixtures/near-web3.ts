import { expect } from "@playwright/test"
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright"
import { testWithSynpress } from "@synthetixio/synpress"

import { shortTimeout } from "../../helpers/constants/timeouts"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"
import { truncateAddress, waitForMetaMaskPageClosed } from "../../helpers/functions/helper-functions"

export const test = testWithSynpress(
  metaMaskFixtures(nearWeb3ProdSetup),
).extend<{
  nearWeb3Preconditions: {
    loginToNearWeb3: () => Promise<void>
    loginToNearWeb3Account: (accountString: string) => Promise<void>
    confirmAccountLoggedIn: () => Promise<void>
  }
}>({
  nearWeb3Preconditions: async ({ page, context, extensionId }, use) => {
    const metamask = new MetaMask(
      context,
      page,
      nearWeb3ProdSetup.walletPassword,
      extensionId,
    )
    const loginWithEthereumButton = page
      .getByRole("banner")
      .getByRole("button", { name: "Log in with Ethereum" })
    const metamaskOptionInPopUp = page.getByRole("button", {
      name: "MetaMask MetaMask installed",
    })

    const accountIndicator = page.locator(
      'button[id="headlessui-menu-button-\\:rc\\:"]',
    )

    const loginToNearWeb3 = async () => {
      let messageOnFail: string = '"Log in with Ethereum" button is not visible'
      await expect(loginWithEthereumButton, messageOnFail).toBeVisible(
        shortTimeout,
      )
      await loginWithEthereumButton.click()

      messageOnFail = "MetaMask login option is not visible in pop up"
      await expect(metamaskOptionInPopUp, messageOnFail).toBeVisible(
        shortTimeout,
      )
      await metamaskOptionInPopUp.click()

      await metamask.connectToDapp()

      await waitForMetaMaskPageClosed(context)
    }

    const loginToNearWeb3Account = async (accountString: string) => {
      let messageOnFail: string = '"Log in with Ethereum" button is not visible'
      await expect(loginWithEthereumButton, messageOnFail).toBeVisible(
        shortTimeout,
      )
      await loginWithEthereumButton.click()

      messageOnFail = "MetaMask login option is not visible in pop up"
      await expect(metamaskOptionInPopUp, messageOnFail).toBeVisible(
        shortTimeout,
      )
      await metamaskOptionInPopUp.click()

      await metamask.connectToDapp([accountString])

      await waitForMetaMaskPageClosed(context)
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

    const confirmAccountLoggedIn = async (
      opts = { timeout: 5000, polling: 200 },
    ) => {
      const currentAddress = await getAccountAddress(opts)

      const truncatedAddress = currentAddress
        ? truncateAddress(currentAddress)
        : ""

      const uiAccountIndicator = await accountIndicator.innerText()

      if (truncatedAddress !== "") {
        expect(truncatedAddress).toEqual(uiAccountIndicator)
      } else {
        test.fail()
      }
    }

    await use({
      loginToNearWeb3,
      loginToNearWeb3Account,
      confirmAccountLoggedIn,
    })
  },
})

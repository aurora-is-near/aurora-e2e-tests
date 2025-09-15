import { expect } from "@playwright/test"
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright"
import { testWithSynpress } from "@synthetixio/synpress"

import { midTimeout, shortTimeout } from "../../helpers/constants/timeouts"
import trisolarisSetup from "../../wallet-setup/aurora-plus.setup"
import { truncateAddress } from "../../helpers/functions/helper-functions"

export const test = testWithSynpress(metaMaskFixtures(trisolarisSetup)).extend<{
  trisolarisPreconditions: {
    loginToTrisolaris: () => Promise<void>
    confirmAccountLoggedIn: () => Promise<void>
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

    const accountIndicator = page.getByRole("button", { name: "0x" })

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

      await expect(accountIndicator).toBeVisible(midTimeout)
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

      await page.pause()
      const currentAddress = await address.jsonValue()

      if (currentAddress) {
        return String(currentAddress)
      }

      return ""
    }

    const confirmAccountLoggedIn = async (
      opts = { timeout: 5000, polling: 200 },
    ) => {
      const currentAddress = await getAccountAddress(opts)

      const truncatedAddress = currentAddress
        ? truncateAddress(currentAddress, 6, 4)
        : ""

      const uiAccountIndicator = await accountIndicator.innerText()

      if (truncatedAddress !== "") {
        expect(truncatedAddress).toEqual(uiAccountIndicator)
      } else {
        test.fail()
      }
    }

    await use({
      loginToTrisolaris,
      confirmAccountLoggedIn,
    })
  },
})

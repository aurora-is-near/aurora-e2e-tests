import { expect } from "@playwright/test"
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright"
import { testWithSynpress } from "@synthetixio/synpress"

import { shortTimeout } from "../../helpers/constants/timeouts"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"

export const test = testWithSynpress(
  metaMaskFixtures(nearWeb3ProdSetup),
).extend<{
  nearWeb3Preconditions: {
    loginToNearWeb3: () => Promise<void>
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
    }

    await use({
      loginToNearWeb3,
    })
  },
})

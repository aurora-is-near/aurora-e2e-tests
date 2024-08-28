import { expect } from "@playwright/test"
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright"
import { testWithSynpress } from "@synthetixio/synpress"

import { shortTimeout } from "../../helpers/constants/timeouts"
import nearWeb3TestSetup from "../../../test/wallet-setup/near-web3-test.setup"
import nearWeb3ProdSetup from "../../../test/wallet-setup/near-web3-prod.setup"

const isTestNet = (process.env.NEAR_NETWORK as string) === "testnet"

export const test = testWithSynpress(
  metaMaskFixtures(isTestNet ? nearWeb3TestSetup : nearWeb3ProdSetup),
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

    const loginSteps = async () => {
      await expect(
        loginWithEthereumButton,
        '"Log in with Ethereum" button is not visible',
      ).toBeVisible(shortTimeout)
      await loginWithEthereumButton.click()

      await expect(
        metamaskOptionInPopUp,
        "MetaMask login option is not visible in pop up",
      ).toBeVisible(shortTimeout)
      await metamaskOptionInPopUp.click()

      await metamask.connectToDapp()
    }

    await use({
      loginToNearWeb3: async () => {
        await loginSteps()
      },
    })
  },
})

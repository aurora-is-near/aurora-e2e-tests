import { type Response, test } from "@playwright/test"
import { MetamaskActions } from "../../helpers/metamask.actions"
import { prepareMetaMaskExtension } from "../../../lib/metamask/prepare-metamask-extension"

const metamaskActions = new MetamaskActions()

const BASE_URL =
  process.env.WEB3_WALLET_BASE_URL ?? "https://web3-wallet-three.vercel.app/"

/**
 * Setup test fixtures for our apps.
 */
export const web3walletTest = test.extend<{
  web3wallet: {
    goto: (url: string) => Promise<null | Response>
    installMetaMask: () => Promise<void>
    connectToMetaMask: () => Promise<void>
  }
}>({
  web3wallet: async ({ page, context }, use) => {
    // Selectors
    const loginWithEthereumButton = page
      .getByRole("banner")
      .getByRole("button", { name: "Log in with Ethereum" })

    const metamaskButtonInModal = page.getByRole("button", {
      name: "MetaMask MetaMask installed",
    })

    await use({
      goto: async (url: string) => page.goto(new URL(url, BASE_URL).href),
      installMetaMask: async () => {
        await prepareMetaMaskExtension()
      },
      connectToMetaMask: async () => {
        await page.evaluate(() => {
          localStorage.setItem("ap-promo-hidden", "1")
        })

        await loginWithEthereumButton.click()

        await metamaskButtonInModal.click()

        const metamaskContext =
          await metamaskActions.switchContextToExtension(context)

        await metamaskContext.waitForLoadState("domcontentloaded")

        await metamaskActions.clickNext(metamaskContext)
        await metamaskActions.clickConnect(metamaskContext)
        await metamaskActions.clickApprove(metamaskContext)

        await metamaskActions.clickSwitchNetworkButton(metamaskContext)

        await page.pause()

        await metamaskActions.switchContextToPage(page)

        // const signPopupPromise = context.waitForEvent("page")

        // await page
        //   .getByTestId("connect-modal")
        //   .getByRole("button", { name: "Accept and sign" })
        //   .click()

        // const signPage = await signPopupPromise

        // await signPage.getByRole("button", { name: "Sign" }).click()

        await metamaskActions.switchContextToPage(page)
      },
    })
  },
})

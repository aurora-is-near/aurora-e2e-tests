import { MetaMask } from "@synthetixio/synpress/playwright"
import {
  WEB3_WALLET_TAG,
  WEB3_WALLET_TAG_SWAPPING,
} from "../../helpers/constants/tags"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"
import { test } from "../fixtures/near-web3"
import { HomePage } from "../pages/home.page"
import { NEAR_WEB3_PAGE } from "../../helpers/constants/pages"

test.use(NEAR_WEB3_PAGE)

test.beforeEach(
  "Login to Near Web3 wallet with MetaMask",
  async ({ nearWeb3Preconditions }) => {
    await nearWeb3Preconditions.loginToNearWeb3()
  },
)
test.describe(
  "NEAR Web3 Wallet: Home Page - Swapping",
  { tag: [WEB3_WALLET_TAG, WEB3_WALLET_TAG_SWAPPING] },
  () => {
    test(`Confirm that user cannot swap more than the balance contains`, async ({
      page,
    }) => {
      const transferAmount = 9999
      const homePage = new HomePage(page)
      await homePage.confirmHomePageLoaded()
      await homePage.scrollToSwapContainer()
      await homePage.selectTokenToSwapFrom("NEAR")
      await homePage.enterSwapFromAmount(transferAmount)
      await homePage.confirmSwapButtonNotAvailable()
    })

    const tokensFromTo = [
      { tokenFrom: "NEAR", tokenTo: "USDt", swapAmount: 0.01 },
      { tokenFrom: "NEAR", tokenTo: "USDT.e", swapAmount: 0.01 },
      { tokenFrom: "NEAR", tokenTo: "ETH", swapAmount: 0.01 },
      { tokenFrom: "ETH", tokenTo: "NEAR", swapAmount: 0.00001 },
      { tokenFrom: "USDT.e", tokenTo: "NEAR", swapAmount: 0.01 },
    ]

    for (const transfers of tokensFromTo) {
      const {
        tokenFrom,
        tokenTo,
        swapAmount,
      }: { tokenFrom: string; tokenTo: string; swapAmount: number } = transfers
      test(`Confirm that user can swap some tokens from ${tokenFrom}, to ${tokenTo} for ${swapAmount}`, async ({
        page,
        context,
        extensionId,
      }) => {
        const homePage = new HomePage(page)
        const metamask = new MetaMask(
          context,
          page,
          nearWeb3ProdSetup.walletPassword,
          extensionId,
        )

        await homePage.confirmHomePageLoaded()
        await homePage.scrollToSwapContainer()
        await homePage.selectTokenToSwapFrom(tokenFrom)
        await homePage.enterSwapFromAmount(swapAmount)
        const balanceBefore = await homePage.getFromTokenBalance()
        // check if we have enough balance for swapping with gas fee
        test.skip(
          Number(balanceBefore) < Number(swapAmount + 0.2),
          `Insufficient funds for sending, balance: ${balanceBefore}, transfer: ${swapAmount}`,
        )
        await homePage.selectTokenToSwapTo(tokenTo)
        await homePage.clickSwapButton()
        await homePage.confirmTransactionPopup()
        await metamask.confirmTransaction()
        await homePage.confirmTransactionPopup()
        await metamask.confirmTransaction()
        await homePage.confirmSuccessNotificationAppears()
        const balanceAfter = await homePage.getFromTokenBalance()
        homePage.confirmTransactionWasCorrect(
          balanceBefore,
          balanceAfter,
          swapAmount,
        )

        await homePage.restoreToDefaultTokens(tokenFrom, tokenTo)
      })
    }
  },
)

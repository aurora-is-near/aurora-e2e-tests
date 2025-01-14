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
      { from: "NEAR", to: "USDt" },
      // { from: "NEAR", to: "wNEAR" },
      // { from: "NEAR", to: "USDT.e" },
      // { from: "NEAR", to: "ETH" },
      // { from: "ETH", to: "NEAR" },
      // { from: "USDT.e", to: "NEAR" },
    ]

    for (const transfers of tokensFromTo) {
      const tokenFrom = transfers.from
      const tokenTo = transfers.to
      test(`Confirm that user can swap some tokens from ${tokenFrom}, to ${tokenTo}`, async ({
        page,
        context,
        extensionId,
      }) => {
        const transferAmount = 0.1
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
        await homePage.enterSwapFromAmount(transferAmount)
        const balanceBefore = await homePage.getFromTokenBalance()
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
          transferAmount,
        )

        // TODO: Remove once test ids will be set
        await homePage.restoreToDefaultTokens(tokenFrom, tokenTo)
      })
    }
  },
)

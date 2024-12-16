import { MetaMask } from "@synthetixio/synpress/playwright"
import {
  WEB3_WALLET_TAG,
  WEB3_WALLET_TAG_SWAPPING,
} from "../../helpers/constants/tags"
import { nearEnvironment } from "../../helpers/functions/system-variables"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"
import { test } from "../fixtures/near-web3"
import { HomePage } from "../pages/home.page"

test.use(nearEnvironment())

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
    const tokenFrom = "NEAR"

    test(`Confirm that user cannot swap more than the balance contains`, async ({
      page,
    }) => {
      const transferAmount = 9999
      const homePage = new HomePage(page)
      await homePage.confirmHomePageLoaded("/")
      await homePage.scrollToSwapContainer()
      await homePage.selectTokenToSwapFrom(tokenFrom)
      await homePage.enterSwapFromAmount(transferAmount)
      await homePage.confirmSwapButtonNotAvailable()
    })

    const tokenTo = "REF"
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

      await homePage.confirmHomePageLoaded("/")
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
  },
)

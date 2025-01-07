import { MetaMask } from "@synthetixio/synpress/playwright"
import {
  AURORA_PLUS_TAG,
  AURORA_PLUS_TAG_SWAPPING,
} from "../../helpers/constants/tags"
import { test } from "../fixtures/aurora-plus"
import { SwapPage } from "../pages/swap.page"
import { DashboardPage } from "../pages/dashboard.page"
import { AURORA_PLUS_PAGE } from "../../helpers/constants/pages"
import auroraSetup from "../../wallet-setup/aurora-plus.setup"

test.use(AURORA_PLUS_PAGE)

test.describe(
  "Aurora Plus: Swap Page - Swapping",
  { tag: [AURORA_PLUS_TAG, AURORA_PLUS_TAG_SWAPPING] },
  () => {
    test.beforeEach(
      "Login to Aurora Plus with MetaMask",
      async ({ auroraPlusPreconditions }) => {
        await auroraPlusPreconditions.loginToAuroraPlus()
      },
    )

    const amount: number = 0.1

    const transferFromTo: string[][] = [
      ["AURORA", "BRRR"],
      ["AURORA", "wNEAR"],
      ["AURORA", "USDC.e"],
      ["AURORA", "ETH"],
      ["BRRR", "AURORA"],
      ["ETH", "AURORA"],
      ["USDC.e", "AURORA"],
    ]

    for (const transfer of transferFromTo) {
      const tokenWithBalance: string = transfer[0]
      const destinationToken: string = transfer[1]

      // Done
      test(`Confirm that user cannot swap more from ${tokenWithBalance} to ${destinationToken} than balance allows`, async ({
        context,
        page,
        extensionId,
      }) => {
        const swapPage = new SwapPage(page)
        const dashboardPage = new DashboardPage(page)
        const metamask = new MetaMask(
          context,
          page,
          auroraSetup.walletPassword,
          extensionId,
        )
        await dashboardPage.navigateToSwapPage()
        await swapPage.selectTokenWithBalance(tokenWithBalance)
        const amountBefore = await swapPage.getAvailableToTradeBalance()
        test.skip(
          amountBefore > amount,
          `Insufficient balance for make transaction from ${tokenWithBalance}`,
        )
        await swapPage.selectDestinationSupportedToken(destinationToken)
        await swapPage.enterSwapFromAmount(amount)
        await swapPage.clickReviewSwapButton()
        await swapPage.confirmThatReviewYourSwapModalVisible()
        await swapPage.clickSwapNowButton()
        await metamask.confirmTransaction()
        test.fail() // REMOVE when JSON-RPC issue will be resolved. Amount of free transactions for used account should be increased
        await swapPage.waitForActionToComplete()
        await swapPage.confirmTransactionData(
          tokenWithBalance,
          destinationToken,
          amount,
        )
        await swapPage.clickSwapNowButton()
        await metamask.confirmTransaction()
        await swapPage.waitForActionToComplete()
        const amountAfter = await swapPage.getAvailableToTradeBalance()
        swapPage.confirmSwapWasCompleted(amountBefore, amountAfter, amount)
      })
    }
  },
)

import { MetaMask } from "@synthetixio/synpress/playwright"
import { AURORA_PLUS_TAG } from "../../helpers/constants/tags"
import { test } from "../fixtures/aurora-plus"
import { SwapPage } from "../pages/swap.page"
import { DashboardPage } from "../pages/dashboard.page"
import { AURORA_PLUS_PAGE } from "../../helpers/constants/pages"
import auroraSetup from "../../wallet-setup/aurora-plus.setup"

test.use(AURORA_PLUS_PAGE)

test.describe("Aurora Plus: Swapping", { tag: AURORA_PLUS_TAG }, () => {
  test.beforeEach(
    "Login to Aurora Plus with MetaMask",
    async ({ auroraPlusPreconditions }) => {
      await auroraPlusPreconditions.loginToAuroraPlus()
    },
  )

  const tokenWithBalance: string = "AURORA"
  const destinationToken: string = "BRRR"
  const amount: number = 0.1

  test.describe("Test multiple tokens transfers", () => {
    test(`Confirm that user can swap ${amount} from ${tokenWithBalance} to ${destinationToken}`, async ({
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
      await swapPage.selectDestinationSupportedToken(destinationToken)
      await swapPage.enterSwapFromAmount(0.1)
      await swapPage.clickReviewSwapButton()
      await swapPage.confirmThatReviewYourSwapModalVisible()
      await swapPage.clickApproveSwapButton()
      await metamask.confirmTransaction()
      test.fail() // REMOVE when JSON-RPC issue will be resolved
      await swapPage.waitForActionToComplete()
      await swapPage.confirmTransactionData(
        tokenWithBalance,
        destinationToken,
        amount,
      )
      await swapPage.clickApproveSwapButton()
      await metamask.confirmTransaction()
      await swapPage.waitForActionToComplete()
      await swapPage.selectTokenWithBalance(tokenWithBalance)
      const amountAfter = await swapPage.getAvailableToTradeBalance()
      swapPage.confirmTransactionWasCorrect(
        tokenWithBalance,
        amountBefore,
        amountAfter,
        amount,
      )
    })
  })
})

import { MetaMask } from "@synthetixio/synpress/playwright"
import {
  TRISOLARIS_TAG,
  TRISOLARIS_TAG_SWAPPING,
} from "../../helpers/constants/tags"
// import trisolarisSetup from "../../wallet-setup/trisolaris.setup"
import { test } from "../fixtures/trisolaris"
import { TRISOLARIS_PAGE } from "../../helpers/constants/pages"
import { HomePage } from "../pages/home.page"
import { SwapPage } from "../pages/swap.page"
import trisolarisSetup from "../../wallet-setup/trisolaris.setup"

test.use(TRISOLARIS_PAGE)

test.beforeEach(
  "Login to Trisolaris wallet with MetaMask",
  async ({ trisolarisPreconditions, page }) => {
    await trisolarisPreconditions.loginToTrisolaris()
    await page.waitForTimeout(2_000)
    await page.reload()
  },
)
test.describe(
  "Trisolars Wallet: Home Page - Swapping",
  { tag: [TRISOLARIS_TAG, TRISOLARIS_TAG_SWAPPING] },
  () => {
    test("Confirm that user cannot swap more than the balance contains", async ({
      page,
    }) => {
      const transferAmount = 9999
      const homePage = new HomePage(page)
      const swapPage = new SwapPage(page)
      await homePage.confirmHomePageLoaded()
      await homePage.navigateToSwapPage()
      await swapPage.selectTokenToSwapTo("AAVE")
      await swapPage.enterSwapFromAmount(transferAmount)
      await swapPage.confirmInsufficientLiquidity()
    })

    test(`Confirm that user can swap some tokens from AURORA, to TRI for 0.01`, async ({
      page,
      context,
      extensionId,
    }) => {
      const homePage = new HomePage(page)
      const swapPage = new SwapPage(page)
      const metamask = new MetaMask(
        context,
        page,
        trisolarisSetup.walletPassword,
        extensionId,
      )

      const transferAmount = 0.01
      await homePage.confirmHomePageLoaded()
      await homePage.navigateToSwapPage()
      await swapPage.selectTokenToSwapFrom("AURORA", true)
      await swapPage.selectTokenToSwapTo("TRI", true)
      await page.waitForTimeout(2000)
      await swapPage.enterSwapFromAmount(transferAmount)
      const balanceBefore = await swapPage.getFromTokenBalance()
      // check if we have enough balance for swapping with gas fee
      test.skip(
        !(await swapPage.isAvailableToSwap()),
        `Insufficient funds for sending with included gas fee, balance: ${balanceBefore}, transfer: ${transferAmount}`,
      )

      await swapPage.clickSwapButton()
      await swapPage.confirmSwapping()
      await metamask.confirmTransaction()

      const isNotificationVisible =
        await swapPage.isSuccessNotificationVisible()

      if (!isNotificationVisible) {
        await swapPage.confirmSwapping()
        await metamask.confirmTransaction()
      }

      await swapPage.closeSuccessNotificationDialog()
      const balanceAfter = await homePage.getFromTokenBalance()
      swapPage.confirmTransactionWasCorrect(
        balanceBefore,
        balanceAfter,
        transferAmount,
      )
    })
  },
)

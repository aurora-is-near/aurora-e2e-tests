import { MetaMask } from "@synthetixio/synpress/playwright"
import {
  TRISOLARIS_TAG,
  TRISOLARIS_TAG_SWAPPING,
} from "../../helpers/constants/tags"
import { test } from "../fixtures/trisolaris"
import { TRISOLARIS_PAGE } from "../../helpers/constants/pages"
import { HomePage } from "../pages/home.page"
import { SwapPage } from "../pages/swap.page"
import trisolarisSetup from "../../wallet-setup/aurora-plus.setup"

test.use(TRISOLARIS_PAGE)

test.beforeEach(
  "Login to Trisolaris wallet with MetaMask",
  async ({ trisolarisPreconditions, page }) => {
    await trisolarisPreconditions.loginToTrisolaris()
    await trisolarisPreconditions.confirmAccountLoggedIn()
    await page.waitForTimeout(2_000)
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

    const tokensFromTo = [
      { tokenFrom: "AURORA", tokenTo: "BRRR", swapAmount: 0.000001 },
      { tokenFrom: "AURORA", tokenTo: "USDC.e", swapAmount: 0.01 },
      { tokenFrom: "AURORA", tokenTo: "ETH", swapAmount: 0.00000001 },
      { tokenFrom: "BRRR", tokenTo: "AURORA", swapAmount: 0.000001 },
      { tokenFrom: "ETH", tokenTo: "AURORA", swapAmount: 0.00000001 },
      { tokenFrom: "USDC.e", tokenTo: "AURORA", swapAmount: 0.000001 },
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
        const swapPage = new SwapPage(page)
        const metamask = new MetaMask(
          context,
          page,
          trisolarisSetup.walletPassword,
          extensionId,
        )

        await homePage.confirmHomePageLoaded()
        await homePage.navigateToSwapPage()

        if (tokenFrom !== "ETH") {
          await swapPage.selectTokenToSwapFrom(tokenFrom, true)
        }

        await swapPage.selectTokenToSwapTo(tokenTo, true)
        await page.waitForTimeout(2000)
        await swapPage.enterSwapFromAmount(swapAmount)
        await swapPage.waitForBalanceToLoad()
        const balanceBefore = await swapPage.getFromTokenBalance()
        // check if we have enough balance for swapping with gas fee
        test.skip(
          await swapPage.isNotAvailableToSwap(),
          `Insufficient funds for sending with included gas fee, balance: ${balanceBefore}, transfer: ${swapAmount}`,
        )
        // check if the price impact isn't too high
        test.skip(
          await swapPage.isPriceImpactTooHigh(),
          `Price impact too high for the combination ${tokenFrom} <-> ${tokenTo}`,
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
          swapAmount,
        )
      })
    }
  },
)

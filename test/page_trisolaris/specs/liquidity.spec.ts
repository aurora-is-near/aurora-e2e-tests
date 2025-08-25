import { MetaMask } from "@synthetixio/synpress/playwright"
import {
  TRISOLARIS_TAG,
  TRISOLARIS_TAG_LIQUIDITY,
} from "../../helpers/constants/tags"
import { test } from "../fixtures/trisolaris"
import { TRISOLARIS_PAGE } from "../../helpers/constants/pages"
import { HomePage } from "../pages/home.page"
import { PoolPage } from "../pages/pool.page"
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
  "Trisolars Wallet: Liquidity Page - Add liquidity/remove liquidity",
  { tag: [TRISOLARIS_TAG, TRISOLARIS_TAG_LIQUIDITY] },
  () => {
    // USDC.e - ETH
    test(`Confirm that user can add liquidity`, async ({
      page,
      context,
      extensionId,
    }) => {
      const swapAmount = 0.001
      const homePage = new HomePage(page)
      const poolPage = new PoolPage(page)
      const metamask = new MetaMask(
        context,
        page,
        trisolarisSetup.walletPassword,
        extensionId,
      )

      await homePage.confirmHomePageLoaded()
      await homePage.navigateToPoolPage()
      await poolPage.confirmPoolPageLoaded()

      await poolPage.clickAddLiquidity()
      await poolPage.selectTokenToPoolFrom("USDC.e", true)
      await poolPage.selectTokenToPoolTo("AURORA", true)
      await page.waitForTimeout(2000)
      await poolPage.enterPoolFromAmount(swapAmount)
      await page.pause()

      test.skip(
        await poolPage.isNotAvailableToPool("USDC.e"),
        `Insufficient funds for adding liquidity, transfer amount: ${swapAmount}`,
      )
      await poolPage.clickSupply()
      await poolPage.confirmSupply()
      await metamask.confirmTransaction()
      await poolPage.closeSuccessNotificationDialog()
    })
    // test - create a pair
    test(`Confirm that user can create a liquidity pair`, async ({
      page,
      context,
      extensionId,
    }) => {
      const swapAmount = 0.001
      const homePage = new HomePage(page)
      const poolPage = new PoolPage(page)
      const metamask = new MetaMask(
        context,
        page,
        trisolarisSetup.walletPassword,
        extensionId,
      )

      await homePage.confirmHomePageLoaded()
      await homePage.navigateToPoolPage()
      await poolPage.confirmPoolPageLoaded()

      await poolPage.clickCreatePair()
      await poolPage.selectTokenToPoolFrom("USDC.e", true)
      await poolPage.selectTokenToPoolTo("AURORA", true)
      await page.waitForTimeout(2000)
      await poolPage.enterPoolFromAmount(swapAmount)

      // get amount as end result - for later confirmation that tx is done
      const convertedAmount = await poolPage.getConvertedAmount()

      test.skip(
        await poolPage.isNotAvailableToPool("USDC.e"),
        `Insufficient funds for adding liquidity, transfer amount: ${swapAmount}`,
      )
      await poolPage.clickSupply()
      await poolPage.confirmSupply()
      await metamask.confirmTransaction()
      await poolPage.closeSuccessNotificationDialog()

      await homePage.navigateToPoolPage()
      await poolPage.confirmPoolPageLoaded()
      await poolPage.confirmTransactionIsDone(
        "USDC.e",
        "AURORA",
        swapAmount,
        convertedAmount,
      )
      // FIXME find solution for this below
      //   await poolPage.assertLiquidityPairCount(1)
    })

    // TODO - remove a pair
  },
)

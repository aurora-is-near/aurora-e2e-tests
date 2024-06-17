import { AURORA_PLUS_TAG } from "../../lib/constants/tags"
import { test } from "../../lib/fixtures"
import { MetamaskActions } from "../helpers/metamask.actions"
import { SwapPage } from "../pages/swap.page"

test.describe.configure({ mode: "serial" })

test.describe("Aurora Plus: Swapping", { tag: AURORA_PLUS_TAG }, () => {
  test.beforeEach(
    "Setup Metamask extension:",
    async ({ metamask, auroraPlus }) => {
      await metamask.setup()
      await auroraPlus.goto("/swap")
      await auroraPlus.connectToMetaMask()
    },
  )

  const tokenWithBalance = "Aurora"
  const destinationToken = "BRRR"

  test(`Confirm that user can swap tokens from ${tokenWithBalance} to ${destinationToken}`, async ({
    context,
    page,
  }) => {
    const swapPage = new SwapPage(page)
    const metamaskActions = new MetamaskActions()

    await swapPage.confirmSwapPageLoaded("/swap")
    await swapPage.selectTokenWithBalance(tokenWithBalance)
    await swapPage.selectDestinationSupportedToken(destinationToken)
    await swapPage.enterSwapFromAmount(0.1)
    await swapPage.clickReviewSwapButton()
    await swapPage.confirmThatReviewYourSwapModalVisible()
    await swapPage.clickApproveSwapButton()

    const metamaskContext =
      await metamaskActions.switchContextToExtension(context)

    await page.pause()

    if (await metamaskActions.isButtonVisible(metamaskContext, "Confirm")) {
      await metamaskActions.clickConfirm(metamaskContext)
    } else {
      await metamaskActions.clickNext(metamaskContext)
    }

    await metamaskActions.clickApprove(metamaskContext)
    await metamaskActions.switchContextToPage(page)
  })
})

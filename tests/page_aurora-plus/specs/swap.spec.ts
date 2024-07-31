import { MetaMask } from "@synthetixio/synpress"
import auroraSetup from "../../../test/wallet-setup/aurora-plus.setup"
import { AURORA_PLUS_TAG } from "../../helpers/constants/tags"
import { test } from "../fixtures/aurora-plus"
import { SwapPage } from "../pages/swap.page"
import { DashboardPage } from "../pages/dashboard.page"
import { AURORA_PLUS_PAGE } from "../../helpers/constants/pages"

test.use(AURORA_PLUS_PAGE)

test.describe("Aurora Plus: Swapping", { tag: AURORA_PLUS_TAG }, () => {
    test.beforeEach('Login to Aurora Plus with MetaMask', async ({ auroraPlusPreconditions }) => {
        await auroraPlusPreconditions.loginToAuroraPlus()
    })

    const tokenWithBalance = "AURORA"
    const destinationToken = "BRRR"
    const amount = 0.1

    // Done
    test(`Confirm that user can swap ${amount} from ${tokenWithBalance} to ${destinationToken}`, async ({ context, page, extensionId }) => {
        const dashboardPage = new DashboardPage(page)
        const swapPage = new SwapPage(page)
        const metamask = new MetaMask(context, page, auroraSetup.walletPassword, extensionId)

        await dashboardPage.navigateToSwapPage()
        await swapPage.selectTokenWithBalance(tokenWithBalance)
        await swapPage.selectDestinationSupportedToken(destinationToken)
        await swapPage.enterSwapFromAmount(0.1)
        await swapPage.clickReviewSwapButton()
        await swapPage.confirmThatReviewYourSwapModalVisible()
        await swapPage.clickApproveSwapButton()

        await metamask.confirmTransaction()
    })
})

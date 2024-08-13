import { setTimeout } from "node:timers/promises"
import { EarnPage } from "../pages/earn.page"
import { AURORA_PLUS_TAG } from "../../helpers/constants/tags"
import { test } from "../fixtures/aurora-plus"
import { MetaMask } from "@synthetixio/synpress"
import auroraSetup from "../../../test/wallet-setup/aurora-plus.setup"
import { DashboardPage } from "../pages/dashboard.page"
import { AURORA_PLUS_PAGE } from "../../helpers/constants/pages"

const { expect } = test;

test.use(AURORA_PLUS_PAGE)

test.describe("Aurora Plus: Earning", { tag: AURORA_PLUS_TAG }, () => {
    test.beforeEach('Login to Aurora Plus with MetaMask', async ({ auroraPlusPreconditions }) => {
        await auroraPlusPreconditions.loginToAuroraPlus()
    })

    const amount = 0.2

    test.skip(`Confirm that user can deposit ${amount} tokens`, async ({ context, page, extensionId }) => {
        const dashboardPage = new DashboardPage(page)
        const earnPage = new EarnPage(page)
        const metamask = new MetaMask(context, page, auroraSetup.walletPassword, extensionId)

        await dashboardPage.navigateToEarnPage()

        if (await earnPage.isOnboardingVisible()) {
            await earnPage.skipOnboarding()
        }

        const depositAlradyExists = await earnPage.isAnyDepositsExist()

        const depositBeforeTransaction = depositAlradyExists ? await earnPage.getDepositedTokenBalance() : 0
        console.log('Depositas', depositBeforeTransaction);

        await setTimeout(5000)

        if (depositAlradyExists) {
            await earnPage.clickDepositMoreButton()
        } else {
            await earnPage.selectAuroraToDeposit()
        }

        await earnPage.enterAmountToDeposit(amount)
        await earnPage.confirmDeposit()

        await metamask.approveTokenPermission()

        await setTimeout(15000)
        await page.reload()
        const depositAfterTransaction = await earnPage.getDepositedTokenBalance()

        expect(depositBeforeTransaction).toBeLessThan(depositAfterTransaction)
    })
})

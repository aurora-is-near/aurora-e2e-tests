
import { MetaMask } from "@synthetixio/synpress";
import { test } from "../fixtures/aurora-plus";
import { DashboardPage } from '../pages/dashboard.page';
import auroraSetup from "../../../test/wallet-setup/aurora-plus.setup";
import { AURORA_PLUS_TAG } from "../../helpers/constants/tags";
import { AURORA_PLUS_PAGE } from "../../helpers/constants/pages";

const { expect } = test;

test.use(AURORA_PLUS_PAGE)

test.describe("Dashboard page tests", { tag: AURORA_PLUS_TAG }, async () => {
  test.beforeEach('Login to Aurora Plus with MetaMask', async ({ auroraPlusPreconditions }) => {
    await auroraPlusPreconditions.loginToAuroraPlus()
  })

  // Done
  test('Confirm user can stake some tokens', async ({ context, page, extensionId }) => {
    const dashboardPage = new DashboardPage(page)
    const metamask = new MetaMask(context, page, auroraSetup.walletPassword, extensionId)

    const transferAmount = 0.1

    if (await dashboardPage.isOnboardingVisible()) {
      await dashboardPage.skipOnboarding()
    }

    const initialAuroraBalance = await dashboardPage.getAuroraBalance()

    await dashboardPage.clickStakeButton()
    await dashboardPage.stakeModal_enterAmount(transferAmount)
    await dashboardPage.stakeModal_confirmStake()
    await metamask.confirmTransaction()
    await dashboardPage.confirmStakeModalGone()
    await dashboardPage.waitForAuroraBalanceUpdate(initialAuroraBalance)
    const updatedAuroraBalance = await dashboardPage.getAuroraBalance()
    await dashboardPage.confirmValuesIsCorrectAfterTransfer(initialAuroraBalance, updatedAuroraBalance, transferAmount)
  })

  // Done
  test("Confirm that user can't stake more than balance allows", async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page)
    await dashboardPage.confirmDashboardPageLoaded(page)

    if (await dashboardPage.isOnboardingVisible()) {
      await dashboardPage.skipOnboarding()
    }

    const auroraBalance = await dashboardPage.getAuroraBalance()

    await dashboardPage.clickStakeButton()
    await dashboardPage.stakeModal_enterAmount(auroraBalance + 100)
    await dashboardPage.confirmThatConfirmButtonDisabled()
  })
})

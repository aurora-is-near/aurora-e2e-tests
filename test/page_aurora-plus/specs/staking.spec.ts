import { MetaMask } from "@synthetixio/synpress/playwright"
import { test } from "../fixtures/aurora-plus"
import { DashboardPage } from "../pages/dashboard.page"
import { AURORA_PLUS_TAG } from "../../helpers/constants/tags"
import { AURORA_PLUS_PAGE } from "../../helpers/constants/pages"
import auroraSetup from "../../wallet-setup/aurora-plus.setup"

test.use(AURORA_PLUS_PAGE)

test.describe("Aurora Plus: Staking", { tag: AURORA_PLUS_TAG }, () => {
  test.beforeEach(
    "Login to Aurora Plus with MetaMask",
    async ({ auroraPlusPreconditions }) => {
      await auroraPlusPreconditions.loginToAuroraPlus()
    },
  )

  test("Confirm that user can't stake more than balance allows", async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page)
    await dashboardPage.confirmDashboardPageLoaded()
    await dashboardPage.skipOnboardingIfVisible()

    const auroraBalance = await dashboardPage.getAuroraBalance()

    await dashboardPage.clickStakeButton()
    await dashboardPage.enterStakeAmount(auroraBalance + 100)
    await dashboardPage.confirmThatConfirmButtonDisabled()
  })

  test("Confirm that user can't unstake more than staked amount", async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page)
    await dashboardPage.confirmDashboardPageLoaded()
    await dashboardPage.skipOnboardingIfVisible()

    const auroraStakedBalance: number = await dashboardPage.getStakedBalance()

    await dashboardPage.clickUnstakeButton()
    await dashboardPage.enterUnstakeAmount(auroraStakedBalance + 100)
    await dashboardPage.confirmThatUnstakeButtonDisabled()
  })

  const stakeAmount: number = 0.1
  test(`Confirm that user can stake ${stakeAmount} tokens`, async ({
    context,
    page,
    extensionId,
  }) => {
    const dashboardPage = new DashboardPage(page)
    const metamask = new MetaMask(
      context,
      page,
      auroraSetup.walletPassword,
      extensionId,
    )

    await dashboardPage.skipOnboardingIfVisible()

    const balanceBefore: number = await dashboardPage.getAuroraBalance()
    await dashboardPage.clickStakeButton()
    await dashboardPage.enterStakeAmount(stakeAmount)
    await dashboardPage.clickConfirmStakeButton()
    await metamask.confirmTransaction()
    await page.waitForTimeout(20000)
    const balanceAfter: number = await dashboardPage.getAuroraBalance()

    dashboardPage.confirmValuesIsCorrectAfterTransfer(
      balanceBefore,
      balanceAfter,
      stakeAmount,
    )
    // await page.pause()
  })

  const unstakeAmount = 0.1
  test(`Confirm that user can unstake ${unstakeAmount} tokens`, async ({
    context,
    page,
    extensionId,
  }) => {
    const dashboardPage = new DashboardPage(page)
    const metamask = new MetaMask(
      context,
      page,
      auroraSetup.walletPassword,
      extensionId,
    )

    await dashboardPage.skipOnboardingIfVisible()

    const stakedBalanceBefore: number = await dashboardPage.getStakedBalance()
    await dashboardPage.clickUnstakeButton()
    await dashboardPage.enterUnstakeAmount(unstakeAmount)
    await dashboardPage.clickUnstakeConfirmButton()
    await metamask.confirmTransaction()
    await page.waitForTimeout(20000)
    const stakedBalanceAfter: number = await dashboardPage.getStakedBalance()

    dashboardPage.confirmValuesIsCorrectAfterTransfer(
      stakedBalanceBefore,
      stakedBalanceAfter,
      stakeAmount,
    )
  })
})

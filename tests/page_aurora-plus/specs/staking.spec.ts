import { expect } from "playwright/test"
import { AURORA_PLUS_TAG } from "../../../lib/constants/tags"
import { test } from "../../../lib/fixtures"
import { DashboardPage } from "../pages/dashboard.page"
import { MetamaskActions } from "../../helpers/metamask.actions"

test.describe.configure({ mode: "serial" })

test.describe("Aurora Plus: Staking", { tag: AURORA_PLUS_TAG }, () => {
  test.beforeEach(
    "Setup Metamask extension:",
    async ({ metamask, auroraPlus }) => {
      await metamask.setup()
      await auroraPlus.goto("/dashboard")
      await auroraPlus.connectToMetaMask()
    },
  )

  test("Confirm that user can stake some tokens", async ({ context, page }) => {
    // Prerequisites
    const dashboardPage = new DashboardPage(page)
    const metamaskActions = new MetamaskActions()
    await dashboardPage.confirmDashboardPageLoaded("/dashboard")

    if (await dashboardPage.isOnboardingVisible()) {
      await dashboardPage.skipOnboarding()
    }

    // Test
    const initialAuroraBalance = await dashboardPage.getAuroraBalance()
    const initialStakedBalance = await dashboardPage.getStakedBalance()

    await dashboardPage.clickStakeButton()
    await dashboardPage.stakeModal_enterAmount(0.1)
    await dashboardPage.stakeModal_confirmStake()

    const metamaskContext =
      await metamaskActions.switchContextToExtension(context)
    await metamaskActions.clickConfirm(metamaskContext)
    await metamaskActions.switchContextToPage(page)

    await dashboardPage.confirmStakeModalGone()

    const updatedAuroraBalance = await dashboardPage.getAuroraBalance()
    const updatedStakedBalance = await dashboardPage.getStakedBalance()

    expect(initialAuroraBalance).toBeGreaterThan(updatedAuroraBalance)
    expect(initialStakedBalance).toBeLessThan(updatedStakedBalance)
  })

  test("Confirm that user can't stake more than balance allows", async ({
    page,
  }) => {
    // Prerequisites
    const dashboardPage = new DashboardPage(page)
    await dashboardPage.confirmDashboardPageLoaded("/dashboard")

    if (await dashboardPage.isOnboardingVisible()) {
      await dashboardPage.skipOnboarding()
    }

    // Test
    const auroraBalance = await dashboardPage.getAuroraBalance()

    await dashboardPage.clickStakeButton()
    await dashboardPage.stakeModal_enterAmount(auroraBalance + 100)

    await dashboardPage.confirmThatConfirmButtonDisabled()
  })

  const amount = 0.1

  // for await (const amount of unstakeAmount) {
  test(`Confirm that user can unstake ${amount} tokens`, async ({
    context,
    page,
  }) => {
    // Prerequisites
    const dashboardPage = new DashboardPage(page)
    const metamaskActions = new MetamaskActions()
    await dashboardPage.confirmDashboardPageLoaded("/dashboard")

    if (await dashboardPage.isOnboardingVisible()) {
      await dashboardPage.skipOnboarding()
    }

    // Test
    const initialPendingWithdrawalAmount =
      (await dashboardPage.isAnyPendingWithdrawals())
        ? await dashboardPage.getPendingWithdrawalAmount()
        : 0

    await dashboardPage.clickUnstakeButton()

    await dashboardPage.enterUnstakeAmount(amount)
    await dashboardPage.clickUnstakeModalConfirmButton()

    const metamaskContext = metamaskActions.switchContextToExtension(context)
    await metamaskActions.clickConfirm(metamaskContext)
    await metamaskActions.switchContextToPage(page)

    await dashboardPage.confirmLoadingSpinnedDisappear()

    const newPendingWithdrawalAmount =
      await dashboardPage.getPendingWithdrawalAmount()

    const messageOnFail = `Initial amount: ${initialPendingWithdrawalAmount} expected to be lower than updated: ${newPendingWithdrawalAmount + amount}`

    expect((newPendingWithdrawalAmount + amount).toFixed(), messageOnFail).toBe(
      initialPendingWithdrawalAmount.toFixed(),
    )
  })
  // }
})

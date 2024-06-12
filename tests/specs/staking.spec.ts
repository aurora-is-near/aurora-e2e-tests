import { expect } from "playwright/test"
import { AURORA_PLUS_TAG } from "../../lib/constants/tags"
import { test } from "../../lib/fixtures"
import { DashboardPage } from "../pages/dashboard.page"
import { MetamaskActions } from "../helpers/metamask.actions"

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
    const dashboardPage = new DashboardPage(page)
    const metamaskActions = new MetamaskActions()
    dashboardPage.confirmDashboardPageLoaded()

    if (await dashboardPage.isOnboardingVisible()) {
      await dashboardPage.skipOnboarding()
    }

    const initialAuroraBalance = await dashboardPage.getAuroraBalance()
    const initialStakedValue = await dashboardPage.getStakedBalance()

    await dashboardPage.clickStakeButton()
    await dashboardPage.stakeModal_enterAmount(0.1)
    await dashboardPage.stakeModal_confirmStake()

    const metamaskContext =
      await metamaskActions.switchContextToExtension(context)
    await metamaskActions.clickConfirm(metamaskContext)
    await metamaskActions.switchContextToPage(page)

    await dashboardPage.confirmStakeModalGone()

    const updatedAuroraValue = await dashboardPage.getAuroraBalance()
    const updatedStakedValue = await dashboardPage.getStakedBalance()

    expect(initialAuroraBalance).toBeGreaterThan(updatedAuroraValue)
    expect(initialStakedValue).toBeLessThan(updatedStakedValue)
  })

  test.only("Confirm that user can unstake some tokens", async ({
    context,
    page,
  }) => {
    const dashboardPage = new DashboardPage(page)
    const metamaskActions = new MetamaskActions()

    const initialPendingWithdrawalAmount =
      await dashboardPage.getPendingWithdrawalAmount()
    await dashboardPage.clickUnstakeButton()

    await dashboardPage.enterUnstakeValue(0.1)
    await dashboardPage.clickUnstakeModalConfirmButton()
    await page.pause()

    const metamaskContext = metamaskActions.switchContextToExtension(context)
    await metamaskActions.clickConfirm(metamaskContext)
    await metamaskActions.switchContextToPage(page)

    await dashboardPage.confirmLoadingSpinnedDisappear()

    const newPendingWithdrawalAmount =
      await dashboardPage.getPendingWithdrawalAmount()
    console.log()
    console.log(initialPendingWithdrawalAmount)
    console.log(newPendingWithdrawalAmount)

    // expect(newPendingWithdrawalAmount.toFixed(1)).toBeLessThan(
    //   initialPendingWithdrawalAmount.toFixed(1),
    // )
  })

  // test.only("stakes some tokens", async ({ context, page }) => {
  //   const dashboardPage = new DashboardPage(page)
  //   // Wait for the numbers animation to finish
  //   await page.waitForTimeout(1000)
  //   const originalWalletValues = await dashboardPage.getWalletValues()
  //   await dashboardPage.stakeButton.click()

  //   const skipOnboarding = await dashboardPage.onboardingModal.isVisible({
  //     timeout: 10000,
  //   })

  //   if (skipOnboarding) {
  //     await dashboardPage.gotItContinueButton.click()
  //     await dashboardPage.allClearNextButton.click()
  //     await dashboardPage.okLetsStakeButton.click()
  //   }

  //   const confirmPopupPromise = context.waitForEvent("page")

  //   await dashboardPage.stakeConfirmModalAmountInput.fill("0.1")
  //   await dashboardPage.stakeConfirmModalButton.click()
  // const skipRewards = await dashboardPage.stakeRewardsModal.isVisible({
  //     timeout: 10000,
  //   })

  //   // try {
  //   //   await dashboardPage.stakeRewardsModal.waitFor({ timeout: 2000 })
  //   // } catch {
  //   //   skipRewards = true
  //   // }

  //   if (!skipRewards) {
  //     page.on("dialog", (dialog) => dialog.accept())
  //     await dashboardPage.stakeRewardsModal
  //       .getByRole("button", { name: "Discard rewards" })
  //       .click()
  //   }

  //   const confirmPopup = await confirmPopupPromise
  //   await confirmPopup.getByRole("button", { name: "Confirm" }).click()
  //   await page.bringToFront()
  //   await expect(dashboardPage.loadingModalSpinner).not.toBeVisible({
  //     timeout: 30000,
  //   })
  //   // Wait for the numbers animation to finish
  //   await page.waitForTimeout(1000)
  //   const newWalletValues = await dashboardPage.getWalletValues()
  //   expect(newWalletValues.stakedAmount.toFixed(1)).toBe(
  //     (originalWalletValues.stakedAmount + 0.1).toFixed(1),
  //   )
  //   expect(newWalletValues.balance.toFixed(1)).toBe(
  //     (originalWalletValues.balance - 0.1).toFixed(1),
  //   )
  // })

  //
})

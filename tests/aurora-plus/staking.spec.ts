import { expect, type Page } from "playwright/test"
import { AURORA_PLUS_TAG } from "../../lib/constants/tags"
import { test } from "../../lib/fixtures"

test.describe.configure({ mode: "serial" })

const getWalletValues = async (page: Page) => {
  // Wait for the numbers animation to finish
  await page.waitForTimeout(1000)

  const balance = Number(
    await page.getByTestId("aurora-balance-value").textContent(),
  )

  const stakedAmount = Number(
    await page.getByTestId("aurora-staked-value").textContent(),
  )

  return { balance, stakedAmount }
}

test.describe("Aurora Plus: Staking", { tag: AURORA_PLUS_TAG }, () => {
  test("stakes some tokens", async ({
    metamask,
    auroraPlus,
    context,
    page,
  }) => {
    await metamask.setup()

    await auroraPlus.goto("/dashboard")
    await auroraPlus.connectToMetaMask()

    // Wait for the numbers animation to finish
    await page.waitForTimeout(1000)

    const originalWalletValues = await getWalletValues(page)

    await page.getByRole("button", { name: "Stake", exact: true }).click()

    const onboardingModal = page.getByTestId("stake-onboarding-modal")
    let skipOnboarding = false

    try {
      await onboardingModal.waitFor({ timeout: 2000 })
    } catch {
      skipOnboarding = true
    }

    if (!skipOnboarding) {
      await onboardingModal
        .getByRole("button", { name: "Got it, continue" })
        .click()

      await onboardingModal
        .getByRole("button", { name: "All clear, next" })
        .click()

      await onboardingModal
        .getByRole("button", { name: "OK, let's stake" })
        .click()
    }

    const confirmModal = page.getByTestId("stake-confirm-modal")
    const confirmPopupPromise = context.waitForEvent("page")
    const confirmModalButton = confirmModal.getByRole("button", {
      name: "Confirm",
    })

    await confirmModal.getByLabel("Amount").fill("0.1")
    await confirmModalButton.click()

    const rewardsModal = page.getByTestId("stake-rewards-modal")
    let skipRewards = false

    try {
      await rewardsModal.waitFor({ timeout: 2000 })
    } catch {
      skipRewards = true
    }

    if (!skipRewards) {
      page.on("dialog", (dialog) => dialog.accept())

      await rewardsModal
        .getByRole("button", { name: "Discard rewards" })
        .click()
    }

    const confirmPopup = await confirmPopupPromise

    await confirmPopup.getByRole("button", { name: "Confirm" }).click()

    await page.bringToFront()

    await expect(
      confirmModalButton.getByTestId("loading-spinner"),
    ).not.toBeVisible({ timeout: 60000 })

    // Wait for the numbers animation to finish
    await page.waitForTimeout(1000)

    const newWalletValues = await getWalletValues(page)

    expect(newWalletValues.stakedAmount.toFixed(1)).toBe(
      (originalWalletValues.stakedAmount + 0.1).toFixed(1),
    )

    expect(newWalletValues.balance.toFixed(1)).toBe(
      (originalWalletValues.balance - 0.1).toFixed(1),
    )
  })

  test("unstakes some tokens", async ({
    metamask,
    auroraPlus,
    context,
    page,
  }) => {
    await metamask.setup()

    await auroraPlus.goto("/dashboard")
    await auroraPlus.connectToMetaMask()

    await page.getByTestId("withdrawal-cooldown-button").click()

    const originalPendingWithdrawalAmount = Number(
      await page.getByTestId("aurora-pending-withdrawal-amount").textContent(),
    )

    await page.getByTestId("withdrawal-cooldown-button").click()

    await page.getByRole("button", { name: "Unstake", exact: true }).click()

    const confirmModal = page.getByTestId("unstake-confirm-modal")
    const confirmPopupPromise = context.waitForEvent("page")
    const confirmModalButton = confirmModal.getByRole("button", {
      name: "Unstake now",
    })

    await confirmModal.getByLabel("Amount").fill("0.1")
    await confirmModalButton.click()

    const confirmPopup = await confirmPopupPromise

    await confirmPopup.getByRole("button", { name: "Confirm" }).click()

    await page.bringToFront()

    await expect(
      confirmModalButton.getByTestId("loading-spinner"),
    ).not.toBeVisible({ timeout: 60000 })

    await page.getByTestId("withdrawal-cooldown-button").click()

    const newPendingWithdrawalAmount = Number(
      await page.getByTestId("aurora-pending-withdrawal-amount").textContent(),
    )

    await page.getByTestId("withdrawal-cooldown-button").click()

    expect(newPendingWithdrawalAmount.toFixed(1)).toBe(
      (originalPendingWithdrawalAmount + 0.1).toFixed(1),
    )
  })
})

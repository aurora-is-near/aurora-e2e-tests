import { type BrowserContext, expect, type Page } from "playwright/test"
import { AURORA_PLUS_TAG } from "../../lib/constants/tags"
import { test } from "../../lib/fixtures"

const connectWallet = async (page: Page, context: BrowserContext) => {
  await page.evaluate(() => {
    localStorage.setItem("ap-promo-hidden", "1")
  })

  await page.getByRole("button", { name: "Connect wallet" }).click()
  await page
    .getByTestId("connect-modal")
    .getByRole("button", { name: "Connect wallet" })
    .click()

  const connectPopupPromise = context.waitForEvent("page")

  await page.getByRole("button", { name: "MetaMask" }).click()
  await page.waitForSelector("w3m-connecting-external-view")

  const connectPage = await connectPopupPromise

  await connectPage.waitForLoadState("domcontentloaded")

  await connectPage.getByRole("button", { name: "Next" }).click()
  await connectPage.getByRole("button", { name: "Connect" }).click()
  await connectPage.getByRole("button", { name: "Approve" }).click()
  await connectPage.getByRole("button", { name: "Switch network" }).click()

  await page.bringToFront()

  const signPopupPromise = context.waitForEvent("page")

  await page
    .getByTestId("connect-modal")
    .getByRole("button", { name: "Accept and sign" })
    .click()

  const signPage = await signPopupPromise

  await signPage.getByTestId("popover-close").click()
  await signPage.getByRole("button", { name: "Sign" }).click()

  await page.bringToFront()
}

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
  test("connects a wallet", async ({ getApp, page, metamask, context }) => {
    await metamask.setup()

    const app = getApp("aurora-plus")

    await app.goto("/dashboard")

    await connectWallet(page, context)

    await expect(page.getByTestId("connected-indicator")).toBeVisible()
  })

  test("stakes some tokens", async ({ getApp, metamask, page, context }) => {
    await metamask.setup()

    const app = getApp("aurora-plus")

    await app.goto("/dashboard")

    await connectWallet(page, context)

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
})

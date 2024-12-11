import { MetaMask } from "@synthetixio/synpress/playwright"
import {
  AURORA_PLUS_TAG,
  AURORA_PLUS_TAG_BORROWING,
  AURORA_PLUS_TAG_DEPOSITING,
} from "../../helpers/constants/tags"
import { test } from "../fixtures/aurora-plus"
import auroraSetup from "../../wallet-setup/aurora-plus.setup"
import { DashboardPage } from "../pages/dashboard.page"
import { AURORA_PLUS_PAGE } from "../../helpers/constants/pages"
import { EarnPage } from "../pages/earn.page"

const { expect } = test

test.use(AURORA_PLUS_PAGE)

test.describe(
  "Aurora Plus: Earning Page - Depositing",
  { tag: [AURORA_PLUS_TAG, AURORA_PLUS_TAG_DEPOSITING] },
  () => {
    test.beforeEach(
      "Login to Aurora Plus with MetaMask",
      async ({ auroraPlusPreconditions }) => {
        await auroraPlusPreconditions.loginToAuroraPlus()
      },
    )
    test(`Confirm that user can not deposit more tokens than balance contains`, async ({
      page,
    }) => {
      const dashboardPage = new DashboardPage(page)
      const earnPage = new EarnPage(page)

      await dashboardPage.navigateToEarnPage()
      await earnPage.skipOnboardingIfVisible()

      const depositAlradyExists = await earnPage.isAnyDepositsExist()

      await page.waitForTimeout(2000)

      if (depositAlradyExists) {
        await earnPage.clickDepositMoreButton()
      } else {
        await earnPage.selectAuroraToDeposit()
      }

      const amount = (await earnPage.getAmountOfAvailableBalance()) * 10
      await earnPage.enterAmountToDeposit(amount)

      await expect(earnPage.insufficientFundsNotification).toBeVisible()
      await expect(earnPage.approveButton).toBeDisabled()
    })

    // CHECK
    const amount: number = 0.2
    test(`Confirm that user can deposit ${amount} tokens`, async ({
      context,
      page,
      extensionId,
    }) => {
      const dashboardPage = new DashboardPage(page)
      const earnPage = new EarnPage(page)
      const metamask = new MetaMask(
        context,
        page,
        auroraSetup.walletPassword,
        extensionId,
      )

      await dashboardPage.navigateToEarnPage()
      await earnPage.skipOnboardingIfVisible()

      await page.waitForTimeout(2000)
      test.skip(await earnPage.isAnyDepositsExist())

      await page.waitForTimeout(5000)

      const depositBeforeTransaction = 0
      const depositValueBeforeTransaction = 0
      await earnPage.selectAuroraToDeposit()
      await earnPage.enterAmountToDeposit(amount)
      await earnPage.confirmDeposit()
      await page.waitForTimeout(50000)

      await metamask.confirmTransaction()
      await page.waitForTimeout(15000)

      const depositAfterTransaction = await earnPage.getDepositedTokenBalance()
      const valueAfterDeposit = await earnPage.getDepositedTokenValue()

      await earnPage.clickDepositMoreButton()

      expect(depositBeforeTransaction).toBeLessThan(depositAfterTransaction)
      expect(depositValueBeforeTransaction).toBeLessThan(valueAfterDeposit)
    })

    // CHECK
    test(`Confirm that user can deposit more tokens`, async ({
      context,
      page,
      extensionId,
    }) => {
      const dashboardPage = new DashboardPage(page)
      const earnPage = new EarnPage(page)
      const metamask = new MetaMask(
        context,
        page,
        auroraSetup.walletPassword,
        extensionId,
      )

      await dashboardPage.navigateToEarnPage()
      await earnPage.skipOnboardingIfVisible()

      test.skip(!(await earnPage.isAnyDepositsExist()))

      const depositBeforeTransaction = await earnPage.getDepositedTokenBalance()
      const depositValueBeforeTransaction =
        await earnPage.getDepositedTokenValue()

      await earnPage.clickDepositMoreButton()
      await earnPage.enterAmountToDeposit(amount)
      await earnPage.confirmDeposit()
      // Single metamask method does not complete metamask actions
      await metamask.confirmTransaction()
      await earnPage.waitForActionToComplete()
      await metamask.confirmTransaction()
      await earnPage.waitForActionToComplete()
      await page.getByRole("button", { name: "Deposit", exact: true }).click()
      await metamask.confirmTransaction()

      const depositAfterTransaction = await earnPage.getDepositedTokenBalance()
      const valueAfterDeposit = await earnPage.getDepositedTokenValue()
      expect(depositBeforeTransaction).toBeLessThan(depositAfterTransaction)
      expect(depositValueBeforeTransaction).toBeLessThan(valueAfterDeposit)
    })
  },
)

test.describe(
  "Aurora Plus: Earning Page - Borrowing",
  { tag: [AURORA_PLUS_TAG, AURORA_PLUS_TAG_BORROWING] },
  () => {
    test.beforeEach(
      "Login to Aurora Plus with MetaMask",
      async ({ auroraPlusPreconditions }) => {
        await auroraPlusPreconditions.loginToAuroraPlus()
      },
    )

    const tokenName: string = "USDC.e"
    const borrowAmount = 0.01
    test(`Confirm that user can borrow ${borrowAmount} ${tokenName} tokens`, async ({
      page,
      context,
      extensionId,
    }) => {
      const dashboardPage = new DashboardPage(page)
      const earnPage = new EarnPage(page)
      const metamask = new MetaMask(
        context,
        page,
        auroraSetup.walletPassword,
        extensionId,
      )

      await dashboardPage.navigateToEarnPage()
      await earnPage.skipOnboardingIfVisible()
      test.skip(await earnPage.borrowExists())

      await earnPage.selectTokenByTokenName(tokenName)
      await earnPage.enterAmount(borrowAmount)
      await earnPage.clickBorrowButton()
      await metamask.confirmTransaction()
      await earnPage.waitForActionToComplete()
      await earnPage.confirmBorrowExists()
    })

    test(`Confirm that user can borrow more tokens`, async ({
      page,
      context,
      extensionId,
    }) => {
      const dashboardPage = new DashboardPage(page)
      const earnPage = new EarnPage(page)
      const metamask = new MetaMask(
        context,
        page,
        auroraSetup.walletPassword,
        extensionId,
      )

      await dashboardPage.navigateToEarnPage()
      await earnPage.skipOnboardingIfVisible()

      test.skip(!(await earnPage.borrowExists()))

      const amountBefore = await earnPage.getBorrowedAmount()
      await earnPage.clickBorrowMoreButton()
      await earnPage.enterAmount(borrowAmount)
      await earnPage.clickBorrowButton()
      await metamask.confirmTransaction()
      const amountAfter = await earnPage.getBorrowedAmount()
      earnPage.confirmBorrowMoreWasSuccessfull(
        amountBefore,
        amountAfter,
        borrowAmount,
      )
    })

    test(`Confirm that user can repay ${tokenName} tokens`, async ({
      context,
      page,
      extensionId,
    }) => {
      const dashboardPage = new DashboardPage(page)
      const earnPage = new EarnPage(page)
      const metamask = new MetaMask(
        context,
        page,
        auroraSetup.walletPassword,
        extensionId,
      )

      await dashboardPage.navigateToEarnPage()
      await earnPage.skipOnboardingIfVisible()
      test.skip(!(await earnPage.borrowExists()))

      await earnPage.clickRepayButton()
      const amountToReturn = await earnPage.getBorrowedAmountToReturn()
      await earnPage.enterAmount(amountToReturn)
      await earnPage.clickApproveButton()
      await metamask.approveTokenPermission()
      await earnPage.waitForActionToComplete()
      await earnPage.clickRepayButton()
      await metamask.confirmTransaction()
      await earnPage.waitForActionToComplete()
      await earnPage.confirmBorrowNotExists()
    })
  },
)

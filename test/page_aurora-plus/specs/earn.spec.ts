import { setTimeout } from "node:timers/promises"
import { MetaMask } from "@synthetixio/synpress/playwright"
import { AURORA_PLUS_TAG } from "../../helpers/constants/tags"
import { test } from "../fixtures/aurora-plus"
import auroraSetup from "../../wallet-setup/aurora-plus.setup"
import { DashboardPage } from "../pages/dashboard.page"
import { AURORA_PLUS_PAGE } from "../../helpers/constants/pages"
import { EarnPage } from "../pages/earn.page"

const { expect } = test

test.use(AURORA_PLUS_PAGE)

test.describe("Aurora Plus: Earning", { tag: AURORA_PLUS_TAG }, () => {
  test.beforeEach(
    "Login to Aurora Plus with MetaMask",
    async ({ auroraPlusPreconditions }) => {
      await auroraPlusPreconditions.loginToAuroraPlus()
    },
  )

  const amount = 0.2

  test.only(`Confirm that user can deposit ${amount} tokens`, async ({
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

    let depositBeforeTransaction
    let depositValueBeforeTransaction

    await dashboardPage.navigateToEarnPage()

    await setTimeout(2000)

    if (await earnPage.isOnboardingVisible()) {
      await earnPage.skipOnboarding()
    }

    const depositAlradyExists = await earnPage.isAnyDepositsExist()
    console.log("deposit exists: ", depositAlradyExists)

    await setTimeout(1000)

    if (depositAlradyExists) {
      depositBeforeTransaction = await earnPage.getDepositedTokenBalance()
      depositValueBeforeTransaction = await earnPage.getDepositedTokenValue()
      await earnPage.clickDepositMoreButton()
    } else {
      depositBeforeTransaction = 0
      depositValueBeforeTransaction = 0
      await earnPage.selectAuroraToDeposit()
    }

    console.log("Balance", await earnPage.availableBalance.allInnerTexts())

    await setTimeout(1000)
    await earnPage.enterAmountToDeposit(amount)
    await earnPage.confirmDeposit()

    await metamask.confirmSignature()
    await metamask.approveTokenPermission()

    await setTimeout(15000)

    const depositAfterTransaction = await earnPage.getDepositedTokenBalance()
    const valueAfterDeposit = await earnPage.getDepositedTokenValue()

    await earnPage.clickDepositMoreButton()
    console.log("Balance", await earnPage.availableBalance.allInnerTexts())

    expect(depositBeforeTransaction).toBeLessThan(depositAfterTransaction)
    expect(depositValueBeforeTransaction).toBeLessThan(valueAfterDeposit)
  })
})

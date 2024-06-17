import { setTimeout } from "node:timers/promises"
import { AURORA_PLUS_TAG } from "../../lib/constants/tags"
import { test } from "../../lib/fixtures"
import { MetamaskActions } from "../helpers/metamask.actions"
import { EarnPage } from "../pages/earn.page"

test.describe.configure({ mode: "serial" })

test.describe("Aurora Plus: Earning", { tag: AURORA_PLUS_TAG }, () => {
  test.beforeEach(
    "Setup Metamask extension:",
    async ({ metamask, auroraPlus }) => {
      await metamask.setup()
      await auroraPlus.goto("/earn")
      await auroraPlus.connectToMetaMask()
    },
  )

  test("Confirm that user can deposit some tokens", async ({
    context,
    page,
  }) => {
    const earnPage = new EarnPage(page)
    const metamaskActions = new MetamaskActions()

    await earnPage.confirmEarnPageLoaded("/earn")

    if (await earnPage.isOnboardingVisible()) {
      await earnPage.skipOnboarding()
    }

    const depositAlradyExists = await earnPage.isAnyDepositsExist()

    await setTimeout(5000)

    if (depositAlradyExists) {
      await earnPage.clickDepositMoreButton()
    } else {
      await earnPage.selectAuroraToDeposit()
    }

    await earnPage.enterAmountToDeposit(0.1)
    await earnPage.confirmDeposit()

    const metamaskContext = metamaskActions.switchContextToExtension(context)
    await metamaskActions.clickNext(metamaskContext)
    await metamaskActions.clickApprove(metamaskContext)
    await metamaskActions.switchContextToPage(page)

    await earnPage.confirmSuccessfullyDepositedNotificationVisible()
  })
})

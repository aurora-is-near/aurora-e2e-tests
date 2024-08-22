
import { test } from "../fixtures/aurora-plus";
import { DashboardPage } from '../pages/dashboard.page';
import { AURORA_PLUS_TAG } from "../../helpers/constants/tags";
import { AURORA_PLUS_PAGE } from "../../helpers/constants/pages";

const { expect } = test;

test.use(AURORA_PLUS_PAGE)

test.describe("Dashboard page tests", { tag: AURORA_PLUS_TAG }, async () => {
  test.beforeEach('Login to Aurora Plus with MetaMask', async ({ auroraPlusPreconditions }) => {
    await auroraPlusPreconditions.loginToAuroraPlus()
  })

  test("Confirm that user can't stake more than balance allows", async ({
    page,
  }) => {
    const dashboardPage = new DashboardPage(page)
    await dashboardPage.confirmDashboardPageLoaded(page)

    await dashboardPage.skipOnboardingIfVisible()

    const auroraBalance = await dashboardPage.getAuroraBalance()

    await dashboardPage.clickStakeButton()
    await dashboardPage.stakeModal_enterAmount(auroraBalance + 100)
    await dashboardPage.confirmThatConfirmButtonDisabled()
  })
})

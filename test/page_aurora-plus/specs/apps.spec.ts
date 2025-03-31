import { MetaMask } from "@synthetixio/synpress/playwright"
import {
  AURORA_PLUS_TAG,
  AURORA_PLUS_TAG_SWAPPING,
} from "../../helpers/constants/tags"
import { test } from "../fixtures/aurora-plus"
import { DashboardPage } from "../pages/dashboard.page"
import { AURORA_PLUS_PAGE } from "../../helpers/constants/pages"
import { AppsPage } from "../pages/apps.page"

test.use(AURORA_PLUS_PAGE)

test.describe(
  "Aurora Plus: Swap Page - Swapping",
  { tag: [AURORA_PLUS_TAG, AURORA_PLUS_TAG_SWAPPING] },
  () => {
    test.beforeEach(
      "Login to Aurora Plus with MetaMask",
      async ({ auroraPlusPreconditions }) => {
        await auroraPlusPreconditions.loginToAuroraPlus()
      },
    )
    test.fixme(
      `Confirm user can search dApp in Apps page`,
      async ({ page }) => {
        const dashboardPage = new DashboardPage(page)
        const appsPage = new AppsPage(page)
        await dashboardPage.navigateToAppsPage()
        // fill input field
        const randomName = await appsPage.getRandomdAppName()
        await appsPage.fillAppSearch(randomName)
        // check if found
        await appsPage.searchAppFilter(randomName)
        await dashboardPage.waitForActionToComplete()
      },
    )
  },
)

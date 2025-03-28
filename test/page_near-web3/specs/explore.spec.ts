import { NEAR_WEB3_PAGE } from "../../helpers/constants/pages"
import {
  WEB3_WALLET_TAG,
  WEB3_WALLET_TAG_TRANSFERING,
} from "../../helpers/constants/tags"
import { test } from "../fixtures/near-web3"
import { HomePage } from "../pages/home.page"
import { ExplorePage } from "../pages/explore.page"

test.use(NEAR_WEB3_PAGE)

test.beforeEach(
  "Login to Near Web3 wallet with MetaMask",
  async ({ nearWeb3Preconditions }) => {
    await nearWeb3Preconditions.loginToNearWeb3()
  },
)

test.describe(
  "NEAR Web3 Wallet: Portfolio Page - Explore dApps",
  { tag: [WEB3_WALLET_TAG, WEB3_WALLET_TAG_TRANSFERING] },
  () => {
    test(`Confirm user can search an dApp on Explore page`, async ({
      page,
    }) => {
      const homePage = new HomePage(page)
      const explorePage = new ExplorePage(page)

      // navigate to explore page
      await homePage.navigateToExplorePage()
      // find a dApp to search from the visible list
      const randomName = await explorePage.getRandomdAppName()
      // enter the name into search field
      await explorePage.searchApp(randomName)
      // check if found
      await explorePage.searchAppFilter(randomName)
    })

    test(`Confirm copying account address works`, async ({ page, context }) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"])
      const homePage = new HomePage(page)

      // open dropdown
      await homePage.navigateToPortfolioPage()
      await homePage.openAccountDropdown()
      // press address
      await homePage.copyAccountAddress()
      // confirm in clipboard
      // Get clipboard content after the link/button has been clicked
      const handle = await page.evaluateHandle(() =>
        navigator.clipboard.readText(),
      )
      const clipboardContent = await handle.jsonValue()
      // try with dashboard
      const dashboardAccountAddress = await homePage.accountAddressInDashboard()
      homePage.checkCopiedAccountCorrect(
        clipboardContent,
        dashboardAccountAddress,
      )
    })

    test(`Disconnect user from app`, async ({ page }) => {
      const homePage = new HomePage(page)
      // confirm user is logged in
      await homePage.confirmAccountLoggedIn(false)
      // disconnect from account
      await homePage.openAccountDropdown()
      await homePage.disconnectAccount()
      // confirm user is logged out
      await homePage.confirmAccountLoggedIn(false)
    })
  },
)

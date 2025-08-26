import { NEAR_INTENTS_PAGE } from "../../helpers/constants/pages"
import { NEAR_INTENTS_TAG } from "../../helpers/constants/tags"
import { test } from "../fixtures/near-intents"

test.use(NEAR_INTENTS_PAGE)

test.beforeEach(
  "Login to Near Web3 wallet with MetaMask",
  async ({ nearIntentsPreconditions }) => {
    await nearIntentsPreconditions.loginToNearIntents()
    await nearIntentsPreconditions.isSignatureCheckRequired()
  },
)

test.describe("NEAR Intents Wallet: temp", { tag: [NEAR_INTENTS_TAG] }, () => {
  test(`Confirm user can search an dApp on Explore page`, async ({ page }) => {
    await page.pause()
    //   const homePage = new HomePage(page)
    //   const explorePage = new ExplorePage(page)
    //   // navigate to explore page
    //   await homePage.navigateToExplorePage()
    //   // find a dApp to search from the visible list
    //   const randomName = await explorePage.getRandomdAppName()
    //   // enter the name into search field
    //   await explorePage.searchApp(randomName)
    //   // check if found
    //   await explorePage.searchAppFilter(randomName)
  })
})

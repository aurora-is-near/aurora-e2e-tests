import { WEB3_WALLET_TAG } from "../../helpers/constants/tags"
import { nearEnvironment } from "../../helpers/functions/system-variables"
import { test } from "../fixtures/near-web3"
import { HomePage } from "../pages/home.page"

test.use(nearEnvironment())

test.beforeEach(
  "Login to Near Web3 wallet with MetaMask",
  async ({ nearWeb3Preconditions }) => {
    await nearWeb3Preconditions.loginToNearWeb3()
  },
)

test.describe("NEAR Web3 Wallet: Swapping", { tag: WEB3_WALLET_TAG }, () => {
  const tokenFrom = "NEAR"

  test(`Confirm that user cannot swap more than the balance contains`, async ({
    page,
  }) => {
    const transferAmount = 9999
    const homePage = new HomePage(page)
    await homePage.confirmHomePageLoaded("/")
    await homePage.scrollToSwapContainer()
    await homePage.selectTokenToSwapFrom(tokenFrom)
    await homePage.enterSwapFromAmount(transferAmount)
    await homePage.confirmSwapButtonNotAvailable()
  })
})

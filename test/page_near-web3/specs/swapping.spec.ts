import {
  NEAR_WEB3_PAGE,
  NEAR_WEB3_PAGE_TESTNET,
} from "../../helpers/constants/pages"
import { WEB3_WALLET_TAG } from "../../helpers/constants/tags"
import { test } from "../fixtures/near-web3"
import { HomePage } from "../pages/home.page"

const nearWebPage =
  (process.env.NEAR_NETWORK as string) === "testnet"
    ? NEAR_WEB3_PAGE_TESTNET
    : NEAR_WEB3_PAGE

test.use(nearWebPage)

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

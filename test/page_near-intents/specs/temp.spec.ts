import { MetaMask } from "@synthetixio/synpress/playwright"
import { NEAR_INTENTS_PAGE } from "../../helpers/constants/pages"
import { NEAR_INTENTS_TAG } from "../../helpers/constants/tags"
import { test } from "../fixtures/near-intents"
import { DepositPage } from "../pages/deposit.page"
import { HomePage } from "../pages/home.page"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"

test.use(NEAR_INTENTS_PAGE)

test.beforeEach(
  "Login to Near Web3 wallet with MetaMask",
  async ({ nearIntentsPreconditions, page }) => {
    await nearIntentsPreconditions.loginToNearIntents()
    await page.waitForTimeout(5_000)
    await nearIntentsPreconditions.isSignatureCheckRequired()
  },
)

test.describe("NEAR Intents Wallet: temp", { tag: [NEAR_INTENTS_TAG] }, () => {
  // DEPOSIT
  // SWAP
  // OTC
  // WITHDRAW
  test(`Confirm user can deposit`, async ({ page, context, extensionId }) => {
    const homePage = new HomePage(page)
    const depositPage = new DepositPage(page)
    const metamask = new MetaMask(
      context,
      page,
      nearWeb3ProdSetup.walletPassword,
      extensionId,
    )
    await homePage.navigateToDepositPage()
    await depositPage.confirmDepositPageLoaded()
    await depositPage.selectAssetToken("Aurora")
    await depositPage.selectAssetNetwork("Aurora")
    await depositPage.enterDepositValue(0.001)
    await depositPage.clickDeposit()
    await metamask.approveNewNetwork()
    await metamask.approveSwitchNetwork()
    await page.pause()
    await metamask.confirmTransaction()

    // here need to check if already completed deposit - if not then metamask confirm again
    await page.pause()
    await metamask.confirmTransaction()
    await depositPage.confirmTransactionCompleted()
  })
})

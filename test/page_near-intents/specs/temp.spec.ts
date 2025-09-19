import { MetaMask } from "@synthetixio/synpress/playwright"
import { NEAR_INTENTS_PAGE } from "../../helpers/constants/pages"
import { NEAR_INTENTS_TAG } from "../../helpers/constants/tags"
import { test } from "../fixtures/near-intents"
import { DepositPage } from "../pages/deposit.page"
import { HomePage } from "../pages/home.page"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"
import { TradePage } from "../pages/trade.page"
import { AccountPage } from "../pages/account.page"

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

  // TODO
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
    await page.waitForTimeout(5_000)
    await metamask.confirmTransaction()

    // here need to check if already completed deposit - if not then metamask confirm again
    await depositPage.confirmTransactionCompleted()
  })

  test(`Confirm user can swap`, async ({ page, context, extensionId }) => {
    const homePage = new HomePage(page)
    const tradePage = new TradePage(page)
    const metamask = new MetaMask(
      context,
      page,
      nearWeb3ProdSetup.walletPassword,
      extensionId,
    )

    await homePage.navigateToTradePage()
    await tradePage.switchToSwap()
    await tradePage.selectFromToken("Aurora")
    await tradePage.selectToToken("Near")
    await tradePage.enterFromAmount(0.0001)
    await tradePage.waitForSwapCalculationToComplete()
    await tradePage.pressSwapButton()
    await metamask.confirmSignature()
    await tradePage.confirmTransactionCompleted()
  })

  test(`Confirm user can OTC`, async ({ page, context, extensionId }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    const homePage = new HomePage(page)
    const tradePage = new TradePage(page)
    const metamask = new MetaMask(
      context,
      page,
      nearWeb3ProdSetup.walletPassword,
      extensionId,
    )

    await homePage.navigateToTradePage()
    await tradePage.switchToOTC()
    await page.waitForTimeout(1_000)
    await tradePage.selectSellToken("Aurora")
    await tradePage.selectBuyToken("Near")
    await tradePage.enterFromAmount(0.0001)
    await tradePage.enterToAmount(0.0001)
    await tradePage.pressCreateSwapLink()

    await metamask.confirmSignature()
    await tradePage.confirmOrderWindowIsOpen()
    await tradePage.confirmUserCanCopyLink()

    await tradePage.closeOrderWindow()
    await tradePage.confirmOTCCreated({
      sellAmount: 0.0001,
      sellToken: "Aurora",
      buyAmount: 0.0001,
      buyToken: "Near",
    })
  })

  test(`Confirm that user can withdraw`, async ({
    page,
    context,
    extensionId,
  }) => {
    const homePage = new HomePage(page)
    const accountsPage = new AccountPage(page)
    const metamask = new MetaMask(
      context,
      page,
      nearWeb3ProdSetup.walletPassword,
      extensionId,
    )
    await homePage.navigateToAccountPage()
    await accountsPage.confirmAccountPageLoaded()
    await accountsPage.pressAccountsBtn()
    await accountsPage.selectToken("Aurora")
    await accountsPage.enterAmount(0.0001)
    
    await page.pause()
  })
})

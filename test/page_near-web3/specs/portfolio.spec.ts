import { MetaMask } from "@synthetixio/synpress/playwright"
import { NEAR_WEB3_PAGE } from "../../helpers/constants/pages"
import {
  WEB3_WALLET_TAG,
  WEB3_WALLET_TAG_TRANSFERING,
} from "../../helpers/constants/tags"
import { test } from "../fixtures/near-web3"
import { HomePage } from "../pages/home.page"
import { PortfolioPage } from "../pages/portfolio.page"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"

test.use(NEAR_WEB3_PAGE)

test.beforeEach(
  "Login to Near Web3 wallet with MetaMask",
  async ({ nearWeb3Preconditions }) => {
    await nearWeb3Preconditions.loginToNearWeb3()
  },
)

test.describe(
  "NEAR Web3 Wallet: Portfolio Page - Transfering",
  { tag: [WEB3_WALLET_TAG, WEB3_WALLET_TAG_TRANSFERING] },
  () => {
    const assets: string[] = ["NEAR", "USDt", "FLX"]
    const transferAmount = 0.01
    const transferAccountAddress: string =
      "0x2a8ac9f504ea4c9da5eb435b92027cb86c793ce4"

    for (const asset of assets) {
      test(`Confirm that user can send asset: ${asset}`, async ({
        page,
        context,
        extensionId,
      }) => {
        const homePage = new HomePage(page)
        const portfolioPage = new PortfolioPage(page)
        const metamask = new MetaMask(
          context,
          page,
          nearWeb3ProdSetup.walletPassword,
          extensionId,
        )

        await homePage.navigateToPortfolioPage()
        await portfolioPage.clickSendButton()
        const currentBalance = await portfolioPage.selectAsset(asset)
        test.skip(
          currentBalance < transferAmount,
          `Insufficient funds for sending, balance: ${currentBalance}, transfer: ${transferAmount}`,
        )
        await portfolioPage.enterTransferAmount(transferAmount)
        await portfolioPage.clickContinueButton()
        await portfolioPage.enterNearAccountId(transferAccountAddress)
        await portfolioPage.clickContinueButton()
        await portfolioPage.clickConfirmAndSend()
        await portfolioPage.clickConfirmTransactionButton()
        await metamask.confirmTransaction()
        await portfolioPage.waitForTransactionToComplete()
        await portfolioPage.confirmSuccessNotificationAppears()
      })
    }

    test(`Confirm that user receive funds`, async ({
      page,
      context,
      extensionId,
      nearWeb3Preconditions,
    }) => {
      const homePage = new HomePage(page)
      const portfolioPage = new PortfolioPage(page)
      const metamask = new MetaMask(
        context,
        page,
        nearWeb3ProdSetup.walletPassword,
        extensionId,
      )

      await homePage.navigateToPortfolioPage()
      const initialBalance = await portfolioPage.getAvailableBalance()
      await portfolioPage.clickSendButton()
      await portfolioPage.selectAsset("NEAR")
      await portfolioPage.enterTransferAmount(0.001)
      await portfolioPage.clickContinueButton()
      await portfolioPage.enterNearAccountId(transferAccountAddress)
      await portfolioPage.clickContinueButton()
      await portfolioPage.clickConfirmAndSend()
      await portfolioPage.clickConfirmTransactionButton()
      await metamask.confirmTransaction()
      await portfolioPage.waitForTransactionToComplete()
      await portfolioPage.confirmSuccessNotificationAppears()
      await homePage.navigateToPortfolioPage()
      await homePage.openAccountDropdown()
      await homePage.disconnectAccount()

      await homePage.waitForActionToComplete()
      await nearWeb3Preconditions.loginToNearWeb3Account("Account 1")

      await homePage.waitForActionToComplete()
      await homePage.checkSenderBalances(initialBalance)
    })
  },
)

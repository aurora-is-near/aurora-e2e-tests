import { MetaMask } from "@synthetixio/synpress/playwright"
import { NEAR_INTENTS_PAGE } from "../../helpers/constants/pages"
import {
  NEAR_INTENTS_TAG,
  NEAR_INTENTS_TAG_DEPOSIT,
  NEAR_INTENTS_TAG_WITHDRAW,
} from "../../helpers/constants/tags"
import { test } from "../fixtures/near-intents"
import { DepositPage } from "../pages/deposit.page"
import { HomePage } from "../pages/home.page"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"
import { AccountPage } from "../pages/account.page"

test.use(NEAR_INTENTS_PAGE)

test.beforeEach(
  "Login to Near Web3 wallet with MetaMask",
  async ({ nearIntentsPreconditions }) => {
    await nearIntentsPreconditions.loginToNearIntents()
    await nearIntentsPreconditions.isSignatureCheckRequired()
    await nearIntentsPreconditions.waitForAccountSync()
  },
)

test.describe(
  "NEAR Intents Wallet: Deposit",
  { tag: [NEAR_INTENTS_TAG, NEAR_INTENTS_TAG_DEPOSIT] },
  () => {
    test(`Confirm user cannot deposit more than balance allows`, async ({
      page,
    }) => {
      const homePage = new HomePage(page)
      const depositPage = new DepositPage(page)
      await homePage.navigateToDepositPage()
      await depositPage.confirmDepositPageLoaded()
      await depositPage.selectAssetToken("Aurora")
      await depositPage.selectAssetNetwork("Aurora")
      await depositPage.enterDepositValue(1000000)
      await depositPage.confirmInsufficientBalance()
    })

    test(`Confirm user can deny the deposit`, async ({
      page,
      context,
      extensionId,
    }) => {
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
      await metamask.rejectTransaction()
      await depositPage.confirmTransactionCancelled()
    })

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
      await page.waitForTimeout(1_000)
      await depositPage.clickDeposit()
      await metamask.approveNewNetwork()
      await metamask.approveSwitchNetwork()
      await page.waitForTimeout(5_000)
      await metamask.confirmTransaction()

      if (!(await depositPage.isTransactionProcessing())) {
        await metamask.confirmTransaction()
        await page.waitForTimeout(5_000)
        await metamask.confirmTransaction()
      }

      await depositPage.confirmTransactionCompleted()
    })
  },
)

test.describe(
  "NEAR Intents Wallet: Withdraw",
  { tag: [NEAR_INTENTS_TAG, NEAR_INTENTS_TAG_WITHDRAW] },
  () => {
    const transferAccountAddress: string =
      "0x2a8ac9f504ea4c9da5eb435b92027cb86c793ce4"

    test(`Confirm that user cannot withdraw more than allowed`, async ({
      page,
    }) => {
      const homePage = new HomePage(page)
      const accountsPage = new AccountPage(page)
      await homePage.navigateToAccountPage()
      await accountsPage.confirmAccountPageLoaded()
      await accountsPage.pressAccountsBtn()
      await accountsPage.selectToken("Aurora")
      await accountsPage.enterAmount(10000)
      await accountsPage.selectTargetNetwork("Near")
      await accountsPage.enterTargetAccount(transferAccountAddress)
      await accountsPage.confirmWithdrawal()
      await accountsPage.confirmWithdrawInsufficientBalance()
    })

    test(`Confirm user can deny withdraw`, async ({
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
      await accountsPage.selectTargetNetwork("Near")
      await accountsPage.enterTargetAccount(transferAccountAddress)
      await accountsPage.confirmWithdrawal()

      await metamask.rejectSignature()
      await accountsPage.confirmTransactionCancelled()
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
      await accountsPage.selectTargetNetwork("Near")
      await accountsPage.enterTargetAccount(transferAccountAddress)
      await accountsPage.confirmWithdrawal()

      await metamask.confirmSignature()
      await accountsPage.confirmWithdrawalState("Pending")
      await accountsPage.confirmWithdrawalState("Completed")
    })
  },
)

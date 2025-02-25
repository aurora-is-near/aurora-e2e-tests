import { MetaMask } from "@synthetixio/synpress/playwright"
import { NEAR_WEB3_PAGE } from "../../helpers/constants/pages"
import {
  WEB3_WALLET_TAG,
  WEB3_WALLET_TAG_STAKING,
} from "../../helpers/constants/tags"
import { test } from "../fixtures/near-web3"
import { HomePage } from "../pages/home.page"
import { BasePage } from "../pages/base.page"
import { StakingPage } from "../pages/staking.page"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"

test.use(NEAR_WEB3_PAGE)
test.beforeEach(
  "Login to Near Web3 wallet with MetaMask",
  async ({ nearWeb3Preconditions }, testInfo) => {
    await nearWeb3Preconditions.loginToNearWeb3()
    testInfo.setTimeout(30_000)
  },
)

test.describe(
  "NEAR Web3 Wallet: Staking Page - Staking",
  { tag: [WEB3_WALLET_TAG, WEB3_WALLET_TAG_STAKING] },
  () => {
    const stakeAmount = 0.01
    const unstakeAmount = 0.1

    test(`Confirm that user can't stake more than balance allows`, async ({
      page,
    }) => {
      const homePage = new HomePage(page)
      const stakingPage = new StakingPage(page)

      await homePage.confirmHomePageLoaded()
      await homePage.navigateToStakingPage()
      await stakingPage.clickStakeTokensButton()
      await stakingPage.selectValidator()
      const availableBalance = await stakingPage.getAvalableBalance()
      await stakingPage.enterAmount(availableBalance * 100)
      await stakingPage.confirmStake()
      await stakingPage.confirmTransactionIsBlocked()
    })

    test(`Confirm that user can stake ${stakeAmount} tokens`, async ({
      page,
      context,
      extensionId,
    }) => {
      const homePage = new HomePage(page)
      const basePage = new BasePage(page)
      const stakingPage = new StakingPage(page)
      const metamask = new MetaMask(
        context,
        page,
        nearWeb3ProdSetup.walletPassword,
        extensionId,
      )

      await homePage.confirmHomePageLoaded()
      await basePage.navigateToStakingPage()
      await stakingPage.clickStakeTokensButton()
      await stakingPage.selectValidator()
      const availableBalance = await stakingPage.getAvalableBalance()
      test.skip(
        availableBalance < stakeAmount,
        `Insufficient funds for staking, balance: ${availableBalance}, transfer: ${stakeAmount}`,
      )
      await stakingPage.enterAmount(stakeAmount)
      await stakingPage.confirmStake()
      await stakingPage.confirmTransaction()
      await metamask.confirmTransaction()
      await stakingPage.confirmSuccessNotificationAppears()
      await stakingPage.returnToStakingInputPage()
      const availableBalanceAfter = await stakingPage.getAvalableBalance()
      stakingPage.confirmTransactionWasCorrect(
        availableBalance,
        availableBalanceAfter,
      )
    })

    test(`Confirm that user can't unstake more than staked amount`, async ({
      page,
    }) => {
      const homePage = new HomePage(page)
      const stakingPage = new StakingPage(page)

      await homePage.confirmHomePageLoaded()
      await stakingPage.navigateToStakingPage()
      test.skip(
        !(await stakingPage.unstakingIsReady()),
        "There are no balance to unstake",
      )
      await stakingPage.clickUnstakeLink()
      await stakingPage.clickSelectButton()
      const availableToUnstake = await stakingPage.getAvalableBalance()
      await stakingPage.enterAmount(availableToUnstake * 100)
      await stakingPage.clickUnstakeButton()
      await stakingPage.confirmInsufficientFundsNotificationVisible()
    })

    test(`Confirm that user can unstake ${unstakeAmount} tokens`, async ({
      page,
      context,
      extensionId,
    }) => {
      const homePage = new HomePage(page)
      const stakingPage = new StakingPage(page)
      const metamask = new MetaMask(
        context,
        page,
        nearWeb3ProdSetup.walletPassword,
        extensionId,
      )

      await homePage.confirmHomePageLoaded()
      await stakingPage.navigateToStakingPage()

      test.skip(
        !(await stakingPage.unstakingIsReady()),
        "There are no balance to unstake",
      )

      await stakingPage.clickUnstakeLink()
      await stakingPage.clickSelectButton()
      await stakingPage.clickMaxAmountButton()
      await stakingPage.clickUnstakeButton()
      await stakingPage.confirmTransaction()
      await metamask.confirmTransaction()
      await stakingPage.confirmSuccessNotificationAppears()
    })

    test(`Confirm that user can claim withdraw unstaked balance`, async ({
      page,
      context,
      extensionId,
    }) => {
      const homePage = new HomePage(page)
      const stakingPage = new StakingPage(page)
      const metamask = new MetaMask(
        context,
        page,
        nearWeb3ProdSetup.walletPassword,
        extensionId,
      )

      await homePage.confirmHomePageLoaded()
      await homePage.navigateToStakingPage()

      test.skip(
        !(await stakingPage.withdrawalIsReady()),
        "There are no balance to withdraw",
      )

      // Scroll to the bottom to avoid scrolling back and forth
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })

      await stakingPage.clickWithdrawButton()
      await stakingPage.confirmTransaction()
      await metamask.confirmTransaction()
      await stakingPage.confirmSuccessNotificationAppears()
    })
  },
)

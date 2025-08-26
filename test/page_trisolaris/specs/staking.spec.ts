import { MetaMask } from "@synthetixio/synpress/playwright"
import {
  TRISOLARIS_TAG,
  TRISOLARIS_TAG_STAKING,
} from "../../helpers/constants/tags"
import { test } from "../fixtures/trisolaris"
import { TRISOLARIS_PAGE } from "../../helpers/constants/pages"
import { HomePage } from "../pages/home.page"
import trisolarisSetup from "../../wallet-setup/trisolaris.setup"
import { StakingPage } from "../pages/staking.page"

test.use(TRISOLARIS_PAGE)

test.beforeEach(
  "Login to Trisolaris wallet with MetaMask",
  async ({ trisolarisPreconditions, page }) => {
    await trisolarisPreconditions.loginToTrisolaris()
    await page.waitForTimeout(2_000)
    await page.reload()
  },
)
test.describe(
  "Trisolars Wallet: Stake Page - Staking/Unstaking",
  { tag: [TRISOLARIS_TAG, TRISOLARIS_TAG_STAKING] },
  () => {
    const stakeAmount = 0.01
    const unstakeAmount = 0.1

    test(`Confirm that user can't stake more than balance allows`, async ({
      page,
    }) => {
      const homePage = new HomePage(page)
      const stakingPage = new StakingPage(page)

      await homePage.confirmHomePageLoaded()
      await homePage.navigateToStakePage()
      await stakingPage.confirmStakingPageLoaded()

      const availableBalance = await stakingPage.getAvalableBalance()
      await stakingPage.enterAmount(availableBalance * 100)
      await stakingPage.confirmTransactionIsBlocked()
    })

    test(`Confirm that user can stake ${stakeAmount} tokens`, async ({
      page,
      context,
      extensionId,
    }) => {
      // specifically set timeout here since this test on CI seems to take a
      // long time
      test.setTimeout(120_000)
      const homePage = new HomePage(page)
      const stakingPage = new StakingPage(page)
      const metamask = new MetaMask(
        context,
        page,
        trisolarisSetup.walletPassword,
        extensionId,
      )

      await homePage.confirmHomePageLoaded()
      await homePage.navigateToStakePage()
      await stakingPage.confirmStakingPageLoaded()

      const availableBalance = await stakingPage.getAvalableBalance()
      await stakingPage.enterAmount(stakeAmount)

      test.skip(
        availableBalance < stakeAmount,
        `Insufficient funds for staking, balance: ${availableBalance}, transfer: ${stakeAmount}`,
      )

      await stakingPage.clickStakeButton()
      await stakingPage.confirmStake()
      await metamask.confirmTransaction()
      await stakingPage.confirmTransactionIsSubmitted()
      await stakingPage.confirmTransactionIsDone()
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
      await homePage.navigateToStakePage()
      await stakingPage.confirmStakingPageLoaded()

      await stakingPage.setStakeMode()
      const availableToUnstake = await stakingPage.getAvalableBalance()
      await stakingPage.enterAmount(availableToUnstake * 100)
      await stakingPage.confirmTransactionIsBlocked()
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
        trisolarisSetup.walletPassword,
        extensionId,
      )

      await homePage.confirmHomePageLoaded()
      await homePage.navigateToStakePage()
      await stakingPage.confirmStakingPageLoaded()

      await stakingPage.setStakeMode()
      await stakingPage.enterAmount(unstakeAmount)
      const availableToUnstake = await stakingPage.getAvalableBalance()
      test.skip(
        availableToUnstake < unstakeAmount,
        `Insufficient funds for staking, balance: ${availableToUnstake}, transfer: ${unstakeAmount}`,
      )

      await stakingPage.clickUnstakeButton()
      await stakingPage.confirmUnstake()
      await metamask.confirmTransaction()
      await stakingPage.confirmTransactionIsSubmitted()
      await stakingPage.confirmTransactionIsDone()
      const availableBalanceAfter = await stakingPage.getAvalableBalance()
      stakingPage.confirmTransactionWasCorrect(
        availableToUnstake,
        availableBalanceAfter,
      )
    })
  },
)

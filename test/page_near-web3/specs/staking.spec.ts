import { MetaMask } from "@synthetixio/synpress/playwright"
import { NEAR_WEB3_PAGE } from "../../helpers/constants/pages"
import { WEB3_WALLET_TAG } from "../../helpers/constants/tags"
import { test } from "../fixtures/near-web3"
import { HomePage } from "../pages/home.page"
import { BasePage } from "../pages/base.page"
import { StakingPage } from "../pages/staking.page"
import nearWeb3ProdSetup from "../../wallet-setup/near-web3-prod.setup"

test.use(NEAR_WEB3_PAGE)
test.beforeEach(
  "Login to Near Web3 wallet with MetaMask",
  async ({ nearWeb3Preconditions }) => {
    await nearWeb3Preconditions.loginToNearWeb3()
  },
)

test.describe("NEAR: Stake Page - Staking", { tag: WEB3_WALLET_TAG }, () => {
  test(`Confirm that user can't stake more than balance allows`, async ({
    page,
    context,
    extensionId,
  }) => {
    const stakeAmount = 0.1

    const homePage = new HomePage(page)
    const basePage = new BasePage(page)
    const stakingPage = new StakingPage(page)
    const metamask = new MetaMask(
      context,
      page,
      nearWeb3ProdSetup.walletPassword,
      extensionId,
    )

    await homePage.confirmHomePageLoaded("/")
    await basePage.navigateToStakingPage()
    throw new Error("Test not implemented.")
  })

  const stakeAmount = 0.1
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

    await homePage.confirmHomePageLoaded("/")
    await basePage.navigateToStakingPage()
    await stakingPage.clickStakeTokensButton()
    await stakingPage.selectValidator()
    await stakingPage.getAvalableBalance()
    await stakingPage.enterAmountToStake(stakeAmount)
    await stakingPage.confirmStake()
    await stakingPage.confirmTransaction()
    await metamask.confirmTransaction()
    await stakingPage.returnToStakingInputPage()
    throw new Error("Test not implemented.")
  })

  test(`Confirm that user can't unstake more than staked amount`, async ({
    page,
    context,
    extensionId,
  }) => {
    const stakeAmount = 0.1

    const homePage = new HomePage(page)
    const basePage = new BasePage(page)
    const stakingPage = new StakingPage(page)
    const metamask = new MetaMask(
      context,
      page,
      nearWeb3ProdSetup.walletPassword,
      extensionId,
    )

    await homePage.confirmHomePageLoaded("/")
    await basePage.navigateToStakingPage()
    throw new Error("Test not implemented.")
  })

  const unstakeAmount = 0.1
  test(`Confirm that user can unstake ${unstakeAmount} tokens`, async ({
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

    await homePage.confirmHomePageLoaded("/")
    await basePage.navigateToStakingPage()
    throw new Error("Test not implemented.")
  })

  test(`Confirm that user can claim tokens after cooldown passes`, async ({
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

    await homePage.confirmHomePageLoaded("/")
    await basePage.navigateToStakingPage()
    throw new Error("Test not implemented.")
  })
})

// Send/Transfer:
// NEAR
// USDT
// REF

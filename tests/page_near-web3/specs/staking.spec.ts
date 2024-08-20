// // import { MetamaskActions } from "../../helpers/metamask.actions"
// import { NEAR_WEB3_PAGE } from "../../helpers/constants/pages"
// import { WEB3_WALLET_TAG } from "../../helpers/constants/tags"
// import { test } from "../fixtures/near-web3"
// import { HomePage } from "../pages/home.page"

// test.use(NEAR_WEB3_PAGE)

// test.beforeEach('Login to Near Web3 wallet with MetaMask', async ({ nearWeb3Preconditions }) => {
//     await nearWeb3Preconditions.loginToNearWeb3()
// })

// test.describe("NEAR Web3 Wallet: Swapping", { tag: WEB3_WALLET_TAG }, () => {
//     test(`Confirm that user can swap some tokens`, async ({ page }, testInfo) => {
//         console.log(testInfo.title)
//         const homePage = new HomePage(page)
//         // const metamaskActions = new MetamaskActions()

//         await homePage.confirmSwapPageLoaded("/")
//         await homePage.scrollToSwapContainer()
//         await homePage.selectSwapFromToken()

//         await page.pause()
//     })
// })

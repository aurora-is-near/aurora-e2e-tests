// import { expect, type Page } from "@playwright/test"

// export class BasePage {
//     page: Page

//     constructor(page: Page) {
//         this.page = page
//     }

//     async confirmCorrectPageLoaded(page: Page, urlExtension: string) {

//         const url = (process.env.NEAR_NETWORK as string === 'testnet')
//             ? "https://web3-wallet-testnet.vercel.app/"
//             : "https://web3-wallet-three.vercel.app"

//             console.log(`${url}${urlExtension}`);

//         await expect(page, `Loaded page is not ${urlExtension}`).toHaveURL(
//             `${url}${urlExtension}`,
//         )
//     }
// }

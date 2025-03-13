import { testWithSynpress } from "@synthetixio/synpress"
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright"
import type { Cookie } from "playwright"
import auroraSetup from "../../wallet-setup/aurora-plus.setup"
import { HomePage } from "../pages/home.page"
import { DashboardPage } from "../pages/dashboard.page"

export const test = testWithSynpress(metaMaskFixtures(auroraSetup)).extend<{
  auroraPlusPreconditions: {
    loginToAuroraPlus: () => Promise<void>
    assignCookieToAutomation: () => Promise<void>
  }
}>({
  auroraPlusPreconditions: async ({ page, context, extensionId }, use) => {
    const metamask = new MetaMask(
      context,
      page,
      auroraSetup.walletPassword,
      extensionId,
    )

    const homePage = new HomePage(page)
    const dashboardPage = new DashboardPage(page)

    const assignCookieToAutomation = async () => {
      const myCookie: Cookie = {
        name: "aurora-e2e-testing",
        value: "True",
        domain:
          "aurora-plus-git-e2e-automation-debugging-auroraisnear.vercel.app",
        path: "/",
        expires: -1,
        httpOnly: false,
        secure: true,
        sameSite: "Lax",
      }
      await context.addCookies([myCookie])
      // await page.route("**/*", async (route, request) => {
      //   // Clone the request headers
      //   const headers = { ...request.headers() }

      //   // Add my cookie to the headers
      //   headers.cookie = "aurora-e2e-testing=True"

      //   // Continue the request with the modified headers
      //   await route.continue({ headers })
      // })
    }

    const loginToAuroraPlus = async () => {
      await page.waitForTimeout(1000)
      await homePage.confirmCorrectPageLoaded(page, "/")
      await page.waitForTimeout(1000)
      await homePage.clickLaunchAppButton()
      await page.waitForTimeout(1000)
      await dashboardPage.confirmCorrectPageLoaded(page, "/dashboard")
      await page.waitForTimeout(1000)
      await dashboardPage.clickConnectWalletButton()
      await page.waitForTimeout(1000)
      await dashboardPage.clickConnectWalletButtonInModal()
      await page.waitForTimeout(1000)
      await dashboardPage.clickSkipIHaveWallet()
      await page.waitForTimeout(1000)
      await dashboardPage.selectMetaMaskWalletInModal()
      await page.waitForTimeout(1000)
      await metamask.connectToDapp()
      await page.waitForTimeout(1000)
      await dashboardPage.clickAcceptAndSignButton()
      await page.waitForTimeout(1000)
      await metamask.confirmSignature()
      await page.waitForTimeout(1000)
    }

    await use({
      loginToAuroraPlus,
      assignCookieToAutomation,
    })
  },
})

import { CALYX_PAGE } from "../../helpers/constants/pages"
import { test } from "../fixtures/calyx"

test.use(CALYX_PAGE)

test.beforeEach(
  "Login to Calyx with MetaMask",
  async ({ calyxPreconditions }) => {
    await calyxPreconditions.loginToCalyx()
    await calyxPreconditions.signInMetamaskAccount()
  },
)

test.describe("Calyx: Temp", { tag: [] }, () => {
  test(`temp test`, async ({ page }) => {
    await page.pause()
  })
})

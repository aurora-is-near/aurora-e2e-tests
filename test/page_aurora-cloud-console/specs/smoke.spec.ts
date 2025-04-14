import { test } from "../fixtures/aurora-cloud-console"
import { AURORA_CLOUD_CONSOLE_TAG } from "../../helpers/constants/tags"
import { AURORA_CLOUD_CONSOLE_PAGE } from "../../helpers/constants/pages"

test.use(AURORA_CLOUD_CONSOLE_PAGE)

test.describe(
  "Aurora Cloud Console: Temp",
  { tag: [AURORA_CLOUD_CONSOLE_TAG] },
  () => {
    test.beforeEach(
      "Login to Aurora Plus with MetaMask",
      async ({ auroraCloudPreconditions }) => {
        await auroraCloudPreconditions.loginToSupabase()
      },
    )

    test(`temp`, async ({ page, context }) => {
      const temp = await context.cookies()
      console.log(temp)
      await page.goto(`${AURORA_CLOUD_CONSOLE_PAGE.baseURL}/tdl/silos/103`)
      await page.pause()
    })
  },
)

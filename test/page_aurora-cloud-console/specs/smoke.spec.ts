import { test } from "../fixtures/aurora-cloud-console"
import { AURORA_CLOUD_CONSOLE_TAG } from "../../helpers/constants/tags"
import { AURORA_CLOUD_CONSOLE_PAGE } from "../../helpers/constants/pages"

test.use(AURORA_CLOUD_CONSOLE_PAGE)

test.describe(
  "Aurora Cloud Console: Temp",
  { tag: [AURORA_CLOUD_CONSOLE_TAG] },
  () => {
    test(`temp test`, async ({ page, context }) => {
      await page.goto(`${AURORA_CLOUD_CONSOLE_PAGE.baseURL}/tdl/silos/103`)
      await page.reload()
      const cookies = await context.cookies()
      console.log(cookies)
      await page.pause()
    })
  },
)

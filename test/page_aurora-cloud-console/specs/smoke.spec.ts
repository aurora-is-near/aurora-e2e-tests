import {
  AURORA_PLUS_TAG,
  AURORA_PLUS_TAG_SWAPPING,
} from "../../helpers/constants/tags"
import { test } from "../fixtures/aurora-cloud-console"
import { AURORA_CLOUD_CONSOLE_PAGE } from "../../helpers/constants/pages"

test.use(AURORA_CLOUD_CONSOLE_PAGE)

test.describe(
  "Aurora Plus: App Page - dApps",
  { tag: [AURORA_PLUS_TAG, AURORA_PLUS_TAG_SWAPPING] },
  () => {
    test.beforeEach(
      "Login to Aurora Cloud Console",
      async ({ auroraPlusPreconditions }) => {},
    )
    test(`temp`, async ({ page }) => {
      await page.pause()
    })
  },
)

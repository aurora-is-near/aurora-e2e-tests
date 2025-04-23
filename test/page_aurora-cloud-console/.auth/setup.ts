import { type Cookie, test as setup } from "@playwright/test"
import path from "path"
import { fileURLToPath } from "url"
import { createClient as supabaseCreateClient } from "@supabase/supabase-js"
import {
  getSupabaseKey,
  getSupabaseURL,
  getTestUserPass,
} from "../../helpers/functions/system-variables"
import { AURORA_CLOUD_CONSOLE_PAGE } from "../../helpers/constants/pages"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const authFile = path.join(__dirname, "../.auth/user.json")
const SUPABASE_URL = getSupabaseURL()
const supabase_domain = SUPABASE_URL.split(".supabase.co")[0].split("//")[1]
const SUPABASE_KEY = getSupabaseKey()
const TEST_USER_EMAIL = "maksim.vashchuk+e2e@aurora.dev"
const test_user_password = getTestUserPass()


setup("authenticate", async ({ page, context }) => {
  const supabaseClient = supabaseCreateClient(SUPABASE_URL, SUPABASE_KEY)

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: TEST_USER_EMAIL,
    password: test_user_password,
  })

  if (error ?? !data.session) {
    throw new Error(`Login failed: ${error?.message}`)
  }

  const { access_token, refresh_token } = data.session

  await page.goto(`${AURORA_CLOUD_CONSOLE_PAGE.baseURL}`)

  await page.evaluate(
    async ([supabaseUrl, supabaseAnonKey, accessToken, refreshToken]) => {
      const { createClient } = await import(
        // @ts-expect-error
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"
      )

      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
    },
    [SUPABASE_URL, SUPABASE_KEY, access_token, refresh_token],
  )

      // Add cookie
      const myCookie: Cookie = {
        name: `sb-${supabase_domain}-auth-token`,
        value: `base64-${access_token}`,
        domain: AURORA_CLOUD_CONSOLE_PAGE.domain,
        path: "/",
        expires: Date.now() / 1000 + 100000,
        httpOnly: false,
        secure: true,
        sameSite: "None",
      }
      await context.addCookies([myCookie])

  await page.context().storageState({ path: authFile })
})

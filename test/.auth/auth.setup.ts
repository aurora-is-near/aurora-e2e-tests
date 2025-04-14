import { chromium, test as setup } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient as supabaseCreateClient } from "@supabase/supabase-js"
import { AURORA_CLOUD_CONSOLE_PAGE } from "../helpers/constants/pages"
import { getSupabaseKey, getSupabaseURL } from "../helpers/functions/system-variables"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const authFile = path.join(__dirname, '../.auth/user.json')
const SUPABASE_URL = getSupabaseURL()
const SUPABASE_KEY = getSupabaseKey()

const TEST_USER_EMAIL = "maksim.vashchuk+e2e@aurora.dev"
const { TEST_USER_PASSWORD } = process.env

setup('authenticate', async ({ page, context }) => {
  const browser = await chromium.launch();
  // Perform authentication steps. Replace these actions with your own.
  const supabaseClient = supabaseCreateClient(SUPABASE_URL, SUPABASE_KEY)

  if (!TEST_USER_PASSWORD) {
    throw new Error("TEST_USER_PASSWORD is not set")
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  })

  console.log(`Test ${data} ${error}`)

  if (error ?? !data.session) {
    throw new Error(`Login failed: ${error?.message}`)
  }

  const { access_token, refresh_token } = data.session

  await page.goto(`${AURORA_CLOUD_CONSOLE_PAGE}`)

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

  await context.storageState({ path: authFile })

  // End of authentication steps.
})

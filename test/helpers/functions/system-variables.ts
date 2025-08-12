export const getPassword = () => {
  const password = process.env.MM_PASSWORD

  if (!password) {
    throw new Error("The MM_PASSWORD environment variable is required")
  }

  return password
}

export const getSeedPhrase = () => {
  const phrase = process.env.MM_SEED_PHRASE

  if (!phrase) {
    throw new Error("The MM_SEED_PHRASE environment variable is required")
  }

  return phrase
}

export const getNearAccountToken = () => {
  const token = process.env.NEAR_ACCOUNT_TOKEN

  if (!token) {
    throw new Error("The NEAR_ACCOUNT_TOKEN environment variable is required")
  }

  return token
}

export const getSupabaseURL = () => {
  const supabaseURL = process.env.SUPABASE_URL

  if (!supabaseURL) {
    throw new Error("The SUPABASE_URL environment variable is required")
  }

  return supabaseURL
}

export const getSupabaseKey = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!key) {
    throw new Error(
      "The SUPABASE_SERVICE_ROLE_KEY environment variable is required",
    )
  }

  return key
}

export const getTestUserPass = () => {
  const pass = process.env.TEST_PASSWORD

  if (!pass) {
    throw new Error("The TEST_PASSWORD environment variable is required")
  }

  return pass
}

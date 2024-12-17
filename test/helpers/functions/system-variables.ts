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

import { NEAR_WEB3_PAGE } from "../constants/pages"

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

/**
 * For development purposes. Helps to override environment for web3 wallet
 * 2 possible options: "mainnet" or "testnet"
 * @param environment - string
 * @returns {string} - web url for required environment
 */
export const nearEnvironment = (environment = "") => {
  let environmenUrl

  const getNearUrl = () => {
    return NEAR_WEB3_PAGE
  }

  if (environment !== "") {
    environmenUrl = getNearUrl()
  } else {
    const network = process.env.NEAR_NETWORK

    if (!network) {
      throw new Error("The NEAR_NETWORK environment variable is required")
    }

    environmenUrl = getNearUrl()
  }

  return environmenUrl
}

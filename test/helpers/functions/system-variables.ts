import { NEAR_WEB3_PAGE, NEAR_WEB3_PAGE_TESTNET } from "../constants/pages"

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

/**
 * For development purposes. Helps to override environment for web3 wallet
 * 2 possible options: "mainnet" or "testnet"
 * @param environment - string
 * @returns {string} - web url for required environment
 */
export const nearEnvironment = (environment = "") => {
  let environmenUrl

  const getNearUrl = (env: string) => {
    let pageUrl

    if (env === "mainnet") {
      pageUrl = NEAR_WEB3_PAGE
    } else if (env === "testnet") {
      pageUrl = NEAR_WEB3_PAGE_TESTNET
    } else {
      throw new Error(`${env} - is not valid environment name`)
    }

    return pageUrl
  }

  if (environment !== "") {
    environmenUrl = getNearUrl(environment)
  } else {
    const network = process.env.NEAR_NETWORK
    console.log("Network selected:", network)

    if (!network) {
      throw new Error("The NEAR_NETWORK environment variable is required")
    }

    environmenUrl = getNearUrl(network)
  }

  return environmenUrl
}

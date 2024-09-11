import { defineWalletSetup } from "@synthetixio/synpress"
import "dotenv/config"
import { getExtensionId, MetaMask } from "@synthetixio/synpress/playwright"
import { NEAR_WALLET_MAINNET } from "../helpers/constants/networks"

const seedPhrase = process.env.MM_SEED_PHRASE
const password = process.env.MM_PASSWORD

if (!seedPhrase) {
  throw new Error("The MM_SEED_PHRASE environment variable is required")
}

if (!password) {
  throw new Error("The MM_PASSWORD environment variable is required")
}

export default defineWalletSetup(password, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, "MetaMask")

  const metamask = new MetaMask(context, walletPage, password, extensionId)

  await metamask.importWallet(seedPhrase)

  await metamask.addNetwork(NEAR_WALLET_MAINNET)

  await metamask.switchNetwork(NEAR_WALLET_MAINNET.name)
})

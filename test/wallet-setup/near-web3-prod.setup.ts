import { defineWalletSetup } from "@synthetixio/synpress"
import "dotenv/config"
import { getExtensionId, MetaMask } from "@synthetixio/synpress/playwright"
import { setTimeout } from "timers/promises"
import { NEAR_WALLET_MAINNET } from "../helpers/constants/networks"
import {
  getNearAccountToken,
  getPassword,
  getSeedPhrase,
} from "../helpers/functions/system-variables"

const seedPhrase = getSeedPhrase()
const password = getPassword()
const token = getNearAccountToken()

export default defineWalletSetup(password, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, "MetaMask")

  const metamask = new MetaMask(context, walletPage, password, extensionId)

  await metamask.importWallet(seedPhrase)

  await metamask.importWalletFromPrivateKey(token)

  await setTimeout(30000)

  await metamask.switchAccount("Account 2")

  await metamask.addNetwork(NEAR_WALLET_MAINNET)
})

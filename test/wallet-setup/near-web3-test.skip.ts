/*
 * TODO: rename file to near-web3-test.setup.ts
 * instead of .skip.ts when testnet will be established
 * and check files:
 * swapping.spec.ts and near-web3.ts for additional comments
 */

import { defineWalletSetup } from "@synthetixio/synpress"
import "dotenv/config"
import { getExtensionId, MetaMask } from "@synthetixio/synpress/playwright"
import { NEAR_WALLET_TESTNET } from "../helpers/constants/networks"
import {
  getPassword,
  getSeedPhrase,
} from "../helpers/functions/system-variables"

const seedPhrase = getSeedPhrase()
const password = getPassword()

export default defineWalletSetup(password, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, "MetaMask")

  const metamask = new MetaMask(context, walletPage, password, extensionId)

  await metamask.importWallet(seedPhrase)

  await metamask.addNetwork(NEAR_WALLET_TESTNET)
})

import "dotenv/config"
import { defineWalletSetup } from "@synthetixio/synpress"
import { getExtensionId, MetaMask } from "@synthetixio/synpress/playwright"
import { CURRENCY_ETHEREUM } from "../../tests/helpers/constants/currencies"

const PASSWORD = process.env.MM_PASSWORD as string

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, "MetaMask")

  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId)

  await metamask.importWallet(process.env.MM_SEED_PHRASE as string)

  await metamask.addNetwork({
    symbol: CURRENCY_ETHEREUM,
    name: process.env.NETWORK_NAME as string,
    rpcUrl: process.env.NETWORK_URL as string,
    chainId: parseInt(process.env.CHAIN_ID as string, 10),
  })
})

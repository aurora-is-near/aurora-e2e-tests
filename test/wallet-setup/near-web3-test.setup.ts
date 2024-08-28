import { defineWalletSetup } from "@synthetixio/synpress"
import "dotenv/config"
import { CURRENCY_NEAR } from "../../tests/helpers/constants/currencies"
import { getExtensionId, MetaMask } from "@synthetixio/synpress/playwright"

const PASSWORD = process.env.MM_PASSWORD as string

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, "MetaMask")

  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId)

  await metamask.importWallet(process.env.MM_SEED_PHRASE as string)

  await metamask.addNetwork({
    symbol: CURRENCY_NEAR,
    name: process.env.TESTNET_NETWORK_NAME as string,
    rpcUrl: process.env.TESTNET_NETWORK_URL as string,
    chainId: parseInt(process.env.TESTNET_CHAIN_ID as string),
  })

  await metamask.switchNetwork("NEAR wallet playground")
})

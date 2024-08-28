import { defineWalletSetup } from "@synthetixio/synpress"
import "dotenv/config"
import { getExtensionId, MetaMask } from "@synthetixio/synpress/playwright"
import { CURRENCY_NEAR } from "../../tests/helpers/constants/currencies"

const PASSWORD = process.env.MM_PASSWORD as string

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, "MetaMask")

  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId)

  await metamask.importWallet(process.env.MM_SEED_PHRASE as string)

  await metamask.addNetwork({
    symbol: CURRENCY_NEAR,
    name: process.env.MAINNET_NETWORK_NAME as string,
    rpcUrl: process.env.MAINNET_NETWORK_URL as string,
    chainId: parseInt(process.env.MAINNET_CHAIN_ID as string, 10),
    blockExplorerUrl: process.env.MAINNET_BLOCK_EXPLORER_URL as string,
  })

  await metamask.switchNetwork("NEAR Protocol")
})

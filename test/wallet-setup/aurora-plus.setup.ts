import { MetaMask, defineWalletSetup, getExtensionId } from '@synthetixio/synpress';
import 'dotenv/config';
import { CURRENCY_ETHEREUM } from '../../tests/helpers/constants/currencies';

const PASSWORD = process.env.MM_PASSWORD as string;

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, 'MetaMask')
  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId);

  await metamask.importWallet(process.env.MM_SEED_PHRASE as string);

  await metamask.addNetwork({
    symbol: CURRENCY_ETHEREUM,
    name: process.env.AURORA_MAINNET_NETWORK_NAME as string,
    rpcUrl: process.env.AURORA_MAINNET_NETWORK_URL as string,
    chainId: parseInt(process.env.AURORA_MAINNET_CHAIN_ID as string)
  })
})

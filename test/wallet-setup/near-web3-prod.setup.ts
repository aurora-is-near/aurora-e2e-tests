import { MetaMask, defineWalletSetup, getExtensionId } from '@synthetixio/synpress';
import 'dotenv/config';

const PASSWORD = process.env.MM_PASSWORD as string;

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
    const extensionId = await getExtensionId(context, 'MetaMask')
    const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId);

    await metamask.importWallet(process.env.MM_SEED_PHRASE as string);

    await metamask.addNetwork({
        symbol: process.env.MAINNET_CURRENCY as string,
        name: process.env.MAINNET_NETWORK_NAME as string,
        rpcUrl: process.env.MAINNET_NETWORK_URL as string,
        chainId: parseInt(process.env.MAINNET_CHAIN_ID as string),
        blockExplorerUrl: process.env.MAINNET_BLOCK_EXPLORER_URL as string
    })

    await metamask.switchNetwork('NEAR Protocol')
})

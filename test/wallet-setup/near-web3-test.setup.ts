import { MetaMask, defineWalletSetup, getExtensionId } from '@synthetixio/synpress';
import 'dotenv/config';

const PASSWORD = process.env.MM_PASSWORD as string;

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
    const extensionId = await getExtensionId(context, 'MetaMask')
    const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId);

    await metamask.importWallet(process.env.MM_SEED_PHRASE as string);

    await metamask.addNetwork({
        symbol: process.env.TESTNET_CURRENCY as string,
        name: process.env.TESTNET_NETWORK_NAME as string,
        rpcUrl: process.env.TESTNET_NETWORK_URL as string,
        chainId: parseInt(process.env.TESTNET_CHAIN_ID as string)
    })

    await metamask.switchNetwork('NEAR wallet playground')

})


import { MetaMask, metaMaskFixtures, testWithSynpress } from '@synthetixio/synpress';
import auroraSetup from '../../../test/wallet-setup/aurora-plus.setup';
import { expect } from '@playwright/test';
import { shortTimeout } from '../../helpers/constants/timeouts';

export const test = testWithSynpress(metaMaskFixtures(auroraSetup)).extend<{
    auroraPlusPreconditions: {
        loginToAuroraPlus: () => Promise<void>
    }
}>({
    auroraPlusPreconditions: async ({ page, context, extensionId }, use) => {

        const metamask = new MetaMask(context, page, auroraSetup.walletPassword, extensionId)
        const launchAppButton = page.getByRole('link', { name: 'Launch app' })
        const connectWalletButton = page.getByRole('button', { name: 'Connect wallet' })
        const modalConnectWalletButton = page.getByLabel('Connect and authenticate').getByRole('button', { name: 'Connect wallet' })
        const skipIHaveWalletButton = page.getByRole('button', { name: 'Skip, I have a wallet' })
        const modalMetamaskButton = page.locator('wui-list-wallet', { hasText: 'MetaMask' })
        const acceptAndSignButton = page.getByRole('button', { name: 'Accept and sign' })

        const loginSteps = async () => {
            await expect(launchAppButton, '"Launch app" button is not visible').toBeVisible(shortTimeout)
            await launchAppButton.click();

            await expect(connectWalletButton, '"Connect wallet" button is not visible').toBeVisible(shortTimeout)
            await connectWalletButton.click();

            await expect(modalConnectWalletButton, '"Connect wallet" button in modal not visible').toBeVisible(shortTimeout)
            await modalConnectWalletButton.click();

            let retries = 100;
            let isElementVisible = false;

            while (!isElementVisible && retries > 0) {
                isElementVisible = await skipIHaveWalletButton.isVisible()
                retries--;
                await page.waitForTimeout(100)
            }

            if (await skipIHaveWalletButton.isVisible()) {
                await skipIHaveWalletButton.click();
            }

            await expect(modalMetamaskButton, '"MetaMask" wallet button not visible in modal').toBeVisible(shortTimeout)
            await modalMetamaskButton.click();

            await metamask.connectToDapp();

            await expect(acceptAndSignButton, '"Accept and sign" button not visible').toBeVisible(shortTimeout)
            await acceptAndSignButton.click();

            await page.waitForTimeout(10000)
            await metamask.confirmSignature();

            await expect(page, 'Incorrect page is loaded').toHaveURL('https://aurora.plus/dashboard')
        }

        await use({
            loginToAuroraPlus: async () => {
                await loginSteps()
            },
        })
    }
})

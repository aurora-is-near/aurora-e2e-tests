import { testWithSynpress } from "@synthetixio/synpress"
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright"
import auroraSetup from "../../wallet-setup/aurora-plus.setup"

export const test = testWithSynpress(metaMaskFixtures(auroraSetup)).extend<{
  auroraPlusPreconditions: {
  }
}>({
  auroraPlusPreconditions: async ({ page, context, extensionId }, use) => {
    const metamask = new MetaMask(
      context,
      page,
      auroraSetup.walletPassword,
      extensionId,
    )

    await use({
    })
  },
})

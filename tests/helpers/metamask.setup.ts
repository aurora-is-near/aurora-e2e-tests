import { test as setup } from "@playwright/test"
import { prepareMetaMaskExtension } from "../../lib/metamask/prepare-metamask-extension"

setup("prepare MetaMask extension", async () => {
  await prepareMetaMaskExtension()
})

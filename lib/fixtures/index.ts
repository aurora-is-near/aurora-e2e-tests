import { mergeTests } from "playwright/test"
import { metamaskTest } from "./metamask"
import { extensionsTest } from "./extensions"
import { auroraPlusTest } from "../../tests/page_aurora-plus/fixtures/aurora-plus"
import { web3walletTest } from "../../tests/near-web3-wallet/fixtures/web3-wallet"

export const test = mergeTests(
  metamaskTest,
  extensionsTest,
  auroraPlusTest,
  web3walletTest,
)

export const { expect } = test

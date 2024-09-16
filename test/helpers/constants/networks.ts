import { CURRENCY_ETHEREUM, CURRENCY_NEAR } from "./currencies"

export const AURORA_PLUS_MAINNET = {
  symbol: CURRENCY_ETHEREUM,
  name: "Aurora",
  rpcUrl: "https://mainnet.aurora.dev",
  chainId: 1313161554,
}

export const NEAR_WALLET_MAINNET = {
  symbol: CURRENCY_NEAR,
  name: "NEAR Protocol",
  rpcUrl: "https://eth-rpc.mainnet.near.org",
  chainId: 397,
  blockExplorerUrl: "https://eth-explorer.near.org",
}

export const NEAR_WALLET_TESTNET = {
  symbol: CURRENCY_NEAR,
  name: "NEAR Protocol Testnet",
  rpcUrl: "https://eth-rpc.testnet.near.org",
  chainId: 398,
  blockExplorerUrl: "https://eth-explorer-testnet.near.org",
}

// import { CURRENCY_ETHEREUM, CURRENCY_NEAR } from "./currencies"
import { Currencies } from "./currencies"

export const AURORA_PLUS_MAINNET = {
  symbol: Currencies.ETHEREUM as string,
  name: "Aurora",
  rpcUrl: "https://mainnet.aurora.dev",
  chainId: 1313161554,
}

export const NEAR_WALLET_MAINNET = {
  symbol: Currencies.NEAR as string,
  name: "NEAR Protocol",
  rpcUrl: "https://eth-rpc.mainnet.near.org",
  chainId: 397,
  blockExplorerUrl: "https://eth-explorer.near.org",
}

export const NEAR_WALLET_TESTNET = {
  symbol: Currencies.NEAR as string,
  name: "NEAR Protocol Testnet",
  rpcUrl: "https://eth-rpc.testnet.near.org",
  chainId: 398,
  blockExplorerUrl: "https://eth-explorer-testnet.near.org",
}

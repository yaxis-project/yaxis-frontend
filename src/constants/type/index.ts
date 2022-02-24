import * as Avalanche from './avalanche'
import * as Ethereum from './ethereum'

export type TRewardsContracts =
	| Avalanche.TRewardsContracts
	| Ethereum.TRewardsContracts

export type TLiquidityPools =
	| Avalanche.TLiquidityPools
	| Ethereum.TLiquidityPools

export type Ticker = Avalanche.Ticker | Ethereum.Ticker

export type TVaults = Avalanche.TVaults | Ethereum.TVaults
export type Vaults = typeof Avalanche.Vaults | typeof Ethereum.Vaults

export type LiquidityPool = Avalanche.LiquidityPool | Ethereum.LiquidityPool

export { Avalanche, Ethereum }

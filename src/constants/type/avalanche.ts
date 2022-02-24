/**
 * Avalanche
 */

export const RewardsContracts = <const>[
	// 'MetaVault',
	// 'Yaxis',
	'TraderJoe JOE/AVAX',
]
export type TRewardsContracts = typeof RewardsContracts[number]

export const TraderJoeLiquidityPools = <const>['TraderJoe JOE/AVAX']
export type TTraderJoeLiquidityPools = typeof TraderJoeLiquidityPools[number]
export const LiquidityPools = <const>[...TraderJoeLiquidityPools]
export type TLiquidityPools = typeof LiquidityPools[number]
export type LiquidityPoolsTypes = 'traderjoe'
export type lpToken = {
	tokenId: Ticker
	weight?: number
}
export interface LiquidityPool {
	pid?: number
	active: boolean
	type: LiquidityPoolsTypes
	liquidId: string
	lpAddress: string
	lpTokens: lpToken[]
	tokenAddress: string
	name: TLiquidityPools
	symbol: string
	tokenSymbol: string
	icon: string
	lpUrl: string
	legacy?: boolean
	rewards?: TRewardsContracts
}

export const CurrenciesERC20 = <const>[
	'crv',
	// 'wbtc',
	// 'link',
	// 'mim',
	// 'cvx',
	// 'yax',
	// 'usdc',
	// 'dai',
	// 'usdt',
	// '3crv',
	// 'weth',
	// 'mvlt',
	// 'spell',
	// 'frax',
	'wavax',
	'joe',
]
export type TCurrenciesERC20 = typeof CurrenciesERC20[number]

export const CurrenciesERC677 = <const>['yaxis']
export type TCurrenciesERC677 = typeof CurrenciesERC677[number]

export const additionalCurrencies = <const>['avax', 'btc']
export type TAdditionalCurrencies = typeof additionalCurrencies[number]

export const crvLPCurrencies = <const>['av3crv', 'atricrypto']
export type TCrvLPCurrencies = typeof crvLPCurrencies[number]

export type Ticker =
	| TCurrenciesERC20
	| TCurrenciesERC677
	| TCrvLPCurrencies
	| TAdditionalCurrencies

export const InternalContracts = <const>[
	'vaultHelper',
	'minter',
	'minterWrapper',
	// 'swap',
	// 'yaxisChef',
	// 'xYaxStaking',
	// 'yAxisMetaVault',
	'stableSwap3PoolConverter',
	// 'merkleDistributor',
	'votingEscrow',
	'gaugeController',
	'controller',
	'manager',
	'feeDistributor',
]
export type TInternalContracts = typeof InternalContracts[number]

export const CurveLPContracts = <const>['av3crv', 'atricrypto']
export type TCurveLPContracts = typeof CurveLPContracts[number]
export const AaveLPContracts = <const>['avax']
export type TAaveLPContracts = typeof AaveLPContracts[number]

export interface ExternalLP {
	pool: string
	gauge: string
	token: string
	convexRewards: string
	extraRewards?: {
		[token: string]: {
			contract: string
			token: string
		}
	}
	currency: string
}

export const ExternalLPContracts = <const>[
	...CurveLPContracts,
	// ...AaveLPContracts,
]
export type TExternalLPContracts = typeof ExternalLPContracts[number]

export const ExternalContracts = <const>[
	'multicall',
	// 'pickleChef',
	// 'pickleJar',s
	// 'uniswapRouter',
	'gaugeController',
]
export type TExternalContracts = typeof ExternalContracts[number]

/*
[symbol , vault name]
*/
export const LPVaults: [string, string][] = [
	['av3crv', 'usd'],
	['atricrypto', 'tricrypto'],
	// ['avax', 'avax'],
]

export const Vaults = <const>[
	'usd',
	'tricrypto',
	//  'avax'
]
export type TVaults = typeof Vaults[number]
export interface Vault {
	url: string
	token: string
	tokenContract: string
	tokenPoolContract: string
	vault: string
	vaultToken: string
	vaultTokenContract: string
	gauge: string
}

export type AvalancheInternalConfig = {
	[key in TInternalContracts]: string
}

export type AvalancheExternalConfig = {
	[key in TExternalContracts]: string
}

export type AvalancheExternalPoolsConfig = {
	curve: {
		[key in TCurveLPContracts]: ExternalLP
	}
	// aave: {
	// 	[key in TAaveLPContracts]: ExternalLP
	// }
}

export type AvalancheCurrenciesConfig = {
	ERC20: {
		[key in TCurrenciesERC20]: string
	}
	ERC677: {
		[key in TCurrenciesERC677]: string
	}
}

export type AvalancheRewardsConfig = {
	[key in TRewardsContracts]: string
}

export type AvalanchePoolsConfig = {
	[key in TLiquidityPools]: LiquidityPool
}

export type AvalancheVaultsConfig = {
	[key in TVaults]: Vault
}

export interface AvalancheConfig {
	internal: AvalancheInternalConfig
	external: AvalancheExternalConfig
	externalPools: AvalancheExternalPoolsConfig
	currencies: AvalancheCurrenciesConfig
	rewards: AvalancheRewardsConfig
	pools: AvalanchePoolsConfig
	vaults: AvalancheVaultsConfig
}

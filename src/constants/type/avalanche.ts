/**
 * Avalanche
 */

export const RewardsContracts = <const>['TraderJoe YAXIS/WAVAX']
export type TRewardsContracts = typeof RewardsContracts[number]

export const TraderJoeLiquidityPools = <const>['TraderJoe YAXIS/WAVAX']
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
	'wbtc',
	'usdc',
	'dai',
	'usdt',
	'weth',
	'wavax',
	'joe',
]
export type TCurrenciesERC20 = typeof CurrenciesERC20[number]

export const CurrenciesERC677 = <const>['yaxis']
export type TCurrenciesERC677 = typeof CurrenciesERC677[number]

export const additionalCurrencies = <const>['avax', 'btc']
export type TAdditionalCurrencies = typeof additionalCurrencies[number]

export const curveLPCurrencies = <const>['av3crv', 'atricrypto']
export type TCurveLPCurrencies = typeof curveLPCurrencies[number]

export const aaveLPCurrencies = <const>['avwavax']
export type TAaveLPCurrencies = typeof aaveLPCurrencies[number]

export const traderjoeLPCurrencies = <const>['joewavax']
export type TTraderJoeLPCurrencies = typeof traderjoeLPCurrencies[number]

export type Ticker =
	| TCurrenciesERC20
	| TCurrenciesERC677
	| TCurveLPCurrencies
	| TAaveLPCurrencies
	| TTraderJoeLPCurrencies
	| TAdditionalCurrencies

export const InternalContracts = <const>[
	'vaultHelper',
	'minter',
	'minterWrapper',
	'votingEscrow',
	'gaugeController',
	'controller',
	'manager',
	'feeDistributor',
]
export type TInternalContracts = typeof InternalContracts[number]

export const CurveLPContracts = <const>['av3crv', 'atricrypto', 'aawbtcrencrv']
export type TCurveLPContracts = typeof CurveLPContracts[number]
export const AaveLPContracts = <const>['avax']
export type TAaveLPContracts = typeof AaveLPContracts[number]
export const TraderJoeLPContracts = <const>['joewavax']
export type TTraderJoeLPContracts = typeof TraderJoeLPContracts[number]

export interface ExternalLP {
	pool: string
	gauge: string
	token: string
	rewards: string
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
	...AaveLPContracts,
	...TraderJoeLPContracts,
]
export type TExternalLPContracts = typeof ExternalLPContracts[number]

export const ExternalContracts = <const>[
	'multicall',
	'joeRouter',
	'joeMasterChef',
	'aaveRewards',
]

export type TExternalContracts = typeof ExternalContracts[number]

export const Vaults = <const>['av3crv', 'atricrypto', 'avax', 'joewavax']
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
	payable?: string
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
	aave: {
		[key in TAaveLPContracts]: ExternalLP
	}
	traderjoe: {
		[key in TTraderJoeLPContracts]: ExternalLP
	}
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

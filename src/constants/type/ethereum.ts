/**
 * Ethereum
 */

export const RewardsContracts = <const>[
	'MetaVault',
	'Yaxis',
	'Uniswap YAXIS/ETH',
]
export type TRewardsContracts = typeof RewardsContracts[number]

export const UniswapLiquidityPools = <const>[
	'Uniswap YAXIS/ETH',
	'Uniswap YAX/ETH',
]
export type TUniswapLiquidityPools = typeof UniswapLiquidityPools[number]
export const LinkswapLiquidityPools = <const>['Linkswap YAX/ETH']
export type TLinkswapLiquidityPools = typeof LinkswapLiquidityPools[number]
export const LiquidityPools = <const>[
	...UniswapLiquidityPools,
	...LinkswapLiquidityPools,
]
export type TLiquidityPools = typeof LiquidityPools[number]
export type LiquidityPoolsTypes = 'linkswap' | 'uniswap'
export interface lpToken {
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
	'link',
	'mim',
	'cvx',
	'yax',
	'usdc',
	'dai',
	'usdt',
	'3crv',
	'weth',
	'mvlt',
	'spell',
	'frax',
]
export type TCurrenciesERC20 = typeof CurrenciesERC20[number]

export const CurrenciesERC677 = <const>['yaxis']
export type TCurrenciesERC677 = typeof CurrenciesERC677[number]

export const additionalCurrencies = <const>['eth', 'btc', 'aleth']
export type TAdditionalCurrencies = typeof additionalCurrencies[number]

export const crvLPCurrencies = <const>[
	'mim3crv',
	'rencrv',
	'alethcrv',
	'linkcrv',
	'crvcvxeth',
	'crv3crypto',
	'frax3crv',
]
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
	'swap',
	'yaxisChef',
	'xYaxStaking',
	'yAxisMetaVault',
	'stableSwap3PoolConverter',
	'merkleDistributor',
	'votingEscrow',
	'gaugeController',
	'controller',
	'manager',
	'feeDistributor',
]
export type TInternalContracts = typeof InternalContracts[number]

export const CurveLPContracts = <const>[
	'mim3crv',
	'rencrv',
	'alethcrv',
	'linkcrv',
	'3pool',
	'crvcvxeth',
	'crv3crypto',
	'frax3crv',
]
export type TCurveLPContracts = typeof CurveLPContracts[number]

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

export const ExternalLPContracts = <const>[...CurveLPContracts]
export type TExternalLPContracts = typeof ExternalLPContracts[number]

export const ExternalContracts = <const>[
	'multicall',
	'pickleChef',
	'pickleJar',
	'uniswapRouter',
	'gaugeController',
]
export type TExternalContracts = typeof ExternalContracts[number]

export const Vaults = <const>[
	'usd',
	'btc',
	'eth',
	'link',
	'yaxis',
	'cvx',
	'tricrypto',
	'frax',
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

export type EthereumInternalConfig = {
	[key in TInternalContracts]: string
}

export type EthereumExternalConfig = {
	[key in TExternalContracts]: string
}

export type EthereumExternalPoolsConfig = {
	curve: {
		[key in TCurveLPContracts]: ExternalLP
	}
}

export type EthereumCurrenciesConfig = {
	ERC20: {
		[key in TCurrenciesERC20]: string
	}
	ERC677: {
		[key in TCurrenciesERC677]: string
	}
}

export type EthereumRewardsConfig = {
	[key in TRewardsContracts]: string
}

export type EthereumPoolsConfig = {
	[key in TLiquidityPools]: LiquidityPool
}

export type EthereumVaultsConfig = {
	[key in TVaults]: Vault
}

export interface EthereumConfig {
	internal: EthereumInternalConfig
	external: EthereumExternalConfig
	externalPools: EthereumExternalPoolsConfig
	currencies: EthereumCurrenciesConfig
	rewards: EthereumRewardsConfig
	pools: EthereumPoolsConfig
	vaults: EthereumVaultsConfig
}

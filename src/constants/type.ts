import { Contract } from '@ethersproject/contracts'

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
	lpContract?: Contract
	tokenContract?: Contract
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
	'yax',
	'usdc',
	'dai',
	'usdt',
	'3crv',
	'weth',
	'mvlt',
]
export type TCurrenciesERC20 = typeof CurrenciesERC20[number]

export const CurrenciesERC677 = <const>['yaxis']
export type TCurrenciesERC677 = typeof CurrenciesERC677[number]

export const additionalCurrencies = <const>['eth', 'btc', 'crv']
export type TAdditionalCurrencies = typeof additionalCurrencies[number]

export type Ticker =
	| TCurrenciesERC20
	| TCurrenciesERC677
	| TAdditionalCurrencies

export const InternalContracts = <const>[
	'swap',
	'yaxisChef',
	'xYaxStaking',
	'yAxisMetaVault',
	'stableSwap3PoolConverter',
	'merkleDistributor',
	'votingEscrow',
]
export type TInternalContracts = typeof InternalContracts[number]

export const ExternalContracts = <const>[
	'multicall',
	'pickleChef',
	'pickleJar',
	'uniswapRouter',
	'curve3pool',
]
export type TExternalContracts = typeof ExternalContracts[number]

export const Vaults = <const>[
	'stables',
]
export type TVaults = typeof Vaults[number]
export interface Vault {
	vault: string
	gauge: string
}

export interface Config {
	internal: {
		[key in TInternalContracts]: string
	}
	external: {
		[key in TExternalContracts]: string
	}
	currencies: {
		ERC20: {
			[key in TCurrenciesERC20]: string
		}
		ERC677: {
			[key in TCurrenciesERC677]: string
		}
	}
	rewards: {
		[key in TRewardsContracts]: string
	}
	pools: {
		[key in TLiquidityPools]: LiquidityPool
	}
	vaults: {
		[key in TVaults]: Vault
	}
}

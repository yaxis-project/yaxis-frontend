import ethereumLogoUrl from '../assets/img/currencies/eth.svg'
import avalancheLogo from '../assets/img/currencies/avax.svg'

/**
 * List of all of the supported blockchains
 */
export enum ChainId {
	ETHEREUM_MAINNET = 1,
	ETHEREUM_KOVAN = 42,

	AVALANCHE_FUJI = 43113,
	AVALANCHE_MAINNET = 43114,
}

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
const RPC_URL_1 = process.env.REACT_APP_RPC_URL_1
const RPC_URL_42 = process.env.REACT_APP_RPC_URL_42
if (
	(typeof RPC_URL_1 === 'undefined' || typeof RPC_URL_42 === 'undefined') &&
	typeof INFURA_KEY === 'undefined'
) {
	throw new Error(
		`Either both RPC_URL_1 and RPC_URL_42 must be set environment variables, or REACT_APP_INFURA_KEY must be set`,
	)
}

/**
 * Array of all the supported chain IDs
 * Only mainnet is publicly switch-able
 */
export const ALL_SUPPORTED_CHAIN_IDS: ChainId[] = Object.entries(ChainId)
	.filter(
		([name, id]) =>
			typeof id === 'number' && name.split('_')?.[1] === 'MAINNET',
	)
	.map(([, id]) => id) as ChainId[]

export type L1_CHAIN = 'avalanche' | 'ethereum'
export const L1_CHAIN_IDS = [
	ChainId.ETHEREUM_MAINNET,
	ChainId.ETHEREUM_KOVAN,
	ChainId.AVALANCHE_MAINNET,
	ChainId.AVALANCHE_FUJI,
] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
// export type L2_CHAIN = ''
export const L2_CHAIN_IDS = [] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number]

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
export const NETWORK_URLS: { [key in ChainId]: string } = {
	[ChainId.ETHEREUM_MAINNET]:
		RPC_URL_1 || `https://mainnet.infura.io/v3/${INFURA_KEY}`,
	[ChainId.ETHEREUM_KOVAN]:
		RPC_URL_42 || `https://kovan.infura.io/v3/${INFURA_KEY}`,
	[ChainId.AVALANCHE_MAINNET]: 'https://api.avax.network/ext/bc/C/rpc',
	[ChainId.AVALANCHE_FUJI]: 'https://api.avax-test.network/ext/bc/C/rpc',
}

/**
 * This is used to call the add network RPC
 */
interface AddNetworkInfo {
	readonly rpcUrl: string
	readonly nativeCurrency: {
		name: string // e.g. 'Goerli ETH',
		symbol: string // e.g. 'gorETH',
		decimals: number // e.g. 18,
	}
}

export enum NetworkType {
	L1,
	L2,
}

export interface BaseChainInfo {
	readonly chainId: ChainId
	readonly blockchain: L1_CHAIN
	// | L2_CHAIN
	readonly networkType: NetworkType
	readonly blockWaitMsBeforeWarning?: number
	readonly docs: string
	readonly bridge?: string
	readonly explorer: string
	readonly yaxisUrl: string
	readonly infoLink: string
	readonly logoUrl: string
	readonly label: string
	readonly helpCenterUrl?: string
	readonly addNetworkInfo: AddNetworkInfo
	readonly blocktime: number
}

export interface L1ChainInfo extends BaseChainInfo {
	readonly networkType: NetworkType.L1
}

export interface L2ChainInfo extends BaseChainInfo {
	readonly networkType: NetworkType.L2
	readonly bridge: string
	readonly statusPage?: string
	readonly defaultListUrl: string
}

export type ChainInfoMap = {
	readonly [chainId: number]: L1ChainInfo | L2ChainInfo
} & {
	readonly [chainId in SupportedL2ChainId]: L2ChainInfo
} & { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }

export const CHAIN_INFO: ChainInfoMap = {
	[ChainId.ETHEREUM_MAINNET]: {
		chainId: ChainId.ETHEREUM_MAINNET,
		blockchain: 'ethereum',
		networkType: NetworkType.L1,
		blocktime: 15_000,
		docs: '',
		explorer: 'https://etherscan.io',
		infoLink: '',
		label: 'Ethereum',
		logoUrl: ethereumLogoUrl,
		addNetworkInfo: {
			nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
			rpcUrl: NETWORK_URLS[ChainId.ETHEREUM_MAINNET],
		},
		yaxisUrl:
			'https://app.uniswap.org/#/swap?outputCurrency=0x0adA190c81b814548ddC2F6AdC4a689ce7C1FE73',
	},
	[ChainId.ETHEREUM_KOVAN]: {
		chainId: ChainId.ETHEREUM_KOVAN,
		blockchain: 'ethereum',
		networkType: NetworkType.L1,
		blocktime: 15_000,
		docs: '',
		explorer: 'https://kovan.etherscan.io',
		infoLink: '',
		label: 'Kovan',
		logoUrl: ethereumLogoUrl,
		addNetworkInfo: {
			nativeCurrency: {
				name: 'Kovan Ether',
				symbol: 'kETH',
				decimals: 18,
			},
			rpcUrl: NETWORK_URLS[ChainId.ETHEREUM_KOVAN],
		},
		yaxisUrl: '',
	},
	[ChainId.AVALANCHE_MAINNET]: {
		chainId: ChainId.AVALANCHE_MAINNET,
		blockchain: 'avalanche',
		networkType: NetworkType.L1,
		blocktime: 1_000,
		docs: '',
		explorer: 'https://snowtrace.io',
		infoLink: '',
		label: 'Avalanche',
		logoUrl: avalancheLogo,
		addNetworkInfo: {
			nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
			rpcUrl: NETWORK_URLS[ChainId.AVALANCHE_MAINNET],
		},
		yaxisUrl:
			'https://traderjoexyz.com/trade?inputCurrency=0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7&outputCurrency=0x91A1700835230B8b3B06B5B3DD1Fe70D48ACbd91#/',
	},
	[ChainId.AVALANCHE_FUJI]: {
		chainId: ChainId.AVALANCHE_FUJI,
		blockchain: 'avalanche',
		networkType: NetworkType.L1,
		blocktime: 1_000,
		docs: '',
		explorer: 'https://testnet.snowtrace.io',
		infoLink: '',
		label: 'Fuji',
		logoUrl: avalancheLogo,
		addNetworkInfo: {
			nativeCurrency: {
				name: 'Fuji Avalanche',
				symbol: 'kAVAX',
				decimals: 18,
			},
			rpcUrl: NETWORK_URLS[ChainId.AVALANCHE_FUJI],
		},
		yaxisUrl: '',
	},
}

import ethereumLogoUrl from '../assets/img/currencies/eth.svg'
import avalancheLogo from '../assets/img/currencies/avax.svg'

/**
 * List of all of the supported blockchains
 */
export enum SupportedChainId {
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
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(
	SupportedChainId,
).filter((id) => typeof id === 'number') as SupportedChainId[]

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
	SupportedChainId.ETHEREUM_MAINNET,
	SupportedChainId.ETHEREUM_KOVAN,
	SupportedChainId.AVALANCHE_MAINNET,
	SupportedChainId.AVALANCHE_FUJI,
] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number]

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
export const INFURA_NETWORK_URLS: { [key in SupportedChainId]: string } = {
	[SupportedChainId.ETHEREUM_MAINNET]:
		RPC_URL_1 || `https://mainnet.infura.io/v3/${INFURA_KEY}`,
	[SupportedChainId.ETHEREUM_KOVAN]:
		RPC_URL_42 || `https://kovan.infura.io/v3/${INFURA_KEY}`,
	[SupportedChainId.AVALANCHE_MAINNET]:
		'https://api.avax.network/ext/bc/C/rpc',
	[SupportedChainId.AVALANCHE_FUJI]:
		'https://api.avax-test.network/ext/bc/C/rpc',
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

interface BaseChainInfo {
	readonly networkType: NetworkType
	readonly blockWaitMsBeforeWarning?: number
	readonly docs: string
	readonly bridge?: string
	readonly explorer: string
	readonly infoLink: string
	readonly logoUrl: string
	readonly label: string
	readonly helpCenterUrl?: string
	readonly addNetworkInfo: AddNetworkInfo
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
	[SupportedChainId.ETHEREUM_MAINNET]: {
		networkType: NetworkType.L1,
		docs: '',
		explorer: 'https://etherscan.io/',
		infoLink: '',
		label: 'Ethereum',
		logoUrl: ethereumLogoUrl,
		addNetworkInfo: {
			nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
			rpcUrl: INFURA_NETWORK_URLS[SupportedChainId.ETHEREUM_MAINNET],
		},
	},
	[SupportedChainId.ETHEREUM_KOVAN]: {
		networkType: NetworkType.L1,
		docs: '',
		explorer: 'https://kovan.etherscan.io/',
		infoLink: '',
		label: 'Kovan',
		logoUrl: ethereumLogoUrl,
		addNetworkInfo: {
			nativeCurrency: {
				name: 'Kovan Ether',
				symbol: 'kETH',
				decimals: 18,
			},
			rpcUrl: INFURA_NETWORK_URLS[SupportedChainId.ETHEREUM_KOVAN],
		},
	},
	[SupportedChainId.AVALANCHE_MAINNET]: {
		networkType: NetworkType.L1,
		docs: '',
		explorer: 'https://explorer.avax.network/',
		infoLink: '',
		label: 'Avalanche',
		logoUrl: avalancheLogo,
		addNetworkInfo: {
			nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
			rpcUrl: INFURA_NETWORK_URLS[SupportedChainId.AVALANCHE_MAINNET],
		},
	},
	[SupportedChainId.AVALANCHE_FUJI]: {
		networkType: NetworkType.L1,
		docs: '',
		explorer: 'https://explorer.avax-test.network/',
		infoLink: '',
		label: 'Fuji',
		logoUrl: avalancheLogo,
		addNetworkInfo: {
			nativeCurrency: {
				name: 'Fuji Avalanche',
				symbol: 'kAVAX',
				decimals: 18,
			},
			rpcUrl: INFURA_NETWORK_URLS[SupportedChainId.AVALANCHE_FUJI],
		},
	},
}

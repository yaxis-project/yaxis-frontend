import { Web3Provider } from '@ethersproject/providers'
import { NetworkConnector } from '@web3-react/network-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
import { TrezorConnector } from '@web3-react/trezor-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { MagicConnector } from '@web3-react/magic-connector'
import { LatticeConnector } from '@web3-react/lattice-connector'
import { FrameConnector } from '@web3-react/frame-connector'
import { AuthereumConnector } from '@web3-react/authereum-connector'
import { ChainId, NETWORK_URLS, CHAIN_INFO } from '../constants/chains'

const DEFAULT_POLL_INTERVAL = 15_000
export function getLibrary(provider: any) {
	const library = new Web3Provider(
		provider,
		typeof provider.chainId === 'number'
			? provider.chainId
			: typeof provider.chainId === 'string'
			? parseInt(provider.chainId)
			: 'any',
	)
	library.pollingInterval = DEFAULT_POLL_INTERVAL
	library.detectNetwork().then((network) => {
		const networkPollingInterval = CHAIN_INFO[network.chainId]?.blocktime
		if (networkPollingInterval) {
			console.debug('Setting polling interval', networkPollingInterval)
			library.pollingInterval = networkPollingInterval
		}
	})
	return library
}

export const SUPPORTED_NETWORKS = [1, 42, 43114]

export const NETWORK_NAMES = { 1: 'mainnet', 42: 'kovan' }
export const FRIENDLY_NETWORK_NAMES = {
	1: 'Ethereum Mainnet',
	42: 'Kovan Test Network',
	43114: 'Avalanche Mainnet',
}

export const networkConnectorFactory = (chainId: ChainId) =>
	new NetworkConnector({
		urls: NETWORK_URLS,
		defaultChainId: chainId,
	})

export const network = new NetworkConnector({
	urls: NETWORK_URLS,
	defaultChainId: 1,
})

export const injected = new InjectedConnector({
	supportedChainIds: SUPPORTED_NETWORKS,
})

export const walletconnect = new WalletConnectConnector({
	rpc: { 1: NETWORK_URLS[1], 42: NETWORK_URLS[42] }, // Wallet Connect only supports network 1
	bridge: 'https://bridge.walletconnect.org',
	qrcode: true,
})

export const walletlink = new WalletLinkConnector({
	url: NETWORK_URLS[1], // Wallet Link only supports network 1
	appName: 'yAxis',
	appLogoUrl: '%PUBLIC_URL%/favicon.png',
})

export const fortmatic = new FortmaticConnector({
	apiKey: process.env.REACT_APP_FORTMATIC_KEY as string,
	chainId: 1, // Fortmatic only supports network 1
})

export const ledger = new LedgerConnector({
	chainId: 1,
	url: NETWORK_URLS[1],
	pollingInterval: DEFAULT_POLL_INTERVAL,
})

export const trezor = new TrezorConnector({
	chainId: 1,
	url: NETWORK_URLS[1],
	pollingInterval: DEFAULT_POLL_INTERVAL,
	manifestEmail: 'hello@yaxis.io',
	manifestAppUrl: 'https://app.yaxis.io/',
})

export const portis = new PortisConnector({
	dAppId: process.env.REACT_APP_PORTIS_ID as string,
	networks: [1, 42],
})

export const lattice = new LatticeConnector({
	chainId: 4,
	appName: 'web3-react',
	url: NETWORK_URLS[4],
})

export const frame = new FrameConnector({ supportedChainIds: [1] })

export const authereum = new AuthereumConnector({ chainId: 1 })

export const magic = new MagicConnector({
	apiKey: process.env.REACT_APP_MAGIC_KEY as string,
	chainId: 4,
	email: 'hello@example.org',
})

export const torus = new TorusConnector({ chainId: 1 })

export interface WalletInfo {
	primary?: true
	connector?: AbstractConnector
	name: string
	description: string
	href?: string
	icon: string
	iconStyle?: React.CSSProperties
	mobile?: true
	descriptionMobile?: string
	mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
	INJECTED: {
		primary: true,
		connector: injected,
		name: 'Injected',
		description: 'Injected web3 provider.',
		icon: 'arrow-ui.svg',
	},
	METAMASK: {
		connector: injected,
		name: 'MetaMask',
		description: '',
		href: 'https://metamask.io/download.html',
		icon: 'metamask-fox.svg',
		iconStyle: { height: 32 },
	},
	WALLETCONNECT: {
		connector: walletconnect,
		name: 'WalletConnect',
		description: '',
		descriptionMobile: '',
		icon: 'wallet-connect.svg',
		mobile: true,
	},
	WALLETLINK: {
		connector: walletlink,
		name: 'Coinbase Wallet',
		description: '',
		icon: 'coinbase-wallet.svg',
	},
	// FORTMATIC: {
	// 	connector: fortmatic,
	// 	name: 'Fortmatic',
	// 	description: '',
	// 	icon: 'fortmatic.png',
	// 	mobile: true,
	// },
	// LEDGER: {
	// 	connector: ledger,
	// 	name: 'Ledger',
	// 	description: '',
	// 	icon: 'ledger.svg',
	// },
	// TREZOR: {
	// 	connector: trezor,
	// 	name: 'Trezor',
	// 	description: '',
	// 	icon: 'trezor.svg',
	// },
	// PORTIS: {
	// 	connector: portis,
	// 	name: 'Portis',
	// 	description: '',
	// 	icon: 'portis.svg',
	// },
	// MAGIC: {
	// 	connector: portis,
	// 	name: 'Magic',
	// 	description: '',
	// 	icon: 'magic.png',
	// },
	// AUTHEREUM: {
	// 	connector: portis,
	// 	name: 'Authereum',
	// 	description: '',
	// 	icon: 'authereum.svg',
	// },
	// FRAME: {
	// 	connector: portis,
	// 	name: 'Frame',
	// 	description: '',
	// 	icon: 'frame.png',
	// },
	// LATTICE: {
	// 	connector: portis,
	// 	name: 'Lattice',
	// 	description: '',
	// 	icon: 'lattice.png',
	// },
}

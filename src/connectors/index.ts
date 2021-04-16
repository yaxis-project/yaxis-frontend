import Web3 from 'web3'
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

export function getLibrary(provider: any) {
	const library = new Web3(provider)
	return library
}

export const SUPPORTED_NETWORKS = [1, 42]
export const RPC_URLS: { [chainId: number]: string } = Object.fromEntries(
	SUPPORTED_NETWORKS.map((networkId: number) => [
		networkId,
		process.env[`REACT_APP_RPC_URL_${networkId}`],
	]),
)
export const POLLING_INTERVAL = 12000
export const NETWORK_NAMES = { 1: 'mainnet', 42: 'kovan' }
export const FRIENDLY_NETWORK_NAMES = {
	1: 'Ethereum Mainnet',
	42: 'Kovan Test Network',
}

export const network = new NetworkConnector({
	urls: { 1: RPC_URLS[1] },
	defaultChainId: 1,
})

export const injected = new InjectedConnector({
	supportedChainIds: [1, 42],
})

export const WALLET_CONNECT_SUPPORTED_NETWORKS = [1]
export const walletconnect = new WalletConnectConnector({
	rpc: { 1: RPC_URLS[1] }, // Wallet Connect only supports network 1
	bridge: 'https://bridge.walletconnect.org',
	qrcode: true,
	pollingInterval: POLLING_INTERVAL,
})

export const walletlink = new WalletLinkConnector({
	url: RPC_URLS[1], // Wallet Link only supports network 1
	appName: 'yAxis',
	appLogoUrl: '%PUBLIC_URL%/favicon.png',
})

export const fortmatic = new FortmaticConnector({
	apiKey: process.env.REACT_APP_FORTMATIC_KEY as string,
	chainId: 1, // Fortmatic only supports network 1
})

export const ledger = new LedgerConnector({
	chainId: 1,
	url: RPC_URLS[1],
	pollingInterval: POLLING_INTERVAL,
})

export const trezor = new TrezorConnector({
	chainId: 1,
	url: RPC_URLS[1],
	pollingInterval: POLLING_INTERVAL,
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
	url: RPC_URLS[4],
})

export const frame = new FrameConnector({ supportedChainIds: [1] })

export const authereum = new AuthereumConnector({ chainId: 1 })

export const magic = new MagicConnector({
	apiKey: process.env.REACT_APP_MAGIC_KEY as string,
	chainId: 4,
	email: 'hello@example.org'
})

export const torus = new TorusConnector({ chainId: 1 })

export interface WalletInfo {
	primary?: true
	connector?: AbstractConnector
	name: string
	description: string
	href?: string
	icon: string
	iconStyle?: object
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
	FORTMATIC: {
		connector: fortmatic,
		name: 'Fortmatic',
		description: '',
		icon: 'fortmatic.png',
		mobile: true,
	},
	LEDGER: {
		connector: ledger,
		name: 'Ledger',
		description: '',
		icon: 'arrow-ui.svg',
	},
	TREZOR: {
		connector: trezor,
		name: 'Trezor',
		description: '',
		icon: 'arrow-ui.svg',
	},
	PORTIS: {
		connector: portis,
		name: 'Portis',
		description: '',
		icon: 'arrow-ui.svg',
	},
	MAGIC: {
		connector: portis,
		name: 'Magic',
		description: '',
		icon: 'arrow-ui.svg',
	},
	AUTHEREUM: {
		connector: portis,
		name: 'Authereum',
		description: '',
		icon: 'arrow-ui.svg',
	},
	FRAME: {
		connector: portis,
		name: 'Frame',
		description: '',
		icon: 'arrow-ui.svg',
	},
	LATTICE: {
		connector: portis,
		name: 'Lattice',
		description: '',
		icon: 'arrow-ui.svg',
	},
}

import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import Web3 from 'web3'
import { AbstractConnector } from '@web3-react/abstract-connector'

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
	WALLET_CONNECT: {
		connector: walletconnect,
		name: 'WalletConnect',
		description: '',
		descriptionMobile: '',
		icon: 'wallet-connect.svg',
		mobile: true,
	},
	// WALLET_LINK: {
	// 	connector: walletlink,
	// 	name: 'Coinbase Wallet',
	// 	description: '',
	// 	icon: 'coinbase-wallet.svg',
	// },
	// FORTMATIC: {
	// 	connector: fortmatic,
	// 	name: 'Fortmatic',
	// 	description: '',
	// 	icon: 'fortmatic.png',
	// 	mobile: true,
	// },
}

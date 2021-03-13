import { InjectedConnector } from '@web3-react/injected-connector'
// import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'
// import { LedgerConnector } from '@web3-react/ledger-connector'
// import { TrezorConnector } from '@web3-react/trezor-connector'
// import { LatticeConnector } from '@web3-react/lattice-connector'
// import { FrameConnector } from '@web3-react/frame-connector'
// import { AuthereumConnector } from '@web3-react/authereum-connector'
// import { FortmaticConnector } from '@web3-react/fortmatic-connector'
// import { MagicConnector } from '@web3-react/magic-connector'
// import { PortisConnector } from '@web3-react/portis-connector'
// import { TorusConnector } from '@web3-react/torus-connector'
import Web3 from 'web3'

const SUPPORTED_NETWORKS = [1, 42]
const RPC_URLS: { [chainId: number]: string } = Object.fromEntries(
	SUPPORTED_NETWORKS.map((networkId: number) => [
		networkId,
		process.env[`REACT_APP_RPC_URL_${networkId}`],
	]),
)
const POLLING_INTERVAL = 12000

export const injected = new InjectedConnector({
	supportedChainIds: [1, 42],
})

// export const network = new NetworkConnector({
// 	urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
// 	defaultChainId: 1,
// })

export const walletconnect = new WalletConnectConnector({
	rpc: { 1: RPC_URLS[1] },
	bridge: 'https://bridge.walletconnect.org',
	qrcode: true,
	pollingInterval: POLLING_INTERVAL,
})

// export const walletlink = new WalletLinkConnector({
// 	url: RPC_URLS[1],
// 	appName: 'web3-react example',
// })

// export const ledger = new LedgerConnector({
// 	chainId: 1,
// 	url: RPC_URLS[1],
// 	pollingInterval: POLLING_INTERVAL,
// })

// export const trezor = new TrezorConnector({
// 	chainId: 1,
// 	url: RPC_URLS[1],
// 	pollingInterval: POLLING_INTERVAL,
// 	manifestEmail: 'dummy@abc.xyz',
// 	manifestAppUrl: 'http://localhost:1234',
// })

// export const lattice = new LatticeConnector({
// 	chainId: 4,
// 	appName: 'web3-react',
// 	url: RPC_URLS[4],
// })

// export const frame = new FrameConnector({ supportedChainIds: [1] })

// export const authereum = new AuthereumConnector({ chainId: 42 })

// export const fortmatic = new FortmaticConnector({
// 	apiKey: process.env.FORTMATIC_API_KEY as string,
// 	chainId: 4,
// })

// export const magic = new MagicConnector({
// 	apiKey: process.env.MAGIC_API_KEY as string,
// 	chainId: 4,
// 	email: 'hello@example.org',
// })

// export const portis = new PortisConnector({
// 	dAppId: process.env.PORTIS_DAPP_ID as string,
// 	networks: [1, 100],
// })

// export const torus = new TorusConnector({ chainId: 1 })

enum ConnectorNames {
	Injected = 'Injected',
	// Network = 'Network',
	WalletConnect = 'WalletConnect',
	// WalletLink = 'WalletLink',
	// Ledger = 'Ledger',
	// Trezor = 'Trezor',
	// Lattice = 'Lattice',
	// Frame = 'Frame',
	// Authereum = 'Authereum',
	// Fortmatic = 'Fortmatic',
	// Magic = 'Magic',
	// Portis = 'Portis',
	// Torus = 'Torus',
}

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
	[ConnectorNames.Injected]: injected,
	// [ConnectorNames.Network]: network,
	[ConnectorNames.WalletConnect]: walletconnect,
	// [ConnectorNames.WalletLink]: walletlink,
	// [ConnectorNames.Ledger]: ledger,
	// [ConnectorNames.Trezor]: trezor,
	// [ConnectorNames.Lattice]: lattice,
	// [ConnectorNames.Frame]: frame,
	// [ConnectorNames.Authereum]: authereum,
	// [ConnectorNames.Fortmatic]: fortmatic,
	// [ConnectorNames.Magic]: magic,
	// [ConnectorNames.Portis]: portis,
	// [ConnectorNames.Torus]: torus,
}

export function getLibrary(provider: any): Web3 {
	// return provider
	const library = new Web3(provider)
	// library.pollingInterval = 15000
	return library
}

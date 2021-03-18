import { WalletInfo } from '../../../connectors'

const noInjected = (wallets: WalletInfo[]) =>
	wallets
		.filter((w) => w.name !== 'Injected')
		.map((w) => (w.name === 'MetaMask' ? { ...w, connector: null } : w))

export const handleInjected = (wallets: WalletInfo[]) => {
	const w: any = window
	if (!(w.web3 || w.ethereum)) return noInjected(wallets)
	const isMetaMask = w?.ethereum?.isMetaMask
	const remove = isMetaMask ? 'Injected' : 'MetaMask'
	return wallets.filter((w) => w.name !== remove)
}

export const filterByDevice = (wallets: any) => {
	return wallets
}

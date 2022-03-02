import { WalletInfo } from '../../../../connectors'
import { isMobile } from 'react-device-detect'

const noInjected = (wallets: WalletInfo[]): WalletInfo[] =>
	wallets
		.filter((w) => w.name !== 'Injected')
		.map((w) => (w.name === 'MetaMask' ? { ...w, connector: null } : w))

export const handleInjected = (wallets: WalletInfo[]) => {
	const w = window
	if (!(w['web3'] || w['ethereum'])) return noInjected(wallets)
	const isMetaMask = w['ethereum']?.isMetaMask
	const remove = isMetaMask ? 'Injected' : 'MetaMask'
	return wallets.filter((w) => w.name !== remove)
}

export const filterByDevice = (wallets: WalletInfo[]) => {
	return wallets.filter((w) => (isMobile ? w.mobile : !w.mobileOnly))
}

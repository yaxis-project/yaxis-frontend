import React, { useMemo } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './views/Home'
import Vault from './views/Vault'
import VaultDetails from './views/VaultDetails'
import Liquidity from './views/Liquidity'
import LiquidityPool from './views/LiquidityPool'
import Swap from './views/Swap'
import V3 from './views/V3'
import Faucet from './views/Faucet'
import Governance from './views/Governance'
import { notification } from 'antd'
import { currentConfig } from './constants/configs'
import useWeb3Provider from './hooks/useWeb3Provider'
import { useEagerConnect } from './hooks/useEagerConnect'
import { useInactiveListener } from './hooks/useInactiveListener'

import SwapBanner from './components/Banner/Banners/SwapBanner'
import Modals from './components/Modals'
import { useChainInfo } from './state/user'
import { TVaults } from './constants/type'
import { LiquidityPool as LiquidityPoolEthereum } from './constants/type/ethereum'
import { LiquidityPool as LiquidityPoolAvalanche } from './constants/type/avalanche'

notification.config({
	placement: 'topRight',
	duration: 6,
})

const App: React.FC = () => {
	const triedEager = useEagerConnect()
	useInactiveListener(!triedEager)

	const { chainId } = useWeb3Provider()

	const chainInfo = useChainInfo()

	const vaults = useMemo(
		() => Object.keys(currentConfig(chainId).vaults) as TVaults[],
		[chainId],
	)

	const activePools = useMemo(
		() =>
			Object.values<LiquidityPoolEthereum | LiquidityPoolAvalanche>(
				currentConfig(chainId).pools,
			).filter((pool) => pool.active),
		[chainId],
	)

	if (!chainId) return null

	return (
		<>
			{chainInfo.blockchain === 'ethereum' && <SwapBanner />}
			<Routes>
				<Route path="/" element={<Home />} />

				<Route path="/vault" element={<Vault />} />

				{vaults.map((vault) => {
					const key = `/vault/${vault}`
					return (
						<Route
							key={key}
							path={key}
							element={<VaultDetails vault={vault} />}
						/>
					)
				})}

				<Route path="/liquidity" element={<Liquidity />} />

				{activePools.map((pool) => {
					const key = `/liquidity/${pool.lpAddress}`
					return (
						<Route
							key={key}
							path={key}
							element={<LiquidityPool pool={pool} />}
						/>
					)
				})}

				<Route path="/governance" element={<Governance />} />

				{chainInfo.blockchain === 'ethereum' && (
					<>
						<Route path="/swap" element={<Swap />} />
						<Route path="/v3" element={<V3 />} />
						<Route path="/faucet" element={<Faucet />} />
					</>
				)}

				<Route path="*" element={<Navigate to="/" replace={true} />} />
			</Routes>
			<Modals />
		</>
	)
}

export default App

import React, { Suspense, useMemo } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Home from './views/Home'
import MetaVault from './views/Vault'
import Liquidity from './views/Liquidity'
import LiquidityPool from './views/LiquidityPool'
import Rewards from './views/Rewards'
import Swap from './views/Swap'
import Faucet from './views/Faucet'
import Governance from './views/Governance'
import { notification } from 'antd'
import { currentConfig } from './constants/configs'
import { useWeb3React } from '@web3-react/core'
import { useEagerConnect } from './hooks/useEagerConnect'
import { useInactiveListener } from './hooks/useInactiveListener'

import SwapBanner from './components/Banner/Banners/SwapBanner'
import Modals from './components/Modals'

notification.config({
	placement: 'topRight',
	duration: 6,
})

const App: React.FC = () => {
	const triedEager = useEagerConnect()
	useInactiveListener(!triedEager)

	const { chainId } = useWeb3React()

	const activePools = useMemo(
		() =>
			Object.values(currentConfig(chainId).pools).filter(
				(pool) => pool.active,
			),
		[chainId],
	)

	return (
		<Suspense fallback={null}>
			<SwapBanner />
			<Switch>
				<Route path="/" exact>
					<Home />
				</Route>
				<Route path="/vault" exact>
					<MetaVault />
				</Route>
				<Route path="/liquidity" exact>
					<Liquidity />
				</Route>
				{activePools.map((pool) => {
					const key = `/liquidity/${pool.lpAddress}`
					return (
						<Route key={key} path={key} exact>
							<LiquidityPool pool={pool} />
						</Route>
					)
				})}
				<Route path="/rewards" exact>
					<Rewards />
				</Route>
				<Route path="/governance" exact>
					<Governance />
				</Route>
				<Route path="/swap" exact>
					<Swap />
				</Route>
				<Route path="/faucet" exact>
					<Faucet />
				</Route>
				<Redirect to="/" />
			</Switch>
			<Modals />
		</Suspense>
	)
}

export default App

import React, { useMemo } from 'react'
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom'

import { ThemeProvider } from 'styled-components'
import FarmsProvider from './contexts/Farms'
import ModalsProvider from './contexts/Modals'
import LanguageProvider from './contexts/Language'
import TransactionProvider from './contexts/Transactions'
import YaxisProvider from './contexts/Global'
import PricesProvider from './contexts/Prices/Prices'

import theme from './theme'
import Home from './views/Home'
import MetaVault from './views/MetaVault'
import Staking from './views/Staking'
import Liquidity from './views/Liquidity'
import LiquidityPool from './views/LiquidityPool'
import Swap from './views/Swap'
import Faucet from './views/Faucet'
import { notification } from 'antd'
import { currentConfig } from './yaxis/configs'

import {
	Web3ReactProvider,
	createWeb3ReactRoot,
	useWeb3React,
} from '@web3-react/core'
import { useEagerConnect } from './hooks/useEagerConnect'
import { useInactiveListener } from './hooks/useInactiveListener'
import { getLibrary } from './connectors'

import SwapBanner from './components/Banner/Banners/SwapBanner'

notification.config({
	placement: 'topRight',
	duration: 6,
})

const Routes: React.FC = () => {
	const triedEager = useEagerConnect()
	useInactiveListener(!triedEager)
	const { chainId } = useWeb3React()
	const pools = useMemo(() => currentConfig(chainId).pools, [chainId])
	return (
		<Router>
			<SwapBanner />
			<Switch>
				<Route path="/" exact>
					<Home />
				</Route>
				<Route path="/vault" exact>
					<MetaVault />
				</Route>
				<Route path="/staking" exact>
					<Staking />
				</Route>
				<Route path="/liquidity" exact>
					<Liquidity />
				</Route>
				{pools.map((pool) => {
					const key = `/liquidity/${pool.lpAddress}`
					return (
						<Route key={key} path={key} exact>
							<LiquidityPool pool={pool} />
						</Route>
					)
				})}
				<Route path="/swap" exact>
					<Swap />
				</Route>
				<Route path="/faucet" exact>
					<Faucet />
				</Route>
				<Redirect to="/" />
			</Switch>
		</Router>
	)
}

const Providers: React.FC = ({ children }) => {
	const Web3ReactProviderFallback = useMemo(
		() => createWeb3ReactRoot('fallback'),
		[],
	)
	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<Web3ReactProviderFallback getLibrary={getLibrary}>
				<ThemeProvider theme={theme}>
					<PricesProvider>
						<YaxisProvider>
							<LanguageProvider>
								<TransactionProvider>
									<FarmsProvider>
										<ModalsProvider>
											{children}
										</ModalsProvider>
									</FarmsProvider>
								</TransactionProvider>
							</LanguageProvider>
						</YaxisProvider>
					</PricesProvider>
				</ThemeProvider>
			</Web3ReactProviderFallback>
		</Web3ReactProvider>
	)
}

const App = () => (
	<Providers>
		<Routes />
	</Providers>
)
export default App

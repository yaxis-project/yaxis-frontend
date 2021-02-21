import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { UseWalletProvider } from 'use-wallet'

import FarmsProvider from './contexts/Farms'
import ModalsProvider from './contexts/Modals'
import LanguageProvider from './contexts/Language'
import TransactionProvider from './contexts/Transactions'
import YaxisProvider from './contexts/YaxisProvider'
import { PriceMapContextComponent } from './contexts/PriceMapContext'

import theme from './theme'
import Home from './views/Home'
import Investing from './views/Investing'
import Savings from './views/Savings'
import Liquidity from './views/Liquidity'
import LiquidityPool from './views/LiquidityPool'
import { notification } from 'antd'
import { NETWORK_ID } from './yaxis/configs'
import { currentConfig } from './yaxis/configs'


notification.config({
	placement: 'topRight',
	duration: 6,
})

const App: React.FC = () => {
	const activePools = currentConfig.pools.filter(pool => pool.active)
	return (
		<Providers>
			<Router>
				<Switch>
					<Route path="/" exact>
						<Home />
					</Route>
					<Route path="/investing" exact>
						<Investing />
					</Route>
					<Route path="/savings" exact>
						<Savings />
					</Route>
					<Route path="/liquidity" exact>
						<Liquidity />
					</Route>
					{activePools.map(pool => {
						const key = `/liquidity/${pool.lpAddress}`
						return <Route key={key} path={key} exact>
							<LiquidityPool pool={pool} />
						</Route>
					})}
					<Redirect to='/' />
				</Switch>
			</Router>
		</Providers>
	)
}

const Providers: React.FC = ({ children }) => {
	return (
		<ThemeProvider theme={theme}>
			<PriceMapContextComponent>
				<UseWalletProvider
					chainId={NETWORK_ID}
					connectors={{
						walletconnect: { rpcUrl: process.env.RPC_URL },
					}}
				>
					<YaxisProvider>
						<LanguageProvider>
							<TransactionProvider>
								<FarmsProvider>
									<ModalsProvider>
										{children}
									</ModalsProvider>
								</FarmsProvider>
							</TransactionProvider>
						</LanguageProvider >
					</YaxisProvider >
				</UseWalletProvider>
			</PriceMapContextComponent >
		</ThemeProvider >
	)
}

export default App

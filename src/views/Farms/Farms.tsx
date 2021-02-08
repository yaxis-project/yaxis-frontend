import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'
import {useWallet} from 'use-wallet'
import Button from '../../components/Button'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'
import Farm from '../Farm'
import FarmCards from './components/FarmCards'
import {Row} from "antd";

const Farms: React.FC = () => {
	const {path} = useRouteMatch()
	const {account} = useWallet()
	const [onPresentWalletProviderModal] = useModal(<WalletProviderModal/>)
	return (
		<Switch>
				{!!account ? (
					<>
						<Route exact path={path}>
							<FarmCards/>
						</Route>
						<Route path={`${path}/:farmId`}>
							<Farm/>
						</Route>
					</>
				) : (
					<Row style={{padding: 100}}
					>
						<Button
							onClick={onPresentWalletProviderModal}
							text="Unlock Wallet"
						/>
					</Row>
				)}
		</Switch>
	)
}

export default Farms

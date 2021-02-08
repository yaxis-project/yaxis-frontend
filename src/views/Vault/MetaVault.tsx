import React, { useEffect } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import MetaVaultContent from './components/MetaVaultContent';
import {useWallet} from "use-wallet";
import useModal from "../../hooks/useModal";
import WalletProviderModal from "../../components/WalletProviderModal";
import {Row} from "antd";
import Button from "../../components/Button";


const MetaVault: React.FC = () => {
	const { path } = useRouteMatch();
	const {account} = useWallet()
	const [onPresentWalletProviderModal] = useModal(<WalletProviderModal/>)
	useEffect(() => {
		window.scrollTo(0, 0)
	}, []);

	return (
		<>
			{!!account ? (
				<Switch>
					<Route exact path={path}>
						<Redirect to="/" />
					</Route>
					<Route path={`${path}/:id`}>
						<MetaVaultContent />
					</Route>
				</Switch>
			) : (
				<Row style={{padding: 100}}>
					<Button
						onClick={onPresentWalletProviderModal}
						text="Unlock Wallet"
					/>
				</Row>
			)}
		</>
	)
}

export default MetaVault;

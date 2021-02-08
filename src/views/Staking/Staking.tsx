import React from 'react'
import {Switch } from 'react-router-dom'
import {useWallet} from 'use-wallet'


import Button from '../../components/Button'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'
import StakeXYax from "./StakeXYax";
import { Row } from "antd";

const Staking: React.FC = () => {
	const {account} = useWallet()
	const [onPresentWalletProviderModal] = useModal(<WalletProviderModal/>)
	return (
		<Switch>
				{!!account ? (
					<>
						<StakeXYax/>
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

export default Staking

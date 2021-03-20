import React from 'react'
import { useWeb3React } from '@web3-react/core'
import Button from '../../Button'
import CardIcon from '../../CardIcon'
import CardTitle from '../../CardTitle'
import { WalletInfo } from '../../../connectors'
import { setRecentProvider } from '../../../connectors/utils'


interface WalletCardProps {
	config: WalletInfo
}

const WalletCard: React.FC<WalletCardProps> = ({ config }) => {
	const { activate } = useWeb3React()
	return (
		<>
			<CardIcon>
				<img
					src={require('../../../assets/img/' + config.icon).default}
					style={{ height: 32 }}
					alt={`${config.name} logo`}
				/>
			</CardIcon>
			<CardTitle text={config.name} />
			<Button onClick={async () => {
				if (!config.connector) return window.open(config.href, '_blank');
				localStorage.removeItem('signOut')
				await activate(config.connector)
				setRecentProvider(config.name.toUpperCase())
			}}
				text={config.connector ? "Connect" : "Install"}
			/>
		</>
	)
}

export default WalletCard

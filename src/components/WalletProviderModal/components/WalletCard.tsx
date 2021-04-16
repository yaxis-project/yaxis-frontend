import React from 'react'
import { Row } from 'antd'
import { useWeb3React } from '@web3-react/core'
import Button from '../../Button'
import CardIcon from '../../CardIcon'
import { WalletInfo } from '../../../connectors'
import { setRecentProvider } from '../../../connectors/utils'
import styled from 'styled-components'

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
			<Row justify={'center'}>
				<StyledCardTitle>{config.name}</StyledCardTitle>
			</Row>
			<Button
				height={'50px'}
				onClick={async () => {
					if (!config.connector)
						return window.open(config.href, '_blank')
					localStorage.removeItem('signOut')
					await activate(config.connector)
					setRecentProvider(config.name.toUpperCase())
				}}
			>
				{config.connector ? 'Connect' : 'Install'}
			</Button>
		</>
	)
}

export default WalletCard

const StyledCardTitle = styled.div`
	color: ${(props) => props.theme.color.grey[600]};
	font-size: 14px;
	font-weight: 700;
	text-align: center;
	padding: ${(props) => props.theme.spacing[2]}px 0;
`

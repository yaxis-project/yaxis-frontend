import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { useChain } from '../../../state/user/hooks'
import { CHAIN_INFO, ALL_SUPPORTED_CHAIN_IDS } from '../../../constants/chains'
// import useTranslation from '../../../hooks/useTranslation'
import { switchToNetwork } from '../../../utils/switchToNetwork'
import Typography from '../../Typography'
import { useWeb3React } from '@web3-react/core'
import { networkConnectorFactory } from '../../../connectors'
import Button from '../../Button'
import Menu from '../../Menu'

const { Text } = Typography

const NetworkSelect: React.FC = () => {
	const { activate } = useWeb3React('fallback')
	const { library } = useWeb3React()
	const chainId = useChain()
	// const translate = useTranslation()
	const blockchain = useMemo(() => CHAIN_INFO[chainId], [chainId])

	return (
		<StyledMenu mode="horizontal" selectedKeys={[`${chainId}`]}>
			<StyledSubMenu
				key="network-select"
				title={
					<NetworkSelector align="middle" justify="center">
						<img
							src={blockchain.logoUrl}
							height="36"
							width="36"
							alt={`${blockchain.label} logo`}
						/>
					</NetworkSelector>
				}
				popupOffset={[-50, 5]}
			>
				<Menu.ItemGroup
					key={'network-select-title'}
					title={
						<Row
							align="middle"
							justify="center"
							style={{
								fontSize: '16px',
								paddingTop: '5px',
							}}
						>
							<Text style={{ fontWeight: 800 }}>
								Blockchain
								{/* TODO: translation */}
							</Text>
						</Row>
					}
				/>

				{ALL_SUPPORTED_CHAIN_IDS.map((id) => (
					<Menu.Item
						key={id}
						onClick={async () => {
							if (chainId === id) return
							try {
								await switchToNetwork({
									library,
									chainId: id,
								})
								const connector = networkConnectorFactory(id)
								await activate(connector)
							} catch {
								if (!library) {
									const connector =
										networkConnectorFactory(id)
									await activate(connector)
								}
							}
						}}
					>
						<Row align="middle" gutter={10}>
							<Col
								style={{
									fontSize: '26px',
								}}
							>
								<Row>
									<img
										src={CHAIN_INFO[id].logoUrl}
										height="30"
										width="30"
										alt={`${CHAIN_INFO[id].label} logo`}
									/>
								</Row>
							</Col>
							<Col>
								<Text>{CHAIN_INFO[id].label}</Text>
							</Col>
						</Row>
					</Menu.Item>
				))}

				<Menu.ItemGroup
					key={'network-select-bridge'}
					title={
						<Row
							align="middle"
							justify="center"
							style={{
								height: '40px',
								fontSize: '16px',
							}}
						>
							<Button height={'40px'}>
								<a
									href="https://app.multichain.org/#/router"
									target="_blank"
									rel="noopener noreferrer"
								>
									Bridge YAXIS
									{/* TODO: translation */}
								</a>
							</Button>
						</Row>
					}
				/>
			</StyledSubMenu>
		</StyledMenu>
	)
}

export default NetworkSelect

const StyledMenu = styled(Menu.Menu)`
	border-bottom: none;
	background: none;
	color: ${(props) => props.theme.colors.white} !important;
	font-weight: 600;
	font-size: 14px;
	text-decoration: none;
`

const StyledSubMenu = styled(Menu.SubMenu)`
	padding: 0 !important;
`

const NetworkSelector = styled(Row)`
	-webkit-user-select: none; /* Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE10+/Edge */
	user-select: none; /* Standard */
`

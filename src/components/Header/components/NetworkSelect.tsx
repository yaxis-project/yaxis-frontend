import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Menu, Row, Col } from 'antd'
import { useChain, useSetChain } from '../../../state/user/hooks'
import { CHAIN_INFO, ALL_SUPPORTED_CHAIN_IDS } from '../../../constants/chains'
// import useTranslation from '../../../hooks/useTranslation'
import { switchToNetwork } from '../../../utils/switchToNetwork'
import Typography from '../../Typography'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { useWeb3React } from '@web3-react/core'
import { networkConnectorFactory } from '../../../connectors'

const { Text } = Typography

const NetworkSelect: React.FC = () => {
	const { activate } = useWeb3React('fallback')
	const { library } = useWeb3React()
	const chainId = useChain()
	const setChainId = useSetChain()
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
								setChainId(id)
							} catch {
								if (!library) {
									const connector =
										networkConnectorFactory(id)
									await activate(connector)
									setChainId(id)
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
			</StyledSubMenu>
		</StyledMenu>
	)
}

export default NetworkSelect

const StyledMenu = styled(Menu)`
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

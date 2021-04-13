import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import useModal from '../../../hooks/useModal'
import { Button, Menu, Dropdown, Row, Col, Divider } from 'antd'
import {
	CaretDownOutlined,
	CopyOutlined,
	BlockOutlined,
	CheckCircleTwoTone,
} from '@ant-design/icons'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { etherscanUrl } from '../../../yaxis/utils'
import WalletProviderModal from '../../WalletProviderModal'
import {
	network,
	NETWORK_NAMES,
	FRIENDLY_NETWORK_NAMES,
} from '../../../connectors'
import { useWeb3React } from '@web3-react/core'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
	const [onPresentWalletProviderModal] = useModal(
		<WalletProviderModal />,
		'provider',
	)

	const { account, deactivate, chainId } = useWeb3Provider()
	const { activate } = useWeb3React('fallback')

	const networkName = useMemo(() => NETWORK_NAMES[chainId] || '', [chainId])
	const friendlyNetworkName = useMemo(
		() => FRIENDLY_NETWORK_NAMES[chainId] || '',
		[chainId],
	)

	const handleUnlockClick = useCallback(() => {
		onPresentWalletProviderModal()
	}, [onPresentWalletProviderModal])

	const handleSignOutClick = useCallback(() => {
		localStorage.setItem('signOut', account)
		deactivate()
		activate(network)
	}, [activate, deactivate, account])

	return (
		<StyledAccountButton>
			<Col>
				{!account ? (
					<StyledButton onClick={handleUnlockClick}>
						Connect
					</StyledButton>
				) : (
					<Dropdown
						placement="bottomRight"
						overlay={
							<StyledMenu>
								<Menu.ItemGroup
									title={
										<Col
											style={{
												marginBottom: '5px',
											}}
										>
											<StyledRow
												style={{
													margin:
														'5px 10px 12px 10px',
												}}
											>
												<AccountText>
													Account:
												</AccountText>
												<AccountIdText>
													{account.slice(0, 4)} ...{' '}
													{account.slice(-2)}
												</AccountIdText>
											</StyledRow>
											<StyledRow>
												<CopyOutlined />
												<StyledText>
													Copy Address
												</StyledText>
											</StyledRow>
											<StyledRow>
												<BlockOutlined />
												<StyledText>
													<a
														href={etherscanUrl(
															`/address/${account}`,
															networkName,
														)}
														rel="noopener noreferrer"
														target="_blank"
													>
														View on Etherscan
													</a>
												</StyledText>
											</StyledRow>
											<StyledRow>
												<CheckCircleTwoTone twoToneColor="#52c41a" />{' '}
												<StyledText>
													{friendlyNetworkName}
												</StyledText>
											</StyledRow>
											<Divider
												orientation="left"
												style={{
													margin: '10px 0px 5px 0px',
												}}
											/>
										</Col>
									}
								/>
								<Menu.Item>
									<a
										href="https://resources.yaxis.io/"
										rel="noopener noreferrer"
										target="_blank"
									>
										Help Center
									</a>
								</Menu.Item>
								<Menu.Item
									onClick={handleSignOutClick}
									style={{
										marginBottom: '8px',
									}}
								>
									Logout
								</Menu.Item>
							</StyledMenu>
						}
					>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Jazzicon
								diameter={36}
								seed={jsNumberForAddress(account)}
							/>
							<CaretDownOutlined style={{ paddingLeft: '5px' }} />
						</div>
					</Dropdown>
				)}
			</Col>
		</StyledAccountButton>
	)
}

const StyledMenu = styled(Menu)`
	margin: 8px -2px 0 0;
	border: 2px solid lightgrey;
`

const StyledRow = styled(Row)`
	display: flex;
	align-items: center;
	margin-bottom: 5px;
`

const StyledButton = styled(Button)`
	font-weight: bold;
	font-size: 1em;
	height: 38px;

	@media only screen and (max-width: 1100px) {
		height: 32px;
	}
`

const StyledAccountButton = styled(Row)`
	display: flex;
	align-items: center;
	font-size: 1rem;

	.ant-dropdown-trigger {
		margin-left: 6px;
		color: white;
	}

	@media only screen and (max-width: 1100px) {
		font-size: 0.8rem;
	}
`

const AccountText = styled.div`
	font-weight: bold;
	margin-left: -8px;
`

const AccountIdText = styled.div`
	font-weight: bold;
	font-size: 1em;
	color: #016eac;
	border: 1.5px solid #016eac;
	border-radius: 20px;
	padding: 2px 10px;
	margin-left: 10px;
`

const StyledText = styled.div`
	text-align: center;
	font-size: 0.9em;
	margin-left: 10px;
`

export default AccountButton

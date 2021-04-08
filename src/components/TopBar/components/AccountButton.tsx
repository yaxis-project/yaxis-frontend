import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import useModal from '../../../hooks/useModal'
import { Button, Menu, Dropdown, Row, Col } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { etherscanUrl } from '../../../yaxis/utils'
import WalletProviderModal from '../../WalletProviderModal'
import { network, NETWORK_NAMES } from '../../../connectors'
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

	const handleUnlockClick = useCallback(() => {
		onPresentWalletProviderModal()
	}, [onPresentWalletProviderModal])

	const handleSignOutClick = useCallback(() => {
		localStorage.setItem('signOut', account)
		deactivate()
		activate(network)
	}, [deactivate, account])

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
							<Menu>
								<Menu.ItemGroup
									title={
										<Col>
											<div
												style={{ textAlign: 'center' }}
											>
												Your Account
											</div>
											<NetworkText>
												{networkName}
											</NetworkText>
											<Button
												href={etherscanUrl(
													`/address/${account}`,
													networkName,
												)}
												target={'_blank'}
												rel="noopener noreferrer"
												block
												type="primary"
												ghost
											>
												<span
													style={{ margin: '0 5px' }}
												>
													{account.slice(0, 4)} ...{' '}
													{account.slice(-2)}
												</span>
											</Button>
										</Col>
									}
								/>
								<Menu.Item onClick={handleSignOutClick}>
									Logout
								</Menu.Item>
							</Menu>
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

// const StyledCol = styled(Col)`
// 	color: white;
// 	padding: 8px 12px;
// 	border: 1px solid white;
// 	font-size: 1em;
// 	line-height: 1em;
// 	border-radius: 12px;
// 	font-weight: 700;
// 	margin-right: 18px;
// 	> span:first-child {
// 		margin-right: 15px;
// 	}

// 	@media only screen and (max-width: 1100px) {
// 		> span:first-child {
// 			margin-right: 5px;
// 		}
// 	}
// `

const StyledButton = styled(Button)`
	font-weight: bold;
	font-size: 1em;
	height: 38px;

	@media only screen and (max-width: 1100px) {
		height: 32px;
	}
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

const NetworkText = styled.div`
	text-align: center;
	font-size: 0.9em;
`

export default AccountButton

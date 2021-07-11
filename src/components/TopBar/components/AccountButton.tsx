import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { Button, Menu, Dropdown, Row, Col } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useOpenModal } from '../../../state/application/hooks'
import { ApplicationModal } from '../../../state/application/actions'
import AccountInfo from '../components/AccountInfo'
import {
	network,
	NETWORK_NAMES,
	FRIENDLY_NETWORK_NAMES,
} from '../../../connectors'
import { useWeb3React } from '@web3-react/core'
import { useClearPendingTransactions } from '../../../state/transactions/hooks'
import ThemeToggle from '../../ThemeToggle'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
	const { account, deactivate, chainId } = useWeb3Provider()
	const { activate } = useWeb3React('fallback')

	const networkName = useMemo(() => NETWORK_NAMES[chainId] || '', [chainId])
	const friendlyNetworkName = useMemo(
		() => FRIENDLY_NETWORK_NAMES[chainId] || '',
		[chainId],
	)

	const openModal = useOpenModal(ApplicationModal['WALLET'])

	const handleSignOutClick = useCallback(() => {
		localStorage.setItem('signOut', account)
		deactivate()
		activate(network)
	}, [activate, deactivate, account])

	const handleClearPending = useClearPendingTransactions()

	return (
		<StyledAccountButton>
			<Col>
				{!account ? (
					<StyledButton onClick={openModal}>Connect</StyledButton>
				) : (
					<Dropdown
						placement="bottomRight"
						overlay={
							<StyledMenu>
								<AccountInfo
									account={account}
									networkName={networkName}
									friendlyNetworkName={friendlyNetworkName}
									mobile={false}
								/>
								<Row align="middle" justify="center">
									<ThemeToggle />
								</Row>

								<StyledText>
									<a
										href="https://resources.yaxis.io/"
										rel="noopener noreferrer"
										target="_blank"
									>
										Help Center
									</a>
								</StyledText>
								<StyledText onClick={handleClearPending}>
									Clear Pending
								</StyledText>
								<StyledText
									onClick={handleSignOutClick}
									style={{
										marginBottom: '8px',
									}}
								>
									Logout
								</StyledText>
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

const StyledText = styled(Menu.Item)`
	font-size: 1.1em;
	color: ${(props) => props.theme.primary.main};
`

const StyledMenu = styled(Menu)`
	background: ${(props) => props.theme.primary.background};
	margin: 8px -2px 0 0;
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

export default AccountButton

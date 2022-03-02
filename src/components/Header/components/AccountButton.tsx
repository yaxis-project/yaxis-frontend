import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { Button, Menu, Dropdown, Row, Col } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import Davatar from '@davatar/react'
import { useOpenModal } from '../../../state/application/hooks'
import { ApplicationModal } from '../../../state/application/actions'
import AccountInfo from '../components/AccountInfo'
import { FRIENDLY_NETWORK_NAMES } from '../../../connectors'
import { useClearPendingTransactions } from '../../../state/transactions/hooks'
import useTranslation from '../../../hooks/useTranslation'

const AccountButton: React.FC = () => {
	const translate = useTranslation()

	const { account, deactivate, chainId } = useWeb3Provider()

	const friendlyNetworkName = useMemo(
		() => FRIENDLY_NETWORK_NAMES[chainId] || '',
		[chainId],
	)

	const openModal = useOpenModal(ApplicationModal['WALLET'])

	const handleSignOutClick = useCallback(() => {
		localStorage.setItem('signOut', account)
		deactivate()
	}, [deactivate, account])

	const handleClearPending = useClearPendingTransactions()

	return (
		<StyledAccountButton>
			<Col>
				{!account ? (
					<StyledButton onClick={openModal}>
						{translate('Connect')}
					</StyledButton>
				) : (
					<Dropdown
						placement="bottomRight"
						overlay={
							<StyledMenu>
								<AccountInfo
									account={account}
									friendlyNetworkName={friendlyNetworkName}
									mobile={false}
								/>

								<StyledText key="help">
									<a
										href="https://resources.yaxis.io/"
										rel="noopener noreferrer"
										target="_blank"
									>
										{translate('Help Center')}
									</a>
								</StyledText>
								<StyledText
									onClick={handleClearPending}
									key="clear"
								>
									{translate('Clear Pending')}
								</StyledText>
								<StyledText
									key="logout"
									onClick={handleSignOutClick}
									style={{
										marginBottom: '8px',
									}}
								>
									{translate('Logout')}
								</StyledText>
							</StyledMenu>
						}
					>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Davatar size={36} address={account} />
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
	border-radius: 7px;

	&:hover {
		border-color: ${(props) => props.theme.colors.brandBlue};
		color: ${(props) => props.theme.colors.brandBlue};
	}

	&:active {
		border-color: ${(props) => props.theme.colors.brandBlue};
		color: ${(props) => props.theme.colors.brandBlue};
	}

	&:focus {
		border-color: ${(props) => props.theme.colors.brandBlue};
		color: ${(props) => props.theme.colors.brandBlue};
	}

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

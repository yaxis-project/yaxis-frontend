import React, { Fragment, useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useModal from '../../../hooks/useModal'
import useTVL from '../../../hooks/useComputeTVL'
import { Button, Menu, Dropdown, Row, Col } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon' // @ts-ignore

import WalletProviderModal from '../../WalletProviderModal'
import BigNumber from 'bignumber.js'

interface AccountButtonProps { }

const AccountButton: React.FC<AccountButtonProps> = (props) => {
	const [onPresentWalletProviderModal] = useModal(
		<WalletProviderModal />,
		'provider',
	)

	const { account, reset } = useWallet()
	const { yaxisPrice } = useTVL()

	const handleUnlockClick = useCallback(() => {
		onPresentWalletProviderModal()
	}, [onPresentWalletProviderModal])

	return (
		<StyledAccountButton>
			<StyledCol>
				<span>YAX</span>
				<span>${new BigNumber(yaxisPrice).toFixed(2)}</span>
			</StyledCol>
			<Col>
				{!account ? (
					<StyledButton
						onClick={handleUnlockClick}
					>
						Connect
					</StyledButton>
				) : (
						<Fragment>
							<Jazzicon
								diameter={36}
								seed={jsNumberForAddress(account)}
							/>
							<Dropdown
								placement="bottomRight"
								overlay={
									<Menu>
										<Menu.Item onClick={() => reset()}>
											Logout
								</Menu.Item>
									</Menu>
								}
							>
								<CaretDownOutlined />
							</Dropdown>
						</Fragment>
					)}
			</Col>
		</StyledAccountButton>
	)
}

const StyledCol = styled(Col)`
	color: white;
	padding: 8px 12px;
	border: 1px solid white;
	font-size: 1em;
	line-height: 1em;
	border-radius: 12px;
	font-weight: 700;
	margin-right: 18px;
	> span:first-child {
		margin-right: 15px;
	}

	@media only screen and (max-width: 1100px) {
		> span:first-child {
			margin-right: 5px;
		}
	}
`

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

export default AccountButton

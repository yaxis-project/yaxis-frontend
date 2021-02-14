import React, { Fragment, useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useModal from '../../../hooks/useModal'
import useTVL from '../../../hooks/useComputeTVL'
import { Button, Menu, Dropdown } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon' // @ts-ignore

import WalletProviderModal from '../../WalletProviderModal'
import AccountModal from './AccountModal'
import BigNumber from 'bignumber.js'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
	const [onPresentAccountModal] = useModal(<AccountModal />)
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
			<span className="yax-price">
				<span>YAX</span>
				<span>${new BigNumber(yaxisPrice).toFixed(2)}</span>
			</span>
			{!account ? (
				<Button
					onClick={handleUnlockClick}
					style={{
						fontWeight: 'bold',
						fontSize: '18px',
						height: '38px',
					}}
				>
					Connect
				</Button>
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
		</StyledAccountButton>
	)
}

const StyledAccountButton = styled.div`
	display: flex;
	align-items: center;

	.yax-price {
		color: white;
		padding: 8px 12px;
		border: 1px solid white;
		font-size: 18px;
		line-height: 1em;
		border-radius: 12px;
		font-weight: 700;
		margin-right: 18px;
		> span:first-child {
			margin-right: 41px;
		}
	}

	.ant-dropdown-trigger {
		margin-left: 6px;
		color: white;
	}
`

export default AccountButton

import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { NavLink } from 'react-router-dom'
import { currentConfig } from '../../../constants/configs'
import AccountInfo from './AccountInfo'
import { Row, Menu, Dropdown, Button, Typography } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { useOpenModal } from '../../../state/application/hooks'
import { ApplicationModal } from '../../../state/application/actions'
import {
	network,
	NETWORK_NAMES,
	FRIENDLY_NETWORK_NAMES,
} from '../../../connectors'
import ThemeToggle from '../../ThemeToggle'
import { useWeb3React } from '@web3-react/core'
import useTranslation from '../../../hooks/useTranslation'

const StyledMenu = styled(Menu)`
	background: ${(props) => props.theme.secondary.background};
	padding: 10px;
`
const StyledLink = styled(NavLink)`
	font-weight: 400;
	text-decoration: none;
`
const MenuItem = styled(Menu.Item)`
	color: ${(props) => props.theme.primary.font};
	height: 38px;
	font-size: 18px;
`
const StyledSpan = styled.span`
	font-size: 18px;
	color: ${(props) => props.theme.primary.font};
`

const StyledSubMenu = styled(Menu.SubMenu)`
	height: 38px;
`

const MenuText = styled(Typography.Text)`
	display: block;
`

const ItemGroup = styled(Menu.ItemGroup)`
	height: 30px;
`

const Connect = styled(Menu.Item)`
	font-weight: bold;
	font-size: 1.3em;
	color: #016eac;
	display: flex;
	background-color: #f5f5f5;
	border-radius: 5px;
	&:hover {
		color: rgb(67, 210, 255);
	}
`
interface NavTabletProps {}

const NavTablet: React.FC<NavTabletProps> = () => {
	const translate = useTranslation()

	const { account, chainId, deactivate } = useWeb3Provider()
	const { activate } = useWeb3React('fallback')

	const networkName: string = useMemo(
		() => NETWORK_NAMES[chainId] || '',
		[chainId],
	)
	const friendlyNetworkName: string = useMemo(
		() => FRIENDLY_NETWORK_NAMES[chainId] || '',
		[chainId],
	)

	const openModal = useOpenModal(ApplicationModal['WALLET'])

	const handleSignOutClick = useCallback(() => {
		localStorage.setItem('signOut', account)
		deactivate()
		activate(network)
	}, [activate, deactivate, account])

	const vaults = useMemo(
		() => Object.keys(currentConfig(chainId).vaults),
		[chainId],
	)

	const currentPools = useMemo(
		() =>
			Object.values(currentConfig(chainId).pools).filter(
				(pool) => pool.active && !pool.legacy,
			),
		[chainId],
	)

	const menu = useMemo(
		() => (
			<StyledMenu>
				{!account ? (
					<Connect onClick={openModal}>
						{translate('Connect')}
					</Connect>
				) : (
					<AccountInfo
						account={account}
						networkName={networkName}
						friendlyNetworkName={friendlyNetworkName}
						mobile={true}
					/>
				)}
				<MenuItem key={'/'}>
					<StyledLink exact activeClassName="active" to="/">
						{translate('Overview')}
					</StyledLink>
				</MenuItem>

				<StyledSubMenu
					key={'/vault'}
					title={
						<StyledLink activeClassName="active" to="/vault">
							{translate('Vault')}{' '}
						</StyledLink>
					}
				>
					{vaults.map((vault) => (
						<Menu.Item key={`/vault/${vault}`}>
							<StyledLink
								activeClassName="active"
								to={`/vault/${vault}`}
							>
								<MenuText>{vault.toUpperCase()}</MenuText>
							</StyledLink>
						</Menu.Item>
					))}
				</StyledSubMenu>

				<StyledSubMenu
					key={'/liquidity'}
					title={<StyledSpan>{translate('Liquidity')}</StyledSpan>}
				>
					<ItemGroup title={translate('Provide Liquidity')} />
					{currentPools.map((farm) => (
						<MenuItem key={`/liquidity/${farm.lpAddress}`}>
							<StyledLink
								activeClassName="active"
								to={`/liquidity/${farm.lpAddress}`}
							>
								<MenuText>{farm.name}</MenuText>
							</StyledLink>
						</MenuItem>
					))}
				</StyledSubMenu>

				<MenuItem key={'/governance'}>
					<StyledLink activeClassName="active" to="/governance">
						{translate('Governance')}
					</StyledLink>
				</MenuItem>

				<Menu.Divider />
				<Row
					align="middle"
					justify="center"
					style={{ margin: '10px 0' }}
				>
					<ThemeToggle />
				</Row>

				<MenuItem>
					<a
						href="https://resources.yaxis.io/"
						rel="noopener noreferrer"
						target="_blank"
					>
						{translate('Help Center')}
					</a>
				</MenuItem>
				{!account ? (
					<></>
				) : (
					<MenuItem key="logout" onClick={handleSignOutClick}>
						{translate('Logout')}
					</MenuItem>
				)}
			</StyledMenu>
		),
		[
			translate,
			account,
			openModal,
			networkName,
			friendlyNetworkName,
			currentPools,
			handleSignOutClick,
		],
	)
	return (
		<Dropdown overlay={menu} trigger={['click']}>
			<Button
				size="large"
				type="default"
				ghost
				style={{ border: 'none' }}
				icon={<MenuOutlined style={{ fontSize: '30px' }} />}
			/>
		</Dropdown>
	)
}

export default NavTablet
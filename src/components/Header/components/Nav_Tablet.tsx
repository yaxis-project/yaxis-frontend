import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { NavLink } from 'react-router-dom'
import { currentConfig } from '../../../constants/configs'
import AccountInfo from './AccountInfo'
import { Row, Col, Dropdown, Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { useOpenModal } from '../../../state/application/hooks'
import { ApplicationModal } from '../../../state/application/actions'
import {
	network,
	NETWORK_NAMES,
	FRIENDLY_NETWORK_NAMES,
} from '../../../connectors'
import ThemeToggle from '../../ThemeToggle'
import NetworkSelect from '../components/NetworkSelect'
import { useWeb3React } from '@web3-react/core'
import useTranslation from '../../../hooks/useTranslation'
import Menu from '../../Menu'
import Typography from '../../Typography'

const { Text } = Typography

const NavTablet: React.FC = () => {
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
				<Row
					align="middle"
					justify="center"
					style={{ margin: '10px 0' }}
					gutter={10}
				>
					<Col>
						<NetworkSelect />
					</Col>
					<Col>
						<ThemeToggle />
					</Col>
				</Row>

				{!account ? (
					<Connect onClick={openModal}>
						{translate('Connect')}
					</Connect>
				) : (
					<AccountInfo
						account={account}
						friendlyNetworkName={friendlyNetworkName}
						mobile={true}
					/>
				)}
				<MenuItem key={'/'}>
					<StyledLink to="/">{translate('Overview')}</StyledLink>
				</MenuItem>

				<StyledSubMenu
					key={'/vault-menu'}
					title={<StyledSpan>{translate('Vault')}</StyledSpan>}
				>
					<Menu.Item>
						<StyledLink to={`/vault`}>
							<Row gutter={10} align="middle">
								<Col>
									<Text>{translate('Overview')}</Text>
								</Col>
							</Row>
						</StyledLink>
					</Menu.Item>
					{vaults.map((vault) => (
						<MenuItem key={`/vault/${vault}`}>
							<StyledLink to={`/vault/${vault}`}>
								<Text>{vault.toUpperCase()}</Text>
							</StyledLink>
						</MenuItem>
					))}
				</StyledSubMenu>

				<StyledSubMenu
					key={'/liquidity-menu'}
					title={<StyledSpan>{translate('Liquidity')}</StyledSpan>}
				>
					<Menu.Item>
						<StyledLink to={`/liquidity`}>
							<Row gutter={10} align="middle">
								<Col>
									<Text>{translate('Overview')}</Text>
								</Col>
							</Row>
						</StyledLink>
					</Menu.Item>
					{currentPools.map((farm) => (
						<MenuItem key={`/liquidity/${farm.lpAddress}`}>
							<StyledLink to={`/liquidity/${farm.lpAddress}`}>
								<Text>{farm.name}</Text>
							</StyledLink>
						</MenuItem>
					))}
				</StyledSubMenu>

				<MenuItem key={'/governance'}>
					<StyledLink to="/governance">
						{translate('Governance')}
					</StyledLink>
				</MenuItem>

				<Menu.Divider />

				<MenuItem key={'help-center'}>
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
			vaults,
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

const StyledMenu = styled(Menu.Menu)`
	background: ${(props) => props.theme.secondary.background};
	padding: 10px;
`
const StyledLink = styled(NavLink)`
	font-size: 18px;
	font-weight: 400;
	text-decoration: none;
	color: ${(props) => props.theme.primary.font} !important;
`
const MenuItem = styled(Menu.Item)`
	color: ${(props) => props.theme.primary.font};
	height: 38px;
	font-size: 18px;

	svg {
		fill: white;
	}
`
const StyledSpan = styled.span`
	font-size: 18px;
	color: ${(props) => props.theme.primary.font};
`

const StyledSubMenu = styled(Menu.SubMenu)`
	height: 38px;
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

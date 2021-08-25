import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Typography } from 'antd'
import styled from 'styled-components'
import { currentConfig } from '../../../constants/configs'
import { CaretDownFilled } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'

/**
 * Horizontal top navigation bar for the application.
 * @param props any
 */

const Nav: React.FC = () => {
	const { chainId } = useWeb3React()
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

	return (
		<StyledMenu
			mode="horizontal"
			defaultSelectedKeys={[window.location.pathname]}
		>
			<MenuItem key={'/'}>
				<StyledLink exact activeClassName="active" to="/">
					Overview
				</StyledLink>
			</MenuItem>

			<StyledSubMenu
				key={'/vault'}
				title={
					<StyledLink activeClassName="active" to="/vault">
						Vault <CaretDownFilled style={{ margin: 0 }} />
					</StyledLink>
				}
			>
				{vaults.map((vault) => (
					<Menu.Item key={`/vault/${vault}`}>
						<StyledLink
							activeClassName="active"
							to={`/vault/${vault}`}
						>
							<MenuText>
								{vault[0].toUpperCase()}
								{vault.slice(1)}
							</MenuText>
						</StyledLink>
					</Menu.Item>
				))}
			</StyledSubMenu>

			<StyledSubMenu
				key={'/liquidity'}
				title={
					<StyledLink activeClassName="active" to="/liquidity">
						Liquidity <CaretDownFilled style={{ margin: 0 }} />
					</StyledLink>
				}
			>
				<ItemGroup title="Provide Liquidity" />
				{currentPools.map((pool) => (
					<Menu.Item key={`/liquidity/${pool.lpAddress}`}>
						<StyledLink
							activeClassName="active"
							to={`/liquidity/${pool.lpAddress}`}
						>
							<MenuText>{pool.name}</MenuText>
						</StyledLink>
					</Menu.Item>
				))}
			</StyledSubMenu>

			<MenuItem key={'/governance'}>
				<StyledLink activeClassName="active" to="/governance">
					Governance
				</StyledLink>
			</MenuItem>
		</StyledMenu>
	)
}

const StyledMenu = styled(Menu)`
	border-bottom: none;
	background: none;
	display: inline-block;
`

const StyledSubMenu = styled(Menu.SubMenu)`
	height: 38px;
`

const MenuText = styled(Typography.Text)`
	display: block;
`

const MenuItem = styled(Menu.Item)`
	height: 38px;
`

const ItemGroup = styled(Menu.ItemGroup)`
	height: 30px;
`

const StyledLink = styled(NavLink)`
	color: ${(props) => props.theme.colors.white} !important;
	font-weight: 600;
	font-size: 18px;
	text-decoration: none;
`

export default Nav

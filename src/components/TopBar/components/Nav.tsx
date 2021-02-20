import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Typography } from 'antd'
import styled from 'styled-components'
import { currentConfig } from '../../../yaxis/configs'
import { CaretDownFilled } from '@ant-design/icons';

/**
 * Horizontal top navigation bar for the application.
 * @param props any
 */

const Nav: React.FC = (props) => {
	const activePools = currentConfig.pools.filter(pool => pool.active)
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

			<MenuItem key={'/investing'}>
				<StyledLink activeClassName="active" to="/investing">
					MetaVault
				</StyledLink>
			</MenuItem>

			<MenuItem key={'/savings'}>
				<StyledLink activeClassName="active" to="/savings">
					Staking
				</StyledLink>
			</MenuItem>

			<StyledSubMenu
				key={'/liquidity'}
				title={
					// TODO: to: /liquidity
					<StyledLink activeClassName="active" to="#" style={{ pointerEvents: "none" }}>
						Advanced <CaretDownFilled style={{ margin: 0 }} />
					</StyledLink>
				}
			>
				<ItemGroup title="Provide Liquidity" />
				{activePools.map(
					(farm) =>
						<Menu.Item key={`/liquidity/${farm.lpAddress}`}>
							<StyledLink activeClassName="active" to={`/liquidity/${farm.lpAddress}`}>
								<MenuText>{farm.name}</MenuText>
							</StyledLink>
						</Menu.Item  >
				)}
			</StyledSubMenu>
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
	color: ${(props) => props.theme.color.white} !important;
	font-weight: 400;
	font-size: 18px;
	text-decoration: none;
`

export default Nav

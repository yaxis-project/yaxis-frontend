import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Typography } from 'antd'
import styled from 'styled-components'
import useFarms from '../../../hooks/useFarms'
import { CaretDownFilled } from '@ant-design/icons';

const { Text } = Typography


/**
 * Horizontal top navigation bar for the application.
 * @param props any
 */

const Nav: React.FC = (props) => {
	const { farms } = useFarms()
	const activeFarms = farms.filter(farm => farm.active)
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
				{activeFarms.map(
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

const MenuText = styled(Text)`
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
	@media (max-width: 400px) {
	}
`

const StyledDropdown = styled.a`
	color: ${(props) => props.theme.color.white} !important;
	font-weight: 400;
	text-decoration: none;
	font-size: 18px;
	@media (max-width: 400px) {
	}
`

const StyledAbsoluteLink = styled.a`
	color: ${(props) => props.theme.color.white};
	font-weight: 700;
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	@media (max-width: 400px) {
		padding-left: ${(props) => props.theme.spacing[2]}px;
		padding-right: ${(props) => props.theme.spacing[2]}px;
	}
`

export default Nav

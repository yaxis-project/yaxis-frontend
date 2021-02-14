import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Dropdown, Typography } from 'antd'
import styled from 'styled-components'

const { Text } = Typography

/**
 * Horizontal top navigation bar for the application.
 * @param props any
 */
const Nav: React.FC = (props) => {
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

			<MenuItem key={'/liquidity'}>
				<Dropdown overlay={advancedMenu} placement="bottomLeft">
					<StyledDropdown>Advanced</StyledDropdown>
				</Dropdown>
			</MenuItem>
		</StyledMenu>
	)
}
const MenuItem = styled(Menu.Item)`
	height: 38px;
`
const StyledMenu = styled(Menu)`
	border-bottom: none;
	background: none;
	display: inline-block;
`

const StyledLink = styled(NavLink)`
	color: ${(props) => props.theme.color.white} !important;
	font-weight: 400;
	font-size: 18px;
	text-decoration: none;
	@media (max-width: 400px) {
	}
`

const StyledMenuLink = styled(NavLink)`
	color: ${(props) => props.theme.color.white} !important;
	text-decoration: none;
	@media (max-width: 400px) {
	}
`

const MenuText = styled(Text)`
	display: block;
`

const advancedMenu = (
	<Menu>
		<Menu.Item>
			<StyledMenuLink activeClassName="active" to="/liquidity">
				<>
					<MenuText type="secondary">Provide Liquidity</MenuText>
					<MenuText strong>YAX + ETH LINKSWAP LP</MenuText>
					<MenuText strong>YAX + ETH LINKSWAP LP</MenuText>
				</>
			</StyledMenuLink>
		</Menu.Item>
	</Menu>
)

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

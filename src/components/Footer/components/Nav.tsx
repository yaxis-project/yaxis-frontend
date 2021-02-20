import React from 'react'
import styled from 'styled-components'
import { Menu, Dropdown, Row, Col } from 'antd'
import { NavLink } from 'react-router-dom'
import blog from '../../../assets/img/icons/ghost.svg'
import discord from '../../../assets/img/icons/discord.svg'
import github from '../../../assets/img/icons/github.svg'
import twitter from '../../../assets/img/icons/twitter.svg'

const menu = (
	<Menu>
		<Menu.Item>
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://etherscan.io/address/0xc330e7e73717cd13fb6ba068ee871584cf8a194f#code"
			>
				yAxis Chef
			</a>
		</Menu.Item>
	</Menu>
)

const Nav: React.FC = () => {
	return (
		<StyledRow>
			<StyledCol xs={24} sm={12}>
				<StyledNavLink to="/">Home</StyledNavLink>
				<StyledWrapper>
					<Dropdown overlay={menu} placement="topLeft">
						<StyledLink>Contracts</StyledLink>
					</Dropdown>
				</StyledWrapper>
			</StyledCol>

			<StyledCol2 xs={24} sm={12}>
				<StyledLink target="_blank" href="https://yaxis.ghost.io">
					<img src={blog} height="20" alt="Blog Link" />
				</StyledLink>
				<StyledLink
					target="_blank"
					href="https://discord.gg/u8KZPCMJ6x"
				>
					<img src={discord} height="20" alt="Discord Link" />
				</StyledLink>
				<StyledLink
					target="_blank"
					href="https://github.com/yaxis-project"
				>
					<img src={github} height="20" alt="Github Link" />
				</StyledLink>
				<StyledLink
					target="_blank"
					href="https://twitter.com/yaxis_project"
				>
					<img src={twitter} height="20" alt="Twitter Link" />
				</StyledLink>
			</StyledCol2>
		</StyledRow>
	)
}

const StyledRow = styled(Row)`
	max-width: 1146px;
	margin: auto;
`
const StyledCol = styled(Col)`
	@media only screen and (max-width: 575px) {
		text-align: center;
	}
`

const StyledCol2 = styled(StyledCol)`
	text-align: right;

	@media only screen and (max-width: 575px) {
		margin-top: 26px;
	}
`

const StyledNavLink = styled(NavLink)`
	display: inline-block;
	color: ${(props) => props.theme.color.primary.main};
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	font-size: 18px;
`

const StyledLink = styled.a`
	display: inline-block;
	color: ${(props) => props.theme.color.primary.main};
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	font-size: 18px;
`

const StyledWrapper = styled.span`
	display: inline-block;
	color: ${(props) => props.theme.color.primary.main};
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	font-size: 18px;
`

export default Nav

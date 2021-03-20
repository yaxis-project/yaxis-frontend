import React from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import blog from '../../../assets/img/icons/ghost.svg'
import discord from '../../../assets/img/icons/discord.svg'
import github from '../../../assets/img/icons/github.svg'
import twitter from '../../../assets/img/icons/twitter.svg'
import quantstamp from '../../../assets/img/icons/quantstamp.svg'

// const menu = (
// 	<Menu>
// 		<Menu.Item>
// 			<a
// 				target="_blank"
// 				rel="noopener noreferrer"
// 				href="https://etherscan.io/address/0xc330e7e73717cd13fb6ba068ee871584cf8a194f#code"
// 			>
// 				yAxis Chef
// 			</a>
// 		</Menu.Item>
// 	</Menu>
// )

const Nav: React.FC = () => {
	return (
		<StyledRow>
			<StyledCol xs={24} sm={24} md={8}>
				{/* <StyledNavLink to="/">Home</StyledNavLink> */}
				{/* <StyledWrapper>
					<Dropdown overlay={menu} placement="topLeft">
						<StyledLink>Contracts</StyledLink>
					</Dropdown>
				</StyledWrapper> */}
				<StyledLink target="_blank" href="https://immunefi.com/bounty/yaxis/">Security</StyledLink>
				<StyledLink target="_blank" href="https://gov.yaxis.io">Governance</StyledLink>
			</StyledCol>

			<StyledCol2 xs={24} sm={24} md={8}>
				<StyledLinkButton target="_blank" href="https://certificate.quantstamp.com/full/meta-vault-v-2">
					Secured by <img src={quantstamp} height="17" alt="Quantstamp Audit Link" />
				</StyledLinkButton>
			</StyledCol2>

			<StyledCol3 xs={24} sm={24} md={8}>
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
			</StyledCol3>
		</StyledRow>
	)
}

const StyledRow = styled(Row)`
	max-width: 1146px;
	margin: auto;
`
const StyledCol = styled(Col)`
	@media only screen and (max-width: 767px) {
		text-align: center;
	}
`

const StyledCol2 = styled(StyledCol)`
	text-align: center;

	@media only screen and (max-width: 767px) {
		margin-top: 26px;
	}
`

const StyledCol3 = styled(StyledCol)`
	text-align: right;

	@media only screen and (max-width: 767px) {
		margin-top: 26px;
	}
`

// const StyledNavLink = styled(NavLink)`
// 	display: inline-block;
// 	color: ${(props) => props.theme.color.primary.main};
// 	padding-left: ${(props) => props.theme.spacing[3]}px;
// 	padding-right: ${(props) => props.theme.spacing[3]}px;
// 	text-decoration: none;
// 	font-size: 18px;
// `

const StyledLink = styled.a`
	display: inline-block;
	color: ${(props) => props.theme.color.primary.main};
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	font-size: 18px;
`

const StyledLinkButton = styled.a`
	padding: 10px ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	font-size: 12px;
	width: 100%;
	border: 1px solid grey;
	border-radius: 18px;
	text-align: center;

	&:hover{
		border: 1px solid ${(props) => props.theme.color.primary.hover};
	}
`

export default Nav

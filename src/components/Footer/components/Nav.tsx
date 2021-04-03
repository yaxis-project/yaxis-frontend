import React from 'react'
import styled from 'styled-components'
import { Row, Col, Grid } from 'antd'
import { ReactComponent as discord } from '../../../assets/img/icons/discord.svg'
import { ReactComponent as github } from '../../../assets/img/icons/github.svg'
import { ReactComponent as twitter } from '../../../assets/img/icons/twitter.svg'
import quantstamp from '../../../assets/img/icons/quantstamp.svg'
import Icon, { ReadOutlined } from '@ant-design/icons'
const { useBreakpoint } = Grid

const Nav: React.FC = () => {
	const { xs, sm } = useBreakpoint()
	return (
		<StyledRow align="middle">
			<StyledCol xs={24} sm={24} md={8}>
				<Row justify="center">
					<StyledLink
						target="_blank"
						href="https://resources.yaxis.io"
					>
						Resources
					</StyledLink>
					<StyledLink target="_blank" href="https://gov.yaxis.io/#/">
						Governance
					</StyledLink>
					<StyledLink
						target="_blank"
						href="https://immunefi.com/bounty/yaxis/"
					>
						Security
					</StyledLink>
				</Row>
				<Row justify="center" style={{ paddingTop: '10px' }}>
					<StyledLink
						target="_blank"
						href="https://trello.com/b/nkcEh9pc/yaxis-bounty-board-community"
					>
						We're Hiring!
					</StyledLink>
				</Row>
			</StyledCol>

			<StyledCol2 xs={24} sm={24} md={8}>
				<Row justify="center">
					<StyledLinkButton
						target="_blank"
						href="https://certificate.quantstamp.com/full/meta-vault-v-2"
					>
						Secured by{' '}
						<img
							src={quantstamp}
							height="17"
							alt="Quantstamp Audit Link"
						/>
					</StyledLinkButton>
				</Row>
			</StyledCol2>

			<StyledCol3 xs={24} sm={24} md={8}>
				<Row justify={xs || sm ? 'center' : 'end'}>
					<StyledLink target="_blank" href="https://yaxis.ghost.io">
						<ReadOutlined style={{ fontSize: '25px' }} />
					</StyledLink>
					<StyledLink
						target="_blank"
						href="https://discord.gg/u8KZPCMJ6x"
					>
						<HoverableIcon component={discord} />
					</StyledLink>
					<StyledLink
						target="_blank"
						href="https://github.com/yaxis-project"
					>
						<HoverableIcon component={github} />
					</StyledLink>
					<StyledLink
						target="_blank"
						href="https://twitter.com/yaxis_project"
					>
						<HoverableIcon component={twitter} />
					</StyledLink>
				</Row>
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

const HoverableIcon = styled(Icon)`
	font-size: 25px;
`

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
	width: 200px;
	border: 1px solid grey;
	border-radius: 18px;
	text-align: center;

	&:hover {
		border: 1px solid ${(props) => props.theme.color.primary.hover};
	}
`

export default Nav

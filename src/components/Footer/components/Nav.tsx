import React from 'react'
import styled from 'styled-components'
import { Row, Col, Grid } from 'antd'
import { ReactComponent as discord } from '../../../assets/img/icons/discord.svg'
import { ReactComponent as github } from '../../../assets/img/icons/github.svg'
import { ReactComponent as twitter } from '../../../assets/img/icons/twitter.svg'
import Icon, { MediumOutlined } from '@ant-design/icons'
import useTranslation from '../../../hooks/useTranslation'
const { useBreakpoint } = Grid

const Nav: React.FC = () => {
	const translate = useTranslation()
	const { xs, sm } = useBreakpoint()
	return (
		<StyledRow align="middle">
			<StyledCol xs={24} sm={24} md={9}>
				<Row justify="center">
					<StyledLink
						target="_blank"
						href="https://immunefi.com/bounty/yaxis/"
						rel="noopener noreferrer"
					>
						{translate('Security')}
					</StyledLink>
					<StyledLink
						target="_blank"
						href="https://trello.com/b/nkcEh9pc/yaxis-bounty-board-community"
						rel="noopener noreferrer"
					>
						{translate("We're Hiring")}!
					</StyledLink>
				</Row>
			</StyledCol>

			<StyledCol2 xs={24} sm={24} md={7}>
				<Row justify="center">
					<StyledLinkButton>
						<Row align="middle" justify="space-between">
							<Col span={24}>
								<span
									style={{
										color: '#5E5E63',
										fontSize: '12px',
									}}
								>
									{translate('Secured by').toUpperCase()}
								</span>
							</Col>
							<Col span={10}>
								<HaechiTitle
									target="_blank"
									href="https://github.com/yaxis-project/metavault/blob/main/audits/v3/Haechi-V3.pdf"
									rel="noopener noreferrer"
								>
									HAECHI
								</HaechiTitle>
							</Col>
							<Col span={1}>&amp;</Col>
							<Col span={13}>
								<C4Title
									target="_blank"
									href="https://code423n4.com/reports/2021-09-yaxis/"
									rel="noopener noreferrer"
								>
									Code 423n4
								</C4Title>
							</Col>
						</Row>
					</StyledLinkButton>
				</Row>
			</StyledCol2>

			<StyledCol3 xs={24} sm={24} md={8}>
				<Row justify={xs || sm ? 'center' : 'end'}>
					<StyledLink
						target="_blank"
						href="https://yaxis.medium.com/"
						rel="noopener noreferrer"
					>
						<MediumOutlined style={{ fontSize: '25px' }} />
					</StyledLink>
					<StyledLink
						target="_blank"
						href="https://discord.gg/yaxis-project"
						rel="noopener noreferrer"
					>
						<HoverableIcon component={discord} />
					</StyledLink>
					<StyledLink
						target="_blank"
						href="https://github.com/yaxis-project"
						rel="noopener noreferrer"
					>
						<HoverableIcon component={github} />
					</StyledLink>
					<StyledLink
						target="_blank"
						href="https://twitter.com/yaxis_project"
						rel="noopener noreferrer"
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

const HaechiTitle = styled.a`
	font-size: 18px;
	font-weight: 900;
	color: #2990c8;
`

const C4Title = styled.a`
	font-size: 14px;
	text-decoration: underline;
	color: #2990c8;
	line-height: 10px;
`

const StyledLink = styled.a`
	display: inline-block;
	color: ${(props) => props.theme.primary.main};
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	font-size: 18px;
	font-weight: 600;
`

const StyledLinkButton = styled.div`
	padding: 5px ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	font-size: 12px;
	width: 200px;
	border: 1px solid grey;
	border-radius: 25px;
	text-align: center;
	background: ${(props) => props.theme.colors.aliceBlue};

	&:hover {
		border: 1px solid ${(props) => props.theme.primary.hover};
	}
`

export default Nav

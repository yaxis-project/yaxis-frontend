import React from 'react'
import logo from '../../../assets/img/logo-ui.svg'
import { Row, Col, Typography, Card } from 'antd'
import styled from 'styled-components'

const { Text, Title } = Typography

interface AccountOverviewCardProps {
	loading: boolean
	mainTitle: string
	secondaryText: string
	value: string
	time: string
}

const StyledRiskBadge = styled.div`
	background: #bca52e;
	opacity: 0.6;
	color: white;
	display: inline-block;
	border-radius: 4px;
	padding: 3px 4px;
	font-size: 12px;
	margin-left: 16px;
	@media only screen and (max-width: 575px) {
		margin-left: 0;
	}
`
const StyledImage = styled.img`
@media only screen and (max-width: 575px) {
	margin-left: 50px;
}
`

const StyledCard = styled(Card)`
	margin-top: 10px;
`

const StyledTitle = styled.div`
	display: inline-block;
	font-size: 22px;
	font-style: normal;
	font-weight: 500;
	line-height: 29px;
	letter-spacing: 0em;
`

/**
 * Generates a generic card for overview data.
 * @param props AccountOverviewCardProps
 */
export default function AccountOverviewCard(props: AccountOverviewCardProps) {
	const { mainTitle, secondaryText, value, time } = props
	return (
		<StyledCard>
			<Row gutter={16}>
				<Col xs={6} sm={2} md={2} lg={3} >
					<StyledImage src={logo} height="36" alt="logo" />
				</Col>

				<Col xs={24} sm={21} md={14}>
					<Row style={{ display: 'flex', alignItems: 'center' }}>
						<Col>
							<StyledTitle style={{ margin: 0 }}>
								{mainTitle}
							</StyledTitle>
						</Col>
						<Col xs={24} sm={9}>
							{/* <StyledRiskBadge>LOWER RISK</StyledRiskBadge> */}
						</Col>
					</Row>
					<Row>
						<Text type="secondary">{secondaryText}</Text>
					</Row>
				</Col>
				<Col xs={24} sm={24} md={7}>
					<Row>
						<Text style={{ marginLeft: 'auto' }} type="secondary">
							{time}
						</Text>
					</Row>
					<Row>
						<Title
							style={{
								margin: 0,
								marginLeft: 'auto',
								fontSize: '22px',
							}}
							level={5}
						>
							{value}
						</Title>
					</Row>
				</Col>
			</Row>
		</StyledCard>
	)
}

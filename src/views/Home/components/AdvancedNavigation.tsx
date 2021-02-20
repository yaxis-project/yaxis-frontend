import React from 'react'
import styled from 'styled-components'
import { currentConfig } from '../../../yaxis/configs'
import { StakePool } from "../../../yaxis/type"
import { Row, Col, Typography, Collapse } from 'antd'
import * as currencies from '../../../utils/currencies'
import { brandBlue } from "../../../theme/colors"

const { Text, Link } = Typography

const { Panel } = Collapse

interface AdvancedNavigationRowProps {
	contextType: string
	data: StakePool
	to: string
}

const StyledRiskBadge = styled.div`
	background: #be3333;
	opacity: 0.6;
	color: white;
	display: inline-block;
	border-radius: 4px;
	padding: 4px;
	font-size: 10px;
	line-height: 10px;
	margin-left: 10px;
	height: 18px;
`

/**
 * Generates a row component styled with icons and a given linke.
 * @param props AdvancedNavigationRowProps
 */
function AdvancedNavigationRow(props: AdvancedNavigationRowProps) {
	const { contextType, data, to } = props
	const [token1, token2] = data.lpTokens
	return (
		<Row className="lp-row" justify="center">
			<Col xs={24} sm={3} style={{ margin: "10px" }}>
				<img src={currencies[token1.symbol]?.icon} height="24" alt="logo" />
				<img src={currencies[token2.symbol]?.icon} height="24" alt="logo" />
			</Col>
			<Col xs={24} sm={20}>
				<Row>
					<Text type="secondary">{contextType}</Text>
					<StyledRiskBadge>HIGHER RISK</StyledRiskBadge>
				</Row>
				<Row>
					<Link href={to} style={{ color: brandBlue }}>
						{data.name} →
					</Link>
				</Row>
			</Col>
		</Row>
	)
}

const StyledCollapse = styled(Collapse)`
	background-color: #ffffff;
	margin-top: 10px;
`

/**
 * Styled component to contain a collapsable navigation segment.
 * @see AdvancedNavigationRow
 */
export default function AdvancedNavigation() {
	const activePools = currentConfig?.pools.filter(pool => pool?.active)

	return activePools.length > 0 ? (
		<StyledCollapse
			expandIconPosition="right"
			className="advanced-navigation"
		>
			<Panel
				header={'Advanced'}
				key="1"
			>
				{activePools.map((pool) => (
					<AdvancedNavigationRow
						key={pool.name}
						contextType="Provide Liquidity"
						data={pool}
						to={`/liquidity/${pool.lpAddress}`}
					/>
				))}
			</Panel>
		</StyledCollapse>
	) : null
}

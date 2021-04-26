import { currentConfig } from '../../../constants/configs'
import { LiquidityPool } from '../../../constants/type'
import { Row, Col, Typography, Collapse } from 'antd'
import { Currencies } from '../../../constants/currencies'
import { brandBlue } from '../../../theme/colors'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { NavLink } from 'react-router-dom'

const { Text } = Typography

const { Panel } = Collapse

interface AdvancedNavigationRowProps {
	contextType: string
	data: LiquidityPool
	to: string
}

// const StyledRiskBadge = styled.div`
// 	background: #be3333;
// 	opacity: 0.6;
// 	color: white;
// 	display: inline-block;
// 	border-radius: 4px;
// 	padding: 4px;
// 	font-size: 10px;
// 	line-height: 10px;
// 	margin-left: 10px;
// 	height: 18px;
// `

/**
 * Generates a row component styled with icons and a given linke.
 * @param props AdvancedNavigationRowProps
 */

function AdvancedNavigationRow(props: AdvancedNavigationRowProps) {
	const { contextType, data, to } = props
	const [token1, token2] = data.lpTokens
	return (
		<Row className="lp-row" justify="center">
			<Col xs={24} sm={3} style={{ margin: '8px' }}>
				<img
					src={Currencies[token1.tokenId.toUpperCase()]?.icon}
					height="24"
					alt="logo"
				/>
				<img
					src={Currencies[token2.tokenId.toUpperCase()]?.icon}
					height="24"
					alt="logo"
				/>
			</Col>
			<Col xs={24} sm={20}>
				<Row>
					<Text type="secondary">{contextType}</Text>
					{/* <StyledRiskBadge>HIGHER RISK</StyledRiskBadge> */}
				</Row>
				<Row>
					<NavLink to={to} style={{ color: brandBlue }}>
						{data.name} →
					</NavLink>
				</Row>
			</Col>
		</Row>
	)
}

/**
 * Styled component to contain a collapsable navigation segment.
 * @see AdvancedNavigationRow
 */
export default function AdvancedNavigation() {
	const { chainId } = useWeb3Provider()

	const activePools = Object.values(currentConfig(chainId)?.pools).filter(
		(pool) => pool?.active,
	)

	return activePools.length > 0 ? (
		<Collapse expandIconPosition="right">
			<Panel header={'Liquidity Pools'} key="1">
				{activePools.map((pool) => (
					<AdvancedNavigationRow
						key={pool.name}
						contextType="Provide Liquidity"
						data={pool}
						to={`/liquidity/${pool.lpAddress}`}
					/>
				))}
			</Panel>
		</Collapse>
	) : null
}

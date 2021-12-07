import styled from 'styled-components'
import { currentConfig } from '../../../constants/configs'
import { LiquidityPool } from '../../../constants/type'
import { Row, Col, Collapse, Grid } from 'antd'
import { Currencies } from '../../../constants/currencies'
import { brandBlue } from '../../../theme/colors'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { NavLink } from 'react-router-dom'
import Typography from '../../../components/Typography'
import logo from '../../../assets/img/logo-ui.svg'
import { useLPsBalance } from '../../../state/wallet/hooks'
import { formatBN } from '../../../utils/number'
import BigNumber from 'bignumber.js'
import useTranslation from '../../../hooks/useTranslation'

const { Panel } = Collapse
const { useBreakpoint } = Grid
const { Text, Title } = Typography

interface AdvancedNavigationRowProps {
	balance: BigNumber
	data: LiquidityPool
	to: string
}

const StyledCollapse = styled(Collapse)`
	background: ${(props) => props.theme.secondary.background};
	border-color: ${(props) => props.theme.secondary.border};

	.ant-collapse-item {
		.ant-collapse-header {
			padding: 26px 22px;
			font-size: 22px;
		}
	}

	svg {
		fill: ${(props) => props.theme.primary.font};
	}
`

const StyledRow = styled(Row)`
	background: ${(props) => props.theme.secondary.background};
	padding: 18px 22px;
	align-items: center;
`

const StyledNavLink = styled(NavLink)`
	font-size: 18px;
`

const StyledImage = styled.img`
	position: absolute;
	left: 15px;
`

/**
 * Generates a row component styled with icons and a given linke.
 * @param props AdvancedNavigationRowProps
 */

function AdvancedNavigationRow(props: AdvancedNavigationRowProps) {
	const { data, to, balance } = props

	const [token1, token2] = data.lpTokens
	return (
		<StyledRow justify="center">
			<Col xs={24} sm={3} style={{ margin: '8px' }}>
				<img
					src={Currencies[token1.tokenId.toUpperCase()]?.icon}
					height="24"
					alt="logo"
				/>
				<StyledImage
					src={Currencies[token2.tokenId.toUpperCase()]?.icon}
					height="24"
					alt="logo"
				/>
			</Col>
			<Col xs={24} sm={14}>
				<Row>
					<StyledNavLink to={to} style={{ color: brandBlue }}>
						{data.name} →
					</StyledNavLink>
				</Row>
			</Col>
			<Col xs={24} sm={6}>
				<Text>{'$' + formatBN(balance)}</Text>
			</Col>
		</StyledRow>
	)
}

/**
 * Styled component to contain a collapsable navigation segment.
 * @see AdvancedNavigationRow
 */
export default function LPAccountOverview() {
	const { xs } = useBreakpoint()
	const translate = useTranslation()

	const { chainId } = useWeb3Provider()

	const balances = useLPsBalance()

	const currentPools = Object.values(currentConfig(chainId).pools).filter(
		(pool) => pool.active && !pool.legacy,
	)

	return currentPools.length > 0 ? (
		<StyledCollapse expandIconPosition="right">
			<Panel
				header={
					<Row gutter={16} align="middle" justify={'space-between'}>
						<Col xs={24} sm={13}>
							<Row
								align="middle"
								gutter={12}
								justify={xs ? 'center' : 'start'}
							>
								<Col xs={24} sm={4}>
									<Row justify="center">
										<img
											src={logo}
											height="32"
											width="36"
											alt="logo"
										/>
									</Row>
								</Col>
								<Col>
									<Row>
										<Title level={4} style={{ margin: 0 }}>
											{translate('Liquidity Pools')}
										</Title>
									</Row>
								</Col>
							</Row>
						</Col>

						<Col xs={24} sm={6}>
							<Row justify={xs ? 'center' : 'start'}>
								<Title level={4} style={{ margin: 0 }}>
									{'$' + formatBN(balances.total.usd)}
								</Title>
							</Row>
						</Col>
					</Row>
					///
				}
				key="1"
			>
				{currentPools.map((pool) => (
					<AdvancedNavigationRow
						key={pool.name}
						balance={balances[pool.name].usd}
						data={pool}
						to={`/liquidity/${pool.lpAddress}`}
					/>
				))}
			</Panel>
		</StyledCollapse>
	) : null
}

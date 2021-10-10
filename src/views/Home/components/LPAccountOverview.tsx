import styled from 'styled-components'
import { currentConfig } from '../../../constants/configs'
import { LiquidityPool } from '../../../constants/type'
import { Row, Col, Collapse } from 'antd'
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

const { Text, Title } = Typography

interface AccountOverviewCardProps {
	loading: boolean
	mainTitle: string
	secondaryText: string
	value: string
}

const StyledImage2 = styled.img`
	@media only screen and (max-width: 575px) {
		margin-left: 50px;
	}
`

const StyledTitle = styled.div`
	display: inline-block;
	font-size: 22px;
	font-style: normal;
	font-weight: 600;
	line-height: 29px;
	letter-spacing: 0em;
	color: ${(props) => props.theme.primary.font};
`

interface AdvancedNavigationRowProps {
	balance: BigNumber
	data: LiquidityPool
	to: string
}

const StyledCollapse = styled(Collapse)`
	background: ${(props) => props.theme.secondary.background};
	border-color: ${(props) => props.theme.secondary.border};

	svg {
		fill: ${(props) => props.theme.primary.font};
	}
`

const StyledPanelTitle = styled.span`
	color: ${(props) => props.theme.primary.font};
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
					<Row gutter={16}>
						<Col xs={6} sm={2} md={2} lg={3}>
							<StyledImage2 src={logo} height="36" alt="logo" />
						</Col>

						<Col xs={24} sm={21} md={14}>
							<Row
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Col>
									<StyledTitle style={{ margin: 0 }}>
										{translate('Liquidity Pools')}
									</StyledTitle>
								</Col>
							</Row>
						</Col>
						<Col xs={24} sm={24} md={7}>
							<Row>
								<Title
									style={{
										margin: 0,
										fontSize: '22px',
									}}
									level={5}
								>
									{'$' + formatBN(balances.total.usd)}
								</Title>
							</Row>
						</Col>
					</Row>
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

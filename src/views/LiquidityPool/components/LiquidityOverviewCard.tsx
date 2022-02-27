import Card from '../../../components/Card'
import styled from 'styled-components'
import CardRow from '../../../components/CardRow'
import { Tooltip, Row } from 'antd'
import Value from '../../../components/Value'
import Typography from '../../../components/Typography'
import { useAPY } from '../../../state/internal/hooks'
import { useWalletLP } from '../../../state/wallet/hooks'
import { LiquidityPool } from '../../../constants/type'
import Claim from '../../../components/Claim'
import LegacyClaim from './LegacyClaim'
import APYCalculator from '../../../components/APYCalculator'
import BigNumber from 'bignumber.js'
import { InfoCircleOutlined } from '@ant-design/icons'
import useTranslation from '../../../hooks/useTranslation'

const { Text } = Typography

interface LiquidityOverviewCardProps {
	pool: LiquidityPool
	totalUSDBalance: BigNumber
}

interface TooltipRowProps {
	main: string
	value: any
	suffix?: string
}

const TooltipRow = ({ main, value, suffix }: TooltipRowProps) => (
	<>
		<div
			style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
		>
			{main}
		</div>
		<Row>
			<Value
				value={value}
				numberSuffix="%"
				decimals={2}
				color={'white'}
			/>
			<span style={{ fontSize: '10px' }}>{suffix}</span>
		</Row>
	</>
)

/**
 * Shows details of the liquidity pools locked in the system.
 */
const LiquidityOverviewCard: React.FC<LiquidityOverviewCardProps> = ({
	pool,
	totalUSDBalance,
}) => {
	const translate = useTranslation()

	const { yaxisAprPercent } = useAPY(pool?.rewards)
	const { poolShare } = useWalletLP(pool.name)

	return (
		<Card title={translate('Overview')} icon="yaxis">
			{pool?.legacy ? (
				<LegacyClaim pool={pool} />
			) : (
				<Claim rewardsContract={pool.rewards} />
			)}
			<CardRow
				main={translate('Share of Pool')}
				secondary={
					<Value
						value={poolShare.times(100).toNumber()}
						numberSuffix="%"
						decimals={2}
					/>
				}
			/>
			<CardRow
				main={
					<Tooltip
						title={
							<>
								<Row style={{ marginBottom: '5px' }}>
									{translate('Annual Percentage Rate')}
								</Row>
								<TooltipRow
									main={translate('YAXIS rewards APR') + ':'}
									value={yaxisAprPercent.toNumber()}
								/>
							</>
						}
					>
						<Text type="secondary">{translate('Total APR')} </Text>
						<StyledInfoIcon alt={translate('YAXIS Rewards')} />
					</Tooltip>
				}
				secondary={
					<Value
						value={yaxisAprPercent.toNumber()}
						numberSuffix="%"
						decimals={2}
					/>
				}
				rightContent={
					<>
						<Row>
							<Tooltip
								title={
									<>
										<Row style={{ marginBottom: '5px' }}>
											{translate(
												'Annual Percentage Yield',
											)}
										</Row>
										<TooltipRow
											main={
												translate('YAXIS rewards APY') +
												':'
											}
											value={yaxisAprPercent
												.div(100)
												.dividedBy(12)
												.plus(1)
												.pow(12)
												.minus(1)
												.multipliedBy(100)
												.toNumber()}
											suffix={
												'* ' +
												translate('monthly compound')
											}
										/>
									</>
								}
							>
								<Text type="secondary">
									{translate('Total APY')}{' '}
								</Text>
								<StyledInfoIcon
									alt={translate('YAXIS Rewards')}
								/>
							</Tooltip>
						</Row>
						<Row>
							<Value
								value={yaxisAprPercent
									.div(100)
									.dividedBy(12)
									.plus(1)
									.pow(12)
									.minus(1)
									.multipliedBy(100)
									.toNumber()}
								numberSuffix={'%'}
								decimals={2}
							/>
						</Row>
					</>
				}
			/>
			<APYCalculator
				APR={yaxisAprPercent.toNumber()}
				balance={totalUSDBalance}
				loading={false}
				page={'lp'}
				last
			/>
		</Card>
	)
}

export default LiquidityOverviewCard

const StyledInfoIcon = styled(InfoCircleOutlined)`
	margin-left: 5px;
	color: ${(props) => props.theme.secondary.font};
	font-size: 15px;
`

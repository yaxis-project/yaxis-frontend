import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { CardRow } from '../../../components/ExpandableSidePanel'
import { Typography, Tooltip, Row } from 'antd'
import Value from '../../../components/Value'
import { useAPY } from '../../../state/internal/hooks'
import { useAccountLP } from '../../../state/wallet/hooks'

import { LiquidityPool } from '../../../constants/type'
import Claim from '../../../components/Claim'
import LegacyClaim from './LegacyClaim'
import APYCalculator from '../../../components/APYCalculator'
import BigNumber from 'bignumber.js'
import info from '../../../assets/img/info.svg'

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
			<Value value={value} numberSuffix="%" decimals={2} />
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
	const { yaxisAprPercent } = useAPY(pool?.rewards)

	const { poolShare } = useAccountLP(pool)

	return (
		<DetailOverviewCard title="Overview">
			{pool?.legacy ? (
				<LegacyClaim pool={pool} />
			) : (
				<Claim rewardsContract={pool.rewards} />
			)}
			<CardRow
				main="Share of Pool"
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
									Annual Percentage Rate
								</Row>
								<TooltipRow
									main={'YAXIS rewards APR:'}
									value={yaxisAprPercent.toNumber()}
								/>
							</>
						}
					>
						<Text type="secondary">Total APR </Text>
						<img
							style={{ position: 'relative', top: -1 }}
							src={info}
							height="15"
							alt="YAXIS Supply Rewards"
						/>
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
											Annual Percentage Yield
										</Row>
										<TooltipRow
											main={'YAXIS rewards APY:'}
											value={yaxisAprPercent
												.div(100)
												.dividedBy(12)
												.plus(1)
												.pow(12)
												.minus(1)
												.multipliedBy(100)
												.toNumber()}
											suffix={'* monthly compound'}
										/>
									</>
								}
							>
								<Text type="secondary">Total APY </Text>
								<img
									style={{ position: 'relative', top: -1 }}
									src={info}
									height="15"
									alt="YAXIS Supply Rewards"
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
			/>
		</DetailOverviewCard>
	)
}

export default LiquidityOverviewCard

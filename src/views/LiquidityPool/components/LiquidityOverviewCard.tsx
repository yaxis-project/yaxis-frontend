import { useState } from 'react'
import { Col } from 'antd'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { CardRow } from '../../../components/ExpandableSidePanel'
// import useAccountReturns from '../../../hooks/useAccountReturns'
import Value from '../../../components/Value'
import Button from '../../../components/Button'
import RewardAPYTooltip from '../../../components/Tooltip/Tooltips/RewardAPYTooltip'
import Tooltip from '../../../components/Tooltip'
import useLPFarmAPY from '../hooks/useLPFarmAPY'
import useMyLiquidity from '../../../hooks/useMyLiquidity'
import { StakePool } from '../../../yaxis/type'
import useEarnings from '../../../hooks/useEarnings'
import useReward from '../../../hooks/useReward'
import { getBalanceNumber } from '../../../utils/formatBalance'

interface LiquidityOverviewCardProps {
	pool: StakePool
}

/**
 * Shows details of the liquidity pools locked in the system.
 */
export default function LiquidityOverviewCard(
	props: LiquidityOverviewCardProps,
) {
	const { pool } = props

	const lpFarmAPY = useLPFarmAPY(pool.symbol)
	const { userPoolShare } = useMyLiquidity(pool)
	const earnings = useEarnings(pool.pid)
	const { loading, error, onReward } = useReward(pool.pid)
	const [claimVisible, setClaimVisible] = useState(false)

	return (
		<DetailOverviewCard title="Overview">
			<CardRow
				main="Return"
				secondary={
					<Value
						value={getBalanceNumber(earnings)}
						numberSuffix=" YAXIS"
						decimals={2}
					/>
				}
				rightContent={
					<Col xs={12} sm={12} md={12}>
						<Tooltip title={error}>
							<RewardAPYTooltip visible={claimVisible} title="">
								<Button
									disabled={!earnings.toNumber()}
									onClick={() =>
										onReward(setClaimVisible(true))
									}
									loading={loading}
									height={'40px'}
								>
									Claim
								</Button>
							</RewardAPYTooltip>
						</Tooltip>
					</Col>
				}
			/>
			<CardRow
				main="Share of Pool"
				secondary={
					<Value
						value={userPoolShare.times(100).toNumber()}
						numberSuffix="%"
						decimals={2}
					/>
				}
			/>

			<CardRow
				main={
					// pool.symbol === 'YAX/ETH LINKSWAP LP' ? (
					// 	<Tooltip
					// 		title={
					// 			'Reward emissions have ended. Still gathering fees.'
					// 		}
					// 		visible={true}
					// 		placement={'right'}
					// 	>
					// 		Average APY
					// 	</Tooltip>
					// ) : (
					'Average APY'
					// )
				}
				secondary={
					<Value
						value={lpFarmAPY.toNumber()}
						numberSuffix="%"
						decimals={2}
					/>
				}
			/>
		</DetailOverviewCard>
	)
}

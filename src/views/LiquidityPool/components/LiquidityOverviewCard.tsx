import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { CardRow } from '../../../components/ExpandableSidePanel'
// import useAccountReturns from '../../../hooks/useAccountReturns'
import Value from '../../../components/Value'
import useLPFarmAPY from '../hooks/useLPFarmAPY'
import useMyLiquidity from '../../../hooks/useMyLiquidity'
import { StakePool } from '../../../yaxis/type'
import Claim from '../../../components/Claim'
import LegacyClaim from './LegacyClaim'
import APYCalculator from '../../../components/APYCalculator'
import BigNumber from 'bignumber.js'

interface LiquidityOverviewCardProps {
	pool: StakePool
	totalUSDBalance: BigNumber
}

/**
 * Shows details of the liquidity pools locked in the system.
 */
const LiquidityOverviewCard: React.FC<LiquidityOverviewCardProps> = ({
	pool,
	totalUSDBalance,
}) => {
	const lpFarmAPY = useLPFarmAPY(pool.symbol)
	const { userPoolShare } = useMyLiquidity(pool)

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
			<APYCalculator
				APY={lpFarmAPY.toNumber()}
				balance={totalUSDBalance}
			/>
		</DetailOverviewCard>
	)
}

export default LiquidityOverviewCard

import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { CardRow } from '../../../components/ExpandableSidePanel'
// import useAccountReturns from '../../../hooks/useAccountReturns'
import Value from '../../../components/Value'
import useLPFarmAPY from '../hooks/useLPFarmAPY'
import useMyLiquidity from '../../../hooks/useMyLiquidity'
import { StakePool } from '../../../yaxis/type'
import Claim from './Claim'
import LegacyClaim from './LegacyClaim'

interface LiquidityOverviewCardProps {
	pool: StakePool
}

/**
 * Shows details of the liquidity pools locked in the system.
 */
const LiquidityOverviewCard: React.FC<LiquidityOverviewCardProps> = ({
	pool,
}) => {
	const lpFarmAPY = useLPFarmAPY(pool.symbol)
	const { userPoolShare } = useMyLiquidity(pool)

	return (
		<DetailOverviewCard title="Overview">
			{pool?.legacy ? <LegacyClaim pool={pool} /> : <Claim pool={pool} />}
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
				main="Average APY"
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

export default LiquidityOverviewCard

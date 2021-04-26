import React from 'react'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import Value from '../../../components/Value'
import { CardRow } from '../../../components/ExpandableSidePanel'
import { LiquidityPool } from '../../../constants/type'
import { useLP } from '../../../state/external/hooks'

type Props = {
	pool: LiquidityPool
}

/**
 * Shows details of the liquidity pools locked in the system.
 */
const PairStatsCard: React.FC<Props> = ({ pool }) => {
	const { reserves, tvl, lpTokens } = useLP(pool.name)

	return (
		<DetailOverviewCard title="Pool Stats">
			<CardRow
				main="Total Value Locked"
				secondary={
					<Value
						value={tvl.toNumber()}
						numberPrefix="$"
						decimals={2}
					/>
				}
			/>

			{/* TODO: Volume */}
			{/* <CardRow 
					main="Volume (24h)" 
					secondary={
						<Value 
							value={'[TBD]'} 
							numberPrefix="$" 
							decimals={2} 
						/>
					}
				/>*/}
			<CardRow
				main="Pooled Tokens"
				secondary={
					<>
						<Value
							value={Number(reserves?.['_reserve0']?.toFixed(2))}
							decimals={0}
							numberSuffix={` ${lpTokens?.[0]?.name}`}
						/>
						<Value
							value={Number(reserves?.['_reserve1']?.toFixed(2))}
							decimals={0}
							numberSuffix={` ${lpTokens?.[1]?.name}`}
						/>
					</>
				}
			/>
		</DetailOverviewCard>
	)
}

export default PairStatsCard

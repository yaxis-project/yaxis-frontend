import React from 'react'
import Card from '../../../components/Card'
import Value from '../../../components/Value'
import CardRow from '../../../components/CardRow'
import { LiquidityPool } from '../../../constants/type'
import { useLiquidityPool } from '../../../state/external/hooks'
import useTranslation from '../../../hooks/useTranslation'

type Props = {
	pool: LiquidityPool
}

/**
 * Shows details of the liquidity pools locked in the system.
 */
const PairStatsCard: React.FC<Props> = ({ pool }) => {
	const translate = useTranslation()

	const { reserves, tvl, lpTokens } = useLiquidityPool(pool.name)

	return (
		<Card title={translate('Pool Stats')} icon="verticalbars">
			<CardRow
				main={translate('Total Value Locked')}
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
					<Value value={'[TBD]'} numberPrefix="$" decimals={2} />
				}
			/> */}
			<CardRow
				main={translate('Pooled Tokens')}
				secondary={
					<>
						<Value
							value={reserves[0].toNumber()}
							decimals={0}
							numberSuffix={` ${lpTokens?.[0]?.name}`}
						/>
						<Value
							value={reserves[1].toNumber()}
							decimals={0}
							numberSuffix={` ${lpTokens?.[1]?.name}`}
						/>
					</>
				}
				last
			/>
		</Card>
	)
}

export default PairStatsCard

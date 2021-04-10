import React, { useState, useEffect } from 'react'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import useFarm from '../../../hooks/useFarm'
import Value from '../../../components/Value'
import { CardRow } from '../../../components/ExpandableSidePanel'
// import useLPContractData from '../../../hooks/useLPContractData'
import useFarms from '../../../hooks/useFarms'
import { BigNumber } from 'bignumber.js'
import { defaultStakedValue, StakedValue } from '../../../contexts/Farms/types'

type Props = {
	farmID: string
}

/**
 * Shows details of the liquidity pools locked in the system.
 */
const LiquidityOverviewCard: React.FC<Props> = ({ farmID }) => {
	const props = useFarm(farmID)
	const [stakedValue, setStakedValue] = useState<StakedValue>(
		defaultStakedValue,
	)
	const { stakedValues } = useFarms()

	useEffect(() => {
		const stakedValue = stakedValues.find((farm) => farm.id === farmID)
		if (stakedValue) {
			setStakedValue(stakedValue)
		}
	}, [stakedValues, farmID])

	return (
		<DetailOverviewCard title="Pool Stats">
			<CardRow
				main="Total Value Locked"
				secondary={
					<Value
						value={new BigNumber(stakedValue.tvl).toNumber()}
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
						{props?.lpTokens[0] && (
							<Value
								value={stakedValue?.reserve[0]}
								decimals={0}
								numberSuffix={` ${props?.lpTokens[0].symbol}`}
							/>
						)}
						{props?.lpTokens[1] && (
							<Value
								value={stakedValue?.reserve[1]}
								decimals={0}
								numberSuffix={` ${props?.lpTokens[1].symbol}`}
							/>
						)}
					</>
				}
			/>
		</DetailOverviewCard>
	)
}

export default LiquidityOverviewCard

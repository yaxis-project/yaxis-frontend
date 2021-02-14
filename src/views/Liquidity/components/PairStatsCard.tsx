import React, { useState, useEffect } from 'react'
import { Typography } from 'antd'
import { UNI_ETH_YAX_LP } from '../../../utils/currencies'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import useFarm from '../../../hooks/useFarm'
import Value from '../../../components/Value'
import useLPContractData from '../../../hooks/useLPContractData'
import useFarms from '../../../hooks/useFarms'
import { BigNumber } from 'bignumber.js'
import { defaultStakedValue, StakedValue } from '../../../contexts/Farms/types'

const { Text } = Typography

/**
 * Shows details of the liquidity pools locked in the system.
 */
export default function LiquidityOverviewCard() {
	const props = useFarm('YAX')

	const [stakedValue, setStakedValue] = useState<StakedValue>(
		defaultStakedValue,
	)
	const {
		farmData: { pid },
	} = useLPContractData('YAX', UNI_ETH_YAX_LP)

	const { stakedValues } = useFarms()

	useEffect(() => {
		const stakedValue = stakedValues.find((farm) => farm.pid === pid)
		if (stakedValue) {
			setStakedValue(stakedValue)
		}
	}, [stakedValues, pid])

	return (
		<DetailOverviewCard title="Pair Stats">
			<DetailOverviewCardRow>
				<Text>Total Value Locked</Text>
				<Value
					value={new BigNumber(stakedValue.tvl).toNumber()}
					numberPrefix="$"
					decimals={2}
				/>
			</DetailOverviewCardRow>
			<DetailOverviewCardRow>
				<Text>Volume (24h)</Text>
				<Value value={'[TBD]'} numberPrefix="$" decimals={2} />
			</DetailOverviewCardRow>
			<DetailOverviewCardRow>
				<Text>Pooled Tokens</Text>
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
			</DetailOverviewCardRow>
		</DetailOverviewCard>
	)
}

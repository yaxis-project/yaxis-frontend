import React from 'react'
import { Typography } from 'antd'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import useAccountReturns from '../../../hooks/useAccountReturns'
import Value from '../../../components/Value'
import useLPFarmAPY from '../hooks/useLPFarmAPY'
import useMyLiquidity from '../../../hooks/useMyLiquidity'

const { Text } = Typography

interface LiquidityOverviewCardProps {
	farmID: string
}

/**
 * Shows details of the liquidity pools locked in the system.
 */
export default function LiquidityOverviewCard(
	props: LiquidityOverviewCardProps,
) {
	const { farmID } = props
	const { yaxReturns } = useAccountReturns()

	const lpFarmAPY = useLPFarmAPY(farmID)
	const farmAPY = lpFarmAPY.div(53).toFixed(2)

	const { userPoolShare } = useMyLiquidity(farmID)

	return (
		<DetailOverviewCard title="Overview">
			<DetailOverviewCardRow>
				<Text>Returns</Text>
				<Value
					value={"TBD"}
					// value={yaxReturns} 
					numberSuffix=" YAX" decimals={2} />
			</DetailOverviewCardRow>
			<DetailOverviewCardRow>
				<Text>Share of Pool</Text>
				<Value
					value={userPoolShare.toNumber()}
					numberSuffix="%"
					decimals={2}
				/>
			</DetailOverviewCardRow>
			<DetailOverviewCardRow>
				<Text>Weekly Average APY</Text>
				<Value value={farmAPY} numberSuffix="%" decimals={2} />
			</DetailOverviewCardRow>
		</DetailOverviewCard>
	)
}

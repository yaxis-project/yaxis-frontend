import BigNumber from 'bignumber.js'
import useFarms from '../../../hooks/useFarms'
import { useMemo } from 'react'
import useLPContractData from '../../../hooks/useLPContractData'
import { getApy } from '../../../utils/number'
import { getYaxisPrice } from '../../../yaxis/utils'
import useRewardPerBlock from '../../../hooks/useRewardPerBlock'

/**
 * Returns farm APY
 */

// TODO: support non-uni pools
export default function useLPFarmAPY(farmID: string) {
	const { farms, stakedValues } = useFarms()
	const yaxisPrice = getYaxisPrice(stakedValues, farms)
	const rewardPerBlock = useRewardPerBlock()
	const {
		farmData: { pid },
	} = useLPContractData(farmID)
	return useMemo(() => {
		let stakedValue = stakedValues.find((value) => value.pid === pid)
		let poolWeight = stakedValue?.poolWeight?.toNumber() ?? 0
		let farmApy = getApy(
			stakedValue?.tvl,
			yaxisPrice.toNumber(),
			rewardPerBlock,
			poolWeight,
		)
		return new BigNumber(farmApy || '0')
	}, [stakedValues, yaxisPrice, rewardPerBlock, pid])
}

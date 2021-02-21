import { useState, useEffect, useCallback } from 'react'
import useFarms from './useFarms'
import BigNumber from 'bignumber.js'
import useMetaVaultData from './useMetaVaultData'
import usePriceMap from './usePriceMap'
import useYaxis from './useYaxis'
// import useBlock from './useBlock'
import { getTotalStaking } from '../yaxis/utils'

/**
 * Compute the TVL in the Metavault system using current farms and data.
 */
export default function useComputeTVL() {
	const { metaVaultData } = useMetaVaultData('v1')

	const [totalValues, setTotalValues] = useState({
		stakingTvl: new BigNumber(0),
		liquidityTvl: new BigNumber(0),
		metavaultTvl: new BigNumber(0),
		tvl: new BigNumber(0),
		yaxisPrice: new BigNumber(0),
		// pricePerFullShare: new BigNumber(0),
	})

	const { farms, stakedValues } = useFarms()
	// const block = useBlock()
	const yaxis = useYaxis()
	const { YAX: yaxisPrice } = usePriceMap()

	const fetchData = useCallback(async () => {
		const stakedSupply = await getTotalStaking(yaxis)
		const stakingTvl = new BigNumber(stakedSupply)
			.div(1e18)
			.times(yaxisPrice)
		const liquidityTvl = new BigNumber(
			farms.reduce((c, { active }, i) => {
				return (
					c +
					(active && stakedValues.length > 0
						? stakedValues[i].tvl || 0
						: 0)
				)
			}, 0),
		)
		const metavaultTvl = new BigNumber(metaVaultData?.tvl || 0)
		setTotalValues({
			stakingTvl,
			liquidityTvl,
			metavaultTvl,
			tvl: stakingTvl.plus(liquidityTvl).plus(metavaultTvl),
			yaxisPrice: new BigNumber(yaxisPrice),
			// pricePerFullShare,
		})
	}, [farms, metaVaultData, stakedValues, yaxis, yaxisPrice])

	useEffect(() => {
		if (yaxis && stakedValues && farms) fetchData()
	}, [stakedValues, farms, yaxis, fetchData])

	return totalValues
}

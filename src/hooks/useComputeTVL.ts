import { useState, useEffect, useCallback } from 'react'
import useFarms from './useFarms'
import BigNumber from 'bignumber.js'
import useMetaVaultData from './useMetaVaultData'
import usePriceMap from './usePriceMap'
import useGlobal from './useGlobal'
import useContractRead from './useContractRead'
// import { getTotalStaking } from '../yaxis/utils'

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
	const { yaxis, block } = useGlobal()
	const { ETH, YAXIS } = usePriceMap()

	const {
		data: reserves,
	} = useContractRead({
		contractName: `pools.0.lpContract`,
		method: 'getReserves()',
	})

	const {
		data: stakedSupply,
	} = useContractRead({
		contractName: `rewards.Yaxis`,
		method: 'totalSupply',
	})

	const fetchData = useCallback(async () => {
		let yaxisPrice = new BigNumber(YAXIS)
		const { _reserve0, _reserve1 } = reserves
		let t0 = new BigNumber(_reserve0)
		let t1 = new BigNumber(_reserve1)
		if (t0.gt(0) && t1.gt(0)) {
			t0 = t0.dividedBy(10 ** 18)
			t1 = t1.dividedBy(10 ** 18)
			yaxisPrice = t1.dividedBy(t0).multipliedBy(ETH)
		}
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
	}, [farms, metaVaultData, stakedValues, ETH, YAXIS, reserves, stakedSupply])

	useEffect(() => {
		if (yaxis && stakedValues && farms && reserves) fetchData()
	}, [stakedValues, farms, yaxis, fetchData, block, reserves])

	return totalValues
}

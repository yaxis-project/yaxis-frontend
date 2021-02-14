import BigNumber from 'bignumber.js'
import useYAxisAPY from './useYAxisAPY'
import useMetaVaultData from './useMetaVaultData'
import { useMemo } from 'react'

/**
 * Computes the annual profits for the Yaxis system.
 */
export default function useComputeAnnualProfits(): string {
	const { yAxisAPY } = useYAxisAPY()
	const { metaVaultData } = useMetaVaultData('v1')
	return useMemo(() => {
		if (!yAxisAPY || !yAxisAPY['3crv'] || !metaVaultData?.tvl)
			return new BigNumber(0).toFixed()
		const threeCrvApyPercent = new BigNumber(yAxisAPY['3crv'])
		const sumApy = new BigNumber(threeCrvApyPercent)
			.div(100)
			.multipliedBy(0.2)
		return sumApy
			.div(365)
			.plus(1)
			.pow(365)
			.minus(1)
			.times(metaVaultData?.tvl || 0)
			.toFixed()
	}, [yAxisAPY, yAxisAPY['3crv'], metaVaultData])
}

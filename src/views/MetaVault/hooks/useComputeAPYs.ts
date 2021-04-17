import {
	useEffect,
	useState,
	// , useCallback
} from 'react'
// import useYaxis from '../../../hooks/useYaxis'
// import usePriceMap from '../../../hooks/usePriceMap'
// import useStaking from '../../../hooks/useStaking'
import useYAxisAPY from '../../../hooks/useYAxisAPY'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
// import { getTotalStaking } from '../../../yaxis/utils'
import BigNumber from 'bignumber.js'
import { getCurveApyApi } from '../../../yaxis/utils'

/**
 * Computes the total generated APY across all stablecoin yield farms.
 */
export default function useComputeAPYs() {
	// const [totalApy, setTotalAPY] = useState<BigNumber>(new BigNumber(0))
	// const yaxis = useYaxis()
	// const priceMap = usePriceMap()
	// const { stakingData } = useStaking()
	const { yAxisAPY, isInitialized } = useYAxisAPY()
	const { metaVaultData } = useMetaVaultData('v1')

	const [curveApy, setCurveApy] = useState<number>(0)
	const [curveApyIsInitialized, setCurveApyIsInitialized] = useState<boolean>(
		false,
	)

	useEffect(() => {
		const fetchCurveApy = async () => {
			const value = await getCurveApyApi()
			setCurveApy(value)
			setCurveApyIsInitialized(true)
		}
		fetchCurveApy()
	}, [setCurveApy])

	/* TODO: hook up new rewards APY */
	// const yaxApyPercent = new BigNumber(metaVaultData?.apy || 0)
	const yaxApyPercent = new BigNumber(0)

	const pickleApyPercent = new BigNumber(0) // new BigNumber(pickleAPY).multipliedBy(0.8)
	const lpApyPercent = new BigNumber(curveApy).times(100)
	const threeCrvApyPercent = new BigNumber(
		(yAxisAPY && yAxisAPY['3crv']) || 0,
	).multipliedBy(0.8)

	const totalPickleApy = new BigNumber(pickleApyPercent)
		.plus(lpApyPercent)
		.plus(threeCrvApyPercent)
	const pickleApy = totalPickleApy
		.div(100)
		.div(365)
		.plus(1)
		.pow(365)
		.minus(1)
		.times(100)
		.decimalPlaces(18)
	const totalAPR = yaxApyPercent.plus(totalPickleApy)
	const totalAPY = yaxApyPercent.plus(pickleApy)

	const loadingAPY =
		!isInitialized ||
		!curveApyIsInitialized ||
		typeof metaVaultData?.initialized === 'undefined'

	// const setAPY = useCallback(async () => {
	// 	try {
	// 		const totalSupply = await getTotalStaking(yaxis)
	// 		const threeCrvApyPercent = new BigNumber(
	// 			(yAxisAPY && yAxisAPY['3crv']) || 0,
	// 		)
	// 		const totalValueLocked =
	// 			new BigNumber(totalSupply)
	// 				.div(1e18)
	// 				.times(priceMap?.YAXIS)
	// 				.toNumber() || 0
	// 		const sumApy = new BigNumber(threeCrvApyPercent)
	// 			.div(100)
	// 			.multipliedBy(0.2)
	// 		const annualProfits = sumApy
	// 			.div(365)
	// 			.plus(1)
	// 			.pow(365)
	// 			.minus(1)
	// 			.times(metaVaultData?.tvl || 0)
	// 		let metavaultAPY = new BigNumber(annualProfits)
	// 			.dividedBy(totalValueLocked || 1)
	// 			.multipliedBy(100)
	// 		const value = await yaxis.contracts.xYaxStaking.methods
	// 			.getPricePerFullShare()
	// 			.call()
	// 		const pricePerFullShare = new BigNumber(value).div(1e18)
	// 		const yaxAPY = new BigNumber(stakingData?.incentiveApy || 0)
	// 			.div(pricePerFullShare)
	// 			.div(100)
	// 		setTotalAPY(yaxAPY.plus(metavaultAPY))
	// 	} catch (e) {}
	// }, [metaVaultData, priceMap, stakingData, yAxisAPY, yaxis])

	// useEffect(() => {
	// 	setAPY()
	// }, [setAPY])

	return {
		threeCrvApyPercent,
		yaxApyPercent,
		lpApyPercent,
		totalAPY,
		totalAPR,
		loadingAPY,
	}
}

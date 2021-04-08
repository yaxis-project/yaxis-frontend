import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import useGlobal from './useGlobal'
import { collapseDecimals, numberToFloat } from '../yaxis/utils'
import usePriceMap from './usePriceMap'
import { getApy } from '../utils/number'

const usePickle = () => {
	const [pickle, setPickle] = useState<{
		pickleAPY: number
	}>({
		pickleAPY: 0,
	})
	const { yaxis, block } = useGlobal()
	let { PICKLE: picklePrice, Cure3Crv: _3crvPrice } = usePriceMap()
	let pickleChef = yaxis?.contracts?.pickleChef
	let pickleJar = yaxis?.contracts?.pickleJar
	const fetchPickle = useCallback(async () => {
		const [
			poolInfo,
			totalAllocPoint,
			picklePerBlock,
			multiplier,
			ratio,
			balance,
		]: any[] = await Promise.all([
			pickleChef.methods.poolInfo(14).call(),
			pickleChef.methods.totalAllocPoint().call(),
			pickleChef.methods.picklePerBlock().call(),
			pickleChef.methods.getMultiplier(block, block + 1).call(),
			pickleJar.methods.getRatio().call(),
			pickleJar.methods.balanceOf(pickleChef.options.address).call(),
		])
		const tvl =
			numberToFloat(balance, 18) * numberToFloat(ratio, 18) * _3crvPrice
		const rewardPerBlock = Number(
			collapseDecimals(
				new BigNumber(picklePerBlock).times(multiplier),
				18,
			),
		)
		let poolWeight = new BigNumber(poolInfo.allocPoint)
			.dividedBy(totalAllocPoint)
			.toNumber()
		let farmApy = getApy(tvl, picklePrice, rewardPerBlock, poolWeight)
		setPickle({
			pickleAPY: farmApy,
		})
	}, [pickleChef, pickleJar, block, _3crvPrice, picklePrice])

	useEffect(() => {
		if (
			yaxis &&
			yaxis.contracts &&
			pickleChef &&
			pickleJar &&
			picklePrice &&
			_3crvPrice
		) {
			fetchPickle()
		}
	}, [
		yaxis,
		pickleJar,
		pickleChef,
		setPickle,
		block,
		picklePrice,
		_3crvPrice,
		fetchPickle,
	])
	return pickle
}

export default usePickle

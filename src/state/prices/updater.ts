import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../index'
import { updatePrices } from './actions'
import { useSingleCallResult } from '../onchain/hooks'
import { getCoinGeckoPrices } from './utils'
import { useContracts } from '../../contexts/Contracts'
import BigNumber from 'bignumber.js'

export default function Updater(): null {
	const dispatch = useDispatch<AppDispatch>()
	const { contracts } = useContracts()

	const YaxisEthLP = useMemo(() => contracts?.pools['Uniswap YAXIS/ETH'], [
		contracts,
	])

	const { result } = useSingleCallResult(
		YaxisEthLP?.lpContract,
		'getReserves',
	)

	useEffect(() => {
		if (result) {
			const getPrices = async () => {
				const prices = await getCoinGeckoPrices()
				let yaxisPrice = new BigNumber(0)
				const { _reserve0, _reserve1 } = result
				let t0 = new BigNumber(_reserve0)
				let t1 = new BigNumber(_reserve1)
				if (t0.gt(0) && t1.gt(0)) {
					t0 = t0.dividedBy(10 ** 18)
					t1 = t1.dividedBy(10 ** 18)
					yaxisPrice = t1.dividedBy(t0).multipliedBy(prices.eth)
				}
				if (!yaxisPrice.isZero()) prices.yaxis = yaxisPrice.toNumber()
				dispatch(updatePrices({ prices }))
			}

			getPrices()

			const interval = setInterval(async () => {
				getPrices()
			}, 5 * 60 * 1000)

			return () => clearInterval(interval)
		}
	}, [dispatch, result])

	return null
}

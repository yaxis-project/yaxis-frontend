import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../index'
import { updatePrices } from './actions'
import { useSingleCallResult } from '../onchain/hooks'
import { useCrvLPPrices } from '../external/hooks'
import { getCoinGeckoPrices } from './utils'
import { useContracts } from '../../contexts/Contracts'
import BigNumber from 'bignumber.js'

export default function Updater(): null {
	const dispatch = useDispatch<AppDispatch>()
	const { contracts } = useContracts()

	const YaxisEthLP = useMemo(
		() => contracts?.pools['Uniswap YAXIS/ETH'],
		[contracts],
	)

	const { result } = useSingleCallResult(
		YaxisEthLP?.lpContract,
		'getReserves',
	)

	const crvPrices = useCrvLPPrices()

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
				if (yaxisPrice.gt(0)) prices.yaxis = yaxisPrice.toNumber()

				if (crvPrices?.['mim3crv']?.gt(0)) prices.mim3crv = 0
				if (crvPrices?.['rencrv']?.gt(0)) prices.rencrv = 0
				if (crvPrices?.['alethcrv']?.gt(0)) prices.alethcrv = 0
				if (crvPrices?.['linkcrv']?.gt(0)) prices.linkcrv = 0

				dispatch(updatePrices({ prices }))
			}

			getPrices()

			const interval = setInterval(async () => {
				getPrices()
			}, 5 * 60 * 1000)

			return () => clearInterval(interval)
		}
	}, [dispatch, result, crvPrices])

	return null
}

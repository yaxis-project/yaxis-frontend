import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updatePrices } from './actions'
import { useSingleCallResult } from '../onchain/hooks'
import { getCoinGeckoPrices } from './utils'
import { useContracts } from '../../contexts/Contracts'
import BigNumber from 'bignumber.js'

export default function Updater(): void {
	const dispatch = useDispatch<AppDispatch>()
	const state = useSelector<AppState, AppState['prices']>(
		(state) => state.prices,
	)

	const { contracts } = useContracts()

	useEffect(() => {
		const getPrices = async () => {
			const prices = await getCoinGeckoPrices()
			dispatch(updatePrices({ prices }))
		}

		getPrices()

		const interval = setInterval(async () => {
			getPrices()
		}, 1 * 60 * 1000)

		return () => clearInterval(interval)
	}, [dispatch])

	const YaxisEthLP = useMemo(
		() => contracts?.pools['Uniswap YAXIS/ETH'],
		[contracts],
	)

	const { result } = useSingleCallResult(
		YaxisEthLP?.lpContract,
		'getReserves',
	)

	useEffect(() => {
		if (result) {
			// Fill YAXIS price from Uniswap Liqudiity Pool
			let yaxisPrice = new BigNumber(0)
			const { _reserve0, _reserve1 } = result
			let t0 = new BigNumber(_reserve0)
			let t1 = new BigNumber(_reserve1)
			if (t0.gt(0) && t1.gt(0)) {
				t0 = t0.dividedBy(10 ** 18)
				t1 = t1.dividedBy(10 ** 18)
				yaxisPrice = t1.dividedBy(t0).multipliedBy(state.prices.eth)
			}
			if (yaxisPrice.gt(0))
				dispatch(
					updatePrices({ prices: { yaxis: yaxisPrice.toNumber() } }),
				)
		}
	}, [dispatch, result, state.prices.eth])

	// TODO: switch to reading from curve LP config in case vault decouples from LP token
	// DO for all
	const mim3crvLP = useMemo(() => contracts?.vaults['usd'], [contracts])

	const { result: mim3crvResult } = useSingleCallResult(
		mim3crvLP?.tokenPool,
		'get_virtual_price()',
	)

	useEffect(() => {
		const mim3crvPrice = new BigNumber(mim3crvResult?.toString() || 0)
		// Fill curve LP token prices from Curve Liqudiity Pools
		if (mim3crvPrice.gt(0))
			dispatch(
				updatePrices({
					prices: {
						mim3crv: mim3crvPrice.dividedBy(10 ** 18).toNumber(),
					},
				}),
			)
	}, [dispatch, mim3crvResult])

	const rencrvLP = useMemo(() => contracts?.vaults['btc'], [contracts])

	const { result: rencrvResult } = useSingleCallResult(
		rencrvLP?.tokenPool,
		'get_virtual_price()',
	)

	useEffect(() => {
		const rencrvPrice = new BigNumber(rencrvResult?.toString() || 0)
		// Fill curve LP token prices from Curve Liqudiity Pools
		if (rencrvPrice.gt(0))
			dispatch(
				updatePrices({
					prices: {
						rencrv: rencrvPrice
							.dividedBy(10 ** 18)
							.multipliedBy(state.prices.wbtc)
							.toNumber(),
					},
				}),
			)
	}, [dispatch, rencrvResult, state.prices.wbtc])

	const alethcrvLP = useMemo(() => contracts?.vaults['eth'], [contracts])

	const { result: alethcrvResult } = useSingleCallResult(
		alethcrvLP?.tokenPool,
		'get_virtual_price()',
	)

	useEffect(() => {
		const alethcrvPrice = new BigNumber(alethcrvResult?.toString() || 0)
		// Fill curve LP token prices from Curve Liqudiity Pools
		if (alethcrvPrice.gt(0))
			dispatch(
				updatePrices({
					prices: {
						alethcrv: alethcrvPrice
							.dividedBy(10 ** 18)
							.multipliedBy(state.prices.eth)
							.toNumber(),
					},
				}),
			)
	}, [dispatch, alethcrvResult, state.prices.eth])

	const linkcrvLP = useMemo(() => contracts?.vaults['link'], [contracts])

	const { result: linkcrvResult } = useSingleCallResult(
		linkcrvLP?.tokenPool,
		'get_virtual_price()',
	)

	useEffect(() => {
		const linkcrvPrice = new BigNumber(linkcrvResult?.toString() || 0)
		// Fill curve LP token prices from Curve Liqudiity Pools
		if (linkcrvPrice.gt(0))
			dispatch(
				updatePrices({
					prices: {
						linkcrv: linkcrvPrice
							.dividedBy(10 ** 18)
							.multipliedBy(state.prices.link)
							.toNumber(),
					},
				}),
			)
	}, [dispatch, linkcrvResult, state.prices.link])

	const crvcvxLP = useMemo(() => contracts?.vaults['cvx'], [contracts])

	const { result: crvcvxResult } = useSingleCallResult(
		crvcvxLP?.tokenPool,
		'get_virtual_price()',
	)

	useEffect(() => {
		const crvcvxPrice = new BigNumber(crvcvxResult?.toString() || 0)
		// Fill curve LP token prices from Curve Liqudiity Pools
		if (crvcvxPrice.gt(0))
			dispatch(
				updatePrices({
					prices: {
						crvcvxeth: crvcvxPrice
							.dividedBy(10 ** 18)
							.multipliedBy(state.prices.cvx)
							.toNumber(),
					},
				}),
			)
	}, [dispatch, crvcvxResult, state.prices.cvx])

	const tricryptoLP = useMemo(() => contracts?.vaults['link'], [contracts])

	const { result: tricryptoResult } = useSingleCallResult(
		tricryptoLP?.tokenPool,
		'get_virtual_price()',
	)

	useEffect(() => {
		const tricryptoPrice = new BigNumber(tricryptoResult?.toString() || 0)
		// Fill curve LP token prices from Curve Liqudiity Pools
		if (tricryptoPrice.gt(0))
			dispatch(
				updatePrices({
					prices: {
						crv3crypto: tricryptoPrice
							.dividedBy(10 ** 18)
							.multipliedBy(state.prices.link) // TODO
							.toNumber(),
					},
				}),
			)
	}, [dispatch, tricryptoResult, state.prices.link])

	const fraxLP = useMemo(() => contracts?.vaults['link'], [contracts])

	const { result: fraxResult } = useSingleCallResult(
		fraxLP?.tokenPool,
		'get_virtual_price()',
	)

	useEffect(() => {
		const fraxPrice = new BigNumber(fraxResult?.toString() || 0)
		// Fill curve LP token prices from Curve Liqudiity Pools
		if (fraxPrice.gt(0))
			dispatch(
				updatePrices({
					prices: {
						frax: fraxPrice
							.dividedBy(10 ** 18)
							.multipliedBy(state.prices.frax)
							.toNumber(),
					},
				}),
			)
	}, [dispatch, fraxResult, state.prices.frax])
}

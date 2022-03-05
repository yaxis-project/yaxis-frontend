import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updatePrices } from './actions'
import {
	useSingleCallResult,
	useSingleContractMultipleMethods,
} from '../onchain/hooks'
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
			let t0 = new BigNumber(_reserve0?.toString() || 0)
			let t1 = new BigNumber(_reserve1?.toString() || 0)
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

	const crvcvxResult = useSingleContractMultipleMethods(crvcvxLP?.tokenPool, [
		['get_virtual_price()'],
		['balances', [0]],
		['balances', [1]],
	])

	const [crvcvxVP, crvcvxBalance0, crvcvxBalance1] = useMemo(
		() =>
			crvcvxResult.map(({ result, loading }) => {
				if (loading) return new BigNumber(0)
				if (!result) return new BigNumber(0)
				return result.toString()
			}),
		[crvcvxResult],
	)

	const { result: supplyOfCrvcvx } = useSingleCallResult(
		crvcvxLP?.token.contract,
		'totalSupply',
	)

	useEffect(() => {
		// Fill curve LP token prices from Curve Liqudiity Pools
		const supply = new BigNumber(supplyOfCrvcvx?.toString() || 0)

		const weth = new BigNumber(crvcvxBalance0)
			.dividedBy(10 ** 18)
			.multipliedBy(state.prices.weth)
		const cvx = new BigNumber(crvcvxBalance1)
			.dividedBy(10 ** 18)
			.multipliedBy(state.prices.cvx)
		const total = cvx.plus(weth)

		if (new BigNumber(crvcvxVP).gt(0))
			dispatch(
				updatePrices({
					prices: {
						crvcvxeth: total
							.dividedBy(supply.dividedBy(10 ** 18))
							.multipliedBy(
								new BigNumber(crvcvxVP).dividedBy(10 ** 18),
							)
							.toNumber(),
					},
				}),
			)
	}, [
		dispatch,
		state.prices.cvx,
		state.prices.weth,
		crvcvxVP,
		crvcvxBalance0,
		crvcvxBalance1,
		supplyOfCrvcvx,
	])

	const tricryptoLP = useMemo(
		() => contracts?.vaults['tricrypto'],
		[contracts],
	)

	const tricryptoResult = useSingleContractMultipleMethods(
		tricryptoLP?.tokenPool,
		[
			['get_virtual_price()'],
			['balances', [0]],
			['balances', [1]],
			['balances', [2]],
		],
	)

	const [
		tricryptoVP,
		tricryptoBalance0,
		tricryptoBalance1,
		tricryptoBalance2,
	] = useMemo(
		() =>
			tricryptoResult.map(({ result, loading }) => {
				if (loading) return new BigNumber(0)
				if (!result) return new BigNumber(0)
				return result.toString()
			}),
		[tricryptoResult],
	)

	const { result: supplyOfTriCrypto } = useSingleCallResult(
		tricryptoLP?.token.contract,
		'totalSupply',
	)

	useEffect(() => {
		// Fill curve LP token prices from Curve Liqudiity Pools
		const supply = new BigNumber(supplyOfTriCrypto?.toString() || 0)

		const tether = new BigNumber(tricryptoBalance0)
			.dividedBy(10 ** 6)
			.multipliedBy(state.prices.usdt)
		const wbtc = new BigNumber(tricryptoBalance1)
			.dividedBy(10 ** 8)
			.multipliedBy(state.prices.wbtc)
		const weth = new BigNumber(tricryptoBalance2)
			.dividedBy(10 ** 18)
			.multipliedBy(state.prices.weth)
		const total = tether.plus(wbtc).plus(weth)

		if (new BigNumber(tricryptoVP).gt(0))
			dispatch(
				updatePrices({
					prices: {
						crv3crypto: total
							.dividedBy(supply.dividedBy(10 ** 18))
							.multipliedBy(
								new BigNumber(tricryptoVP).dividedBy(10 ** 18),
							)
							.toNumber(),
					},
				}),
			)
	}, [
		dispatch,
		supplyOfTriCrypto,
		tricryptoVP,
		tricryptoBalance0,
		tricryptoBalance1,
		tricryptoBalance2,
		state.prices.usdt,
		state.prices.wbtc,
		state.prices.weth,
	])

	const fraxLP = useMemo(() => contracts?.vaults['frax'], [contracts])

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
						frax3crv: fraxPrice
							.dividedBy(10 ** 18)
							.multipliedBy(state.prices.frax)
							.toNumber(),
					},
				}),
			)
	}, [dispatch, fraxResult, state.prices.frax])

	/** AVALANCHE */

	const atricryptoLP = useMemo(
		() => contracts?.vaults['atricrypto'],
		[contracts],
	)

	const atricryptoResult = useSingleContractMultipleMethods(
		atricryptoLP?.tokenPool,
		[
			['get_virtual_price()'],
			['balances', [0]],
			['balances', [1]],
			['balances', [2]],
		],
	)

	const [
		atricryptoVP,
		atricryptoBalance0,
		atricryptoBalance1,
		atricryptoBalance2,
	] = useMemo(
		() =>
			atricryptoResult.map(({ result, loading }) => {
				if (loading) return new BigNumber(0)
				if (!result) return new BigNumber(0)
				return result.toString()
			}),
		[atricryptoResult],
	)

	const { result: supplyOfATriCrypto } = useSingleCallResult(
		atricryptoLP?.token.contract,
		'totalSupply',
	)

	useEffect(() => {
		// Fill curve LP token prices from Curve Liqudiity Pools
		const supply = new BigNumber(supplyOfATriCrypto?.toString() || 0)
		const av3crv = new BigNumber(atricryptoBalance0)
			.dividedBy(10 ** 18)
			.multipliedBy(state.prices['3crv'])
		const wbtc = new BigNumber(atricryptoBalance1)
			.dividedBy(10 ** 8)
			.multipliedBy(state.prices.wbtc)
		const weth = new BigNumber(atricryptoBalance2)
			.dividedBy(10 ** 18)
			.multipliedBy(state.prices.weth)
		const total = av3crv.plus(wbtc).plus(weth)
		// TODO: get avalanche prices
		if (new BigNumber(atricryptoVP).gt(0))
			dispatch(
				updatePrices({
					prices: {
						atricrypto: total
							.dividedBy(supply.dividedBy(10 ** 18))
							.multipliedBy(
								new BigNumber(atricryptoVP).dividedBy(10 ** 18),
							)
							.toNumber(),
					},
				}),
			)
	}, [
		dispatch,
		supplyOfATriCrypto,
		atricryptoVP,
		atricryptoBalance0,
		atricryptoBalance1,
		atricryptoBalance2,
		state.prices.usdt,
		state.prices.wbtc,
		state.prices.weth,
	])

	const av3crvLP = useMemo(() => contracts?.vaults['av3crv'], [contracts])

	const { result: av3crvResult } = useSingleCallResult(
		av3crvLP?.tokenPool,
		'get_virtual_price()',
	)

	useEffect(() => {
		const av3crvVP = new BigNumber(av3crvResult?.toString() || 0)
		// Fill curve LP token prices from Curve Liqudiity Pools
		if (av3crvVP.gt(0))
			dispatch(
				updatePrices({
					prices: {
						av3crv: av3crvVP
							.dividedBy(10 ** 18)
							.multipliedBy(state.prices['3crv'])
							.toNumber(),
					},
				}),
			)
	}, [dispatch, av3crvResult, state.prices['3crv']])

	const joewavaxLP = useMemo(() => contracts?.vaults['joewavax'], [contracts])

	const joewavaxResult = useSingleContractMultipleMethods(
		joewavaxLP?.token.contract,
		[['getReserves'], ['totalSupply']],
	)

	const [joewavaxReserve0, joewavaxReserve1] = useMemo(() => {
		const [{ result: joewavaxReserves }] = joewavaxResult
		return joewavaxReserves
			? [
					joewavaxReserves[0]?.toString() || '0',
					joewavaxReserves[1]?.toString() || '0',
			  ]
			: ['0', '0']
	}, [joewavaxResult])

	const joewavaxTotalSupply = useMemo(() => {
		const [, { result: joewavaxTotalSupply }] = joewavaxResult
		return joewavaxTotalSupply
			? joewavaxTotalSupply[0]?.toString() ?? '0'
			: '0'
	}, [joewavaxResult])

	useEffect(() => {
		// Fill curve LP token prices from Curve Liqudiity Pools
		const supply = new BigNumber(joewavaxTotalSupply)
		const supplyA = supply.isZero()
			? new BigNumber(0)
			: supply.dividedBy(10 ** 18)

		const joe = new BigNumber(joewavaxReserve0)
			.dividedBy(10 ** 18)
			.multipliedBy(state.prices.joe)
		const wavax = new BigNumber(joewavaxReserve1)
			.dividedBy(10 ** 18)
			.multipliedBy(state.prices.wavax)
		const total = joe.plus(wavax)

		const joewavax = total.dividedBy(supplyA)

		if (joewavax.gt(0))
			dispatch(
				updatePrices({
					prices: {
						joewavax: joewavax.toNumber(),
					},
				}),
			)
	}, [
		dispatch,
		state.prices.joe,
		state.prices.wavax,
		joewavaxReserve0,
		joewavaxReserve1,
		joewavaxTotalSupply,
	])
}

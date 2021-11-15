import { useMemo, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useContracts } from '../../contexts/Contracts'
import {
	decodedGauges,
	gaugeController_address,
	gauge_relative_weight,
	poolInfo,
	CurvePools,
} from '../../constants/configs'
import { TLiquidityPools } from '../../constants/type'
import { usePrices } from '../prices/hooks'
import {
	useSingleCallResult,
	useSingleContractMultipleMethods,
	useMultipleContractSingleData,
} from '../onchain/hooks'
import BigNumber from 'bignumber.js'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { currentConfig } from '../../constants/configs'
import { abis } from '../../constants/abis/mainnet'
import { Interface } from '@ethersproject/abi'
const CURVE_POOL_INTERFACE = new Interface(abis.CurvePoolABI)

const defaultApys = Object.fromEntries(CurvePools.map((p) => [p, 0]))

export function useCurveRewardsAPR() {
	const { contracts } = useContracts()
	const multicall = useMemo(() => contracts?.external.multicall, [contracts])

	const AbiCoder = useMemo(() => new ethers.utils.AbiCoder(), [])

	const {
		prices: { crv, btc },
	} = usePrices()

	const weights = useMemo(
		() =>
			decodedGauges.map((gauge) => [
				gaugeController_address,
				gauge_relative_weight + gauge.slice(2),
			]),
		[],
	)
	const weightCalls = useSingleCallResult(multicall, 'aggregate', [weights])

	const decodedWeights = useMemo(() => {
		return (
			weightCalls.result?.[1]?.map((hex, i: number) => {
				return [
					weightCalls.result[0],
					hex === '0x'
						? 0
						: (AbiCoder.decode(['uint256'], hex) as any) / 1e18,
				]
			}) || []
		)
	}, [weightCalls, AbiCoder])

	const rateCalls = useSingleCallResult(multicall, 'aggregate', [
		decodedGauges
			.map((gauge) => [
				[gauge, '0x180692d0'],
				[gauge, '0x17e28089'],
			])
			.flat(),
	])

	const decodedRates = useMemo(() => {
		return (
			rateCalls?.result?.[1]?.map((hex) => {
				return hex === '0x' ? 0 : AbiCoder.decode(['uint256'], hex)
			}) || []
		)
	}, [rateCalls, AbiCoder])

	const virtualPrices = useMemo(
		() => Object.values(poolInfo).map((v) => [v.swap, '0xbb7b8b80']),
		[],
	)
	const virtualPriceCalls = useSingleCallResult(multicall, 'aggregate', [
		virtualPrices,
	])

	const decodedVirtualPrices = useMemo(() => {
		return (
			virtualPriceCalls?.result?.[1]?.map((hex, i: number) => [
				virtualPrices[i][0],
				hex === '0x'
					? 0
					: (AbiCoder.decode(['uint256'], hex) as any) / 1e18,
			]) || []
		)
	}, [virtualPrices, virtualPriceCalls, AbiCoder])

	return useMemo(() => {
		const apys = defaultApys

		if (
			decodedVirtualPrices.length &&
			decodedWeights.length &&
			decodedRates.length
		)
			try {
				let gaugeRates = decodedRates
					.filter((_: any, i: number) => i % 2 === 0)
					.map((v: number) => v / 1e18)
				let workingSupplies = decodedRates
					.filter((_: any, i: number) => i % 2 === 1)
					.map((v: number) => v / 1e18)

				decodedWeights.forEach((w: any, i: number) => {
					let pool: string = Object.values(poolInfo).find((v) => {
						return (
							v.gauge.toLowerCase() ===
							'0x' + weights[i][1].slice(34).toLowerCase()
						)
					}).name
					let swap_address = poolInfo[pool].swap
					let virtual_price = decodedVirtualPrices.find(
						(v: any) =>
							v[0].toLowerCase() === swap_address.toLowerCase(),
					)[1]
					let _working_supply = workingSupplies[i]
					if (['ren', 'sbtc'].includes(pool)) _working_supply *= btc
					let rate =
						(((gaugeRates[i] * w[1] * 31536000) / _working_supply) *
							0.4) /
						virtual_price
					let apy = rate * crv * 100
					if (isNaN(apy)) apy = 0
					Object.values(poolInfo).find(
						(v: any) => v.name === pool,
					).gauge_relative_weight = w[1]
					apys[pool] = apy
				})
			} catch (e) {
				console.error('[getYAxisAPY]', e)
			}
		return apys
	}, [btc, crv, decodedRates, decodedVirtualPrices, weights, decodedWeights])
}

export function useCurvePoolAPR(name: string) {
	// TODO: hook up to store to reduce additional calls
	const [curveApy, setCurveApy] = useState(0)
	useEffect(() => {
		const fetchCurveApy = async () => {
			try {
				const { apy = {} } = await (
					await fetch('https://stats.curve.fi/raw-stats/apys.json')
				).json()
				setCurveApy(
					apy?.day && apy?.day[name] ? parseFloat(apy?.day[name]) : 0,
				)
			} catch (e) {
				console.error('Unable to get curve.fi stats: ', e)
			}
		}
		fetchCurveApy()
	}, [name])
	return curveApy
}

const emptyReserves = {
	_reserves0: ethers.BigNumber.from(0),
	_reserves1: ethers.BigNumber.from(0),
}
export function useLP(name: TLiquidityPools) {
	const { contracts } = useContracts()

	const contract = useMemo(() => contracts?.pools[name], [contracts, name])

	const {
		prices: {
			[contract?.lpTokens?.[0]?.tokenId]: t0p,
			[contract?.lpTokens?.[1]?.tokenId]: t1p,
		},
	} = usePrices()

	const data = useSingleContractMultipleMethods(contract?.lpContract, [
		['getReserves'],
		['totalSupply'],
	])

	return useMemo(() => {
		const [reserves, totalSupply] = data.map(({ result, loading }, i) => {
			if (i === 0) {
				if (loading) return emptyReserves
				if (!result) return emptyReserves
				return {
					_reserve0: new BigNumber(
						result?.['_reserve0']?.toString() || 0,
					).dividedBy(10 ** (contract?.lpTokens[0].decimals || 1)),
					_reserve1: new BigNumber(
						result?.['_reserve1']?.toString() || 0,
					).dividedBy(10 ** (contract?.lpTokens[1].decimals || 1)),
				}
			}
			if (loading) return ethers.BigNumber.from(0)
			if (!result) return ethers.BigNumber.from(0)
			return result
		})

		const reservesUSD = {
			_token0: new BigNumber(
				reserves?.['_reserve0']?.toString() || 0,
			).multipliedBy(t0p),
			_token1: new BigNumber(
				reserves?.['_reserve1']?.toString() || 0,
			).multipliedBy(t1p),
		}
		const tvl = reservesUSD['_token0'].plus(reservesUSD['_token1'])
		return {
			...contract,
			reserves,
			totalSupply: new BigNumber(totalSupply?.toString() || 0).dividedBy(
				10 ** 18,
				// TODO: use LP token decimals
			),
			reservesUSD,
			tvl,
		}
	}, [contract, data, t0p, t1p])
}

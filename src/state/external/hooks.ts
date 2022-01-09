import { useMemo, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useContracts } from '../../contexts/Contracts'
import { TLiquidityPools, TCurveLPContracts } from '../../constants/type'
import { usePrices } from '../prices/hooks'
import {
	useSingleCallResult,
	useSingleContractMultipleMethods,
	useMultipleContractSingleData,
} from '../onchain/hooks'
import BigNumber from 'bignumber.js'
import { abis } from '../../constants/abis/ethereum/mainnet'

const REWARD_INTERFACE = new ethers.utils.Interface(abis.RewardsABI)

export function useFetchCurvePoolBaseAPR() {
	const [curveApy, setCurveApy] = useState({
		apy: {
			day: {},
			week: {},
			month: {},
			total: {},
		},
		volume: {},
	})

	useEffect(() => {
		const fetchCurveApy = async () => {
			try {
				const response = await (
					await fetch('https://stats.curve.fi/raw-stats/apys.json')
				).json()
				setCurveApy(response)
			} catch (e) {
				console.error('Unable to get curve.fi stats: ', e)
			}
		}
		fetchCurveApy()
	}, [])

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

export function useCurvePoolRewards(name: TCurveLPContracts) {
	const { contracts } = useContracts()

	const rate = useSingleCallResult(
		contracts?.currencies.ERC20.crv.contract,
		'rate',
	)

	const { prices } = usePrices()

	const relativeWeight = useSingleCallResult(
		contracts?.external?.gaugeController,
		'gauge_relative_weight(address)',
		[contracts?.externalLP[name]?.gauge?.address],
	)

	const virtualPrice = useSingleCallResult(
		contracts?.externalLP[name]?.pool,
		'get_virtual_price()',
	)

	const balance = useSingleCallResult(
		contracts?.externalLP[name]?.gauge,
		'working_supply',
	)

	return useMemo(() => {
		const yearlyEmissions = new BigNumber(rate?.result?.toString() || 0)
			.multipliedBy(relativeWeight?.result?.toString() || 0)
			.multipliedBy(31_536_000)
			.dividedBy(10 ** 18)
			.multipliedBy(prices?.crv || 0)

		const totalValue = new BigNumber(balance?.result?.toString() || 0)
			.multipliedBy(new BigNumber(virtualPrice?.result?.toString() || 0))
			.dividedBy(10 ** 18)

		const APR = totalValue.isZero()
			? new BigNumber(0)
			: yearlyEmissions.dividedBy(totalValue)

		return {
			yearlyEmissions,
			APR,
		}
	}, [prices?.crv, relativeWeight, virtualPrice, balance, rate])
}

let cliffSize = new BigNumber(100_000) // * 1e18; //new cliff every 100,000 tokens
let cliffCount = new BigNumber(1_000) // 1,000 cliffs
let maxSupply = new BigNumber(100_000_000) // * 1e18; //100 mil max supply

function getCVXMintAmount(crvEarned: BigNumber, cvxSupply: BigNumber) {
	//get current cliff
	const currentCliff = cvxSupply.dividedBy(cliffSize)

	//if current cliff is under the max
	if (currentCliff.lt(cliffCount)) {
		//get remaining cliffs
		const remaining = cliffCount.minus(currentCliff)

		//multiply ratio of remaining cliffs to total cliffs against amount CRV received
		let cvxEarned = crvEarned.multipliedBy(remaining).dividedBy(cliffCount)

		//double check we have not gone over the max supply
		const amountTillMax = maxSupply.minus(cvxSupply)
		if (cvxEarned.gt(amountTillMax)) {
			cvxEarned = amountTillMax
		}
		return cvxEarned
	}
	return new BigNumber(0)
}

export function useConvexAPY(name: TCurveLPContracts, curvePoolv2 = false) {
	const { contracts } = useContracts()

	const currency = useMemo(
		() => contracts?.externalLP[name].currency,
		[contracts, name],
	)

	const rate = useSingleCallResult(
		contracts?.externalLP[name].convexRewards,
		'rewardRate()',
	)

	const { prices } = usePrices()

	const virtualPriceV1 = useSingleCallResult(
		contracts?.externalLP[name].pool,
		'get_virtual_price()',
	)
	const virtualPrice = useMemo(() =>
		curvePoolv2 ?
			{ result: new BigNumber(prices[name]).multipliedBy(10 ** 18) }
			: virtualPriceV1
		, [name, curvePoolv2, prices, virtualPriceV1])

	const cvxTotalSupply = useSingleCallResult(
		contracts?.currencies.ERC20.cvx.contract,
		'totalSupply()',
	)

	const rewardsTotalSupply = useSingleCallResult(
		contracts?.externalLP[name].convexRewards,
		'totalSupply()',
	)

	const extras = useMemo(
		() => Object.entries(contracts?.externalLP[name].extraRewards || {}),
		[contracts, name],
	)

	const extrasData = useMultipleContractSingleData(
		extras.map(([, config]) => config.contract.address),
		REWARD_INTERFACE,
		'rewardRate()',
	)

	const extrasRates = useMemo(() => {
		if (!extras.length) return null

		return Object.fromEntries(
			extrasData.map(({ loading, result }, i) => {
				const [name] = extras[i]
				if (loading) return [name, new BigNumber(0)]
				if (!result) return [name, new BigNumber(0)]
				return [name, new BigNumber(result.toString())]
			}),
		)
	}, [extras, extrasData])

	return useMemo(() => {
		const supply = new BigNumber(
			rewardsTotalSupply?.result?.toString() || 0,
		).dividedBy(10 ** 18)

		const virtualSupply = supply.multipliedBy(
			new BigNumber(virtualPrice?.result?.toString() || 0).dividedBy(
				10 ** 18,
			),
		)

		const crvPerSecond = new BigNumber(rate?.result?.toString() || 0)
			.dividedBy(10 ** 18)
			.dividedBy(virtualSupply)

		const crvPerYear = crvPerSecond.multipliedBy(86400).multipliedBy(365)
		const crvPriceConversion =
			currency !== 'usd'
				? new BigNumber(prices?.crv)
					.dividedBy(prices?.[currency])
					.toString()
				: prices?.crv
		const crvAPR = crvPerYear.multipliedBy(crvPriceConversion || 0)

		const cvxPerYear = getCVXMintAmount(
			crvPerYear,
			new BigNumber(cvxTotalSupply?.result?.toString() || 0).dividedBy(
				10 ** 18,
			),
		)
		const cvxPriceConversion =
			currency !== 'usd'
				? new BigNumber(prices?.cvx)
					.dividedBy(prices?.[currency])
					.toString()
				: prices?.cvx
		const cvxAPR = cvxPerYear.multipliedBy(cvxPriceConversion)

		let totalAPR = crvAPR.plus(cvxAPR)

		let extraAPR = null

		if (extrasRates) {
			const nextExtraAPR = {}

			for (const extra in extrasRates) {
				const extraPerSecond = extrasRates[extra]
					.dividedBy(10 ** 18)
					.dividedBy(virtualSupply)

				const extraPerYear = extraPerSecond
					.multipliedBy(86400)
					.multipliedBy(365)

				const extraAPR = extraPerYear.multipliedBy(prices[extra])

				nextExtraAPR[extra] = extraAPR

				totalAPR = totalAPR.plus(extraAPR)
			}
			extraAPR = nextExtraAPR
		}

		return {
			extraAPR,
			crvAPR,
			cvxAPR,
			totalAPR,
		}
	}, [
		currency,
		prices,
		cvxTotalSupply,
		rewardsTotalSupply,
		virtualPrice,
		rate,
		extrasRates,
	])
}

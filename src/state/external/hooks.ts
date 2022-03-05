import { useMemo, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useContracts } from '../../contexts/Contracts'
import {
	TLiquidityPools as TLiquidityPoolsE,
	TCurveLPContracts as TCurveLPContractsE,
} from '../../constants/type/ethereum'
import {
	TLiquidityPools as TLiquidityPoolsA,
	TCurveLPContracts as TCurveLPContractsA,
	TTraderJoeLPContracts as TTraderJoeLPContractsA,
	TAaveLPContracts as TAaveLPContractsA,
} from '../../constants/type/avalanche'
import { usePrices } from '../prices/hooks'
import {
	useSingleCallResult,
	useSingleContractMultipleMethods,
	useMultipleContractSingleData,
} from '../onchain/hooks'
import BigNumber from 'bignumber.js'
import { abis } from '../../constants/abis/ethereum/mainnet'
import {
	AvalancheLiquidityPoolC,
	EthereumLiquidityPoolC,
} from '../../constants/contracts'
import { useBlockNumber } from '../application'

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
export function useLP(name: TLiquidityPoolsE | TLiquidityPoolsA) {
	const { contracts } = useContracts()

	const contract: AvalancheLiquidityPoolC | EthereumLiquidityPoolC = useMemo(
		() => contracts?.pools[name],
		[contracts, name],
	)

	const { prices } = usePrices()
	const t0p: number = prices[contract?.lpTokens?.[0]?.tokenId]
	const t1p: number = prices[contract?.lpTokens?.[1]?.tokenId]

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

export function useCurvePoolRewards(
	name: TCurveLPContractsE | TCurveLPContractsA,
) {
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

const cliffSize = new BigNumber(100_000) // * 1e18; //new cliff every 100,000 tokens
const cliffCount = new BigNumber(1_000) // 1,000 cliffs
const maxSupply = new BigNumber(100_000_000) // * 1e18; //100 mil max supply

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

export function useConvexAPY(name: TCurveLPContractsE, curvePoolv2 = false) {
	const { contracts } = useContracts()

	const currency = useMemo(
		() => contracts?.externalLP[name]?.currency,
		[contracts, name],
	)

	const rate = useSingleCallResult(
		contracts?.externalLP[name]?.convexRewards,
		'rewardRate()',
	)

	const { prices } = usePrices()

	const virtualPriceV1 = useSingleCallResult(
		contracts?.externalLP[name]?.pool,
		'get_virtual_price()',
	)
	const virtualPrice = useMemo(
		() =>
			curvePoolv2
				? {
						result: new BigNumber(prices[name] || 0).multipliedBy(
							10 ** 18,
						),
				  }
				: virtualPriceV1,
		[name, curvePoolv2, prices, virtualPriceV1],
	)

	const cvxTotalSupply = useSingleCallResult(
		contracts?.currencies.ERC20 && 'cvx' in contracts?.currencies.ERC20
			? contracts?.currencies.ERC20.cvx.contract
			: null,
		'totalSupply()',
	)

	const rewardsTotalSupply = useSingleCallResult(
		contracts?.externalLP[name]?.convexRewards,
		'totalSupply()',
	)

	const extras = useMemo(
		() => Object.entries(contracts?.externalLP[name]?.extraRewards || {}),
		[contracts, name],
	)

	const extrasData = useMultipleContractSingleData(
		extras.map(([, config]) => (config as any).contract.address),
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

export function useCurveAPY(name: TCurveLPContractsA) {
	const { contracts } = useContracts()

	const rate = useSingleCallResult(
		contracts?.currencies.ERC20.crv.contract, //todo
		'rate',
	)

	const { prices } = usePrices()

	const relativeWeight = useSingleCallResult(
		contracts?.external?.gaugeController, //todo
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
			extraAPR: null,
			crvAPR: null,
			cvxAPR: null,
			totalAPR: APR,
		}
	}, [prices?.crv, relativeWeight, virtualPrice, balance, rate])
}

export function useAaveAPY(name: TAaveLPContractsA) {
	const { contracts } = useContracts()

	const currency = useMemo(
		() => contracts?.externalLP[name]?.currency,
		[contracts, name],
	)

	const rate = useSingleCallResult(
		contracts?.external['aaveRewards'],
		'assets',
		[contracts?.externalLP[name]?.token],
	)

	const { prices } = usePrices()

	const supply = useSingleCallResult(
		contracts?.currencies.ERC20['wavax'],
		'balanceOf',
		[contracts?.externalLP[name]?.token],
	)

	return useMemo(() => {
		const totalSupply = new BigNumber(
			supply?.result?.toString() || 0,
		).dividedBy(10 ** 18)

		const wavaxPerYear = new BigNumber(rate?.result?.toString() || 0)
			.multipliedBy(86400)
			.multipliedBy(365)
		const wavaxAPR = wavaxPerYear
			.dividedBy(totalSupply)
			.multipliedBy(prices.wavax || 0)
		const totalAPR = wavaxAPR
		const extraAPR = null

		return {
			extraAPR,
			wavaxAPR,
			totalAPR,
		}
	}, [currency, prices, rate, supply])
}

export function useTraderJoeAPY(name: TTraderJoeLPContractsA) {
	const { contracts } = useContracts()

	const currency = useMemo(
		() => contracts?.externalLP[name]?.currency,
		[contracts, name],
	)

	const rate = useSingleCallResult(
		contracts?.externalLP[name]?.convexRewards,
		'rewardRate()',
	)

	const { prices } = usePrices()

	const virtualPriceV1 = useSingleCallResult(
		contracts?.externalLP[name]?.pool,
		'get_virtual_price()',
	)
	const virtualPrice = useMemo(
		() =>
			// curvePoolv2
			// ? {
			// 		result: new BigNumber(prices[name] || 0).multipliedBy(
			// 			10 ** 18,
			// 		),
			//   }
			// :
			virtualPriceV1,
		[name, prices, virtualPriceV1],
	)

	const rewardsTotalSupply = useSingleCallResult(
		contracts?.externalLP[name]?.convexRewards,
		'totalSupply()',
	)

	const extras = useMemo(
		() => Object.entries(contracts?.externalLP[name]?.extraRewards || {}),
		[contracts, name],
	)

	const extrasData = useMultipleContractSingleData(
		extras.map(([, config]) => (config as any).contract.address),
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
		const totalAPR = crvAPR
		const cvxAPR = null
		const extraAPR = null

		return {
			extraAPR,
			crvAPR,
			cvxAPR,
			totalAPR,
		}
	}, [currency, prices, rewardsTotalSupply, virtualPrice, rate, extrasRates])
}

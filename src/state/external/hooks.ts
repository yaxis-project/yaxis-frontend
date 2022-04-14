import { useMemo, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useContracts } from '../../contexts/Contracts'
import { TCurveLPContracts as TCurveLPContractsE } from '../../constants/type/ethereum'
import {
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
import { TLiquidityPools } from '../../constants/type'
import { numberToFloat } from '../../utils/number'
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

export function useFetchCurvePoolBaseAPRAvalanche() {
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
					await fetch(
						'https://api.curve.fi/api/getFactoryAPYs-avalanche',
					)
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

export function useLiquidityPool(name: TLiquidityPools) {
	const { contracts } = useContracts()

	const contract: AvalancheLiquidityPoolC | EthereumLiquidityPoolC = useMemo(
		() => contracts?.pools[name],
		[contracts, name],
	)

	const { prices } = usePrices()
	const t0p = useMemo(
		() => prices[contract?.lpTokens?.[0]?.tokenId],
		[prices, contract],
	)
	const t1p = useMemo(
		() => prices[contract?.lpTokens?.[1]?.tokenId],
		[prices, contract],
	)

	const data = useSingleContractMultipleMethods(contract?.lpContract, [
		['getReserves'],
		['totalSupply'],
	])

	return useMemo(() => {
		const [reserves, totalSupply] = data.map(({ result, loading }) => {
			if (loading) return ethers.BigNumber.from(0)
			if (!result) return ethers.BigNumber.from(0)
			return result
		})

		const _reserve0 = reserves[0]?.toString() || 0
		const _reserve1 = reserves[1]?.toString() || 0

		const reservesBN = [
			new BigNumber(
				numberToFloat(_reserve0, contract?.lpTokens[0].decimals),
			),
			new BigNumber(
				numberToFloat(_reserve1, contract?.lpTokens[1].decimals),
			),
		]

		const reservesUSD = [
			reservesBN[0].multipliedBy(t0p),
			reservesBN[1].multipliedBy(t1p),
		]
		const tvl = reservesUSD[0].plus(reservesUSD[1])

		const totalSupplyBN = new BigNumber(
			numberToFloat(totalSupply.toString()),
		)

		const tokenPrice = tvl.dividedBy(totalSupplyBN)

		return {
			...contract,
			reserves: reservesBN,
			totalSupply: totalSupplyBN,
			reservesUSD,
			tokenPrice,
			tvl,
		}
	}, [contract, t0p, t1p])
}

export function useCurvePoolRewards(
	name: TCurveLPContractsE | TCurveLPContractsA,
	active: boolean,
) {
	const { contracts } = useContracts()

	const rate = useSingleCallResult(
		active && contracts?.currencies.ERC20.crv.contract,
		'rate',
	)

	const { prices } = usePrices()

	const relativeWeight = useSingleCallResult(
		active &&
			'gaugeController' in contracts?.external &&
			contracts?.external?.gaugeController,
		'gauge_relative_weight(address)',
		[contracts?.externalLP[name]?.gauge?.address],
	)

	const virtualPrice = useSingleCallResult(
		active && contracts?.externalLP[name]?.pool,
		'get_virtual_price()',
	)

	const balance = useSingleCallResult(
		active && contracts?.externalLP[name]?.gauge,
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

export function useCurveAPYAvalanche(name: TCurveLPContractsA) {
	const { contracts } = useContracts()
	const externalLP = useMemo(
		() => contracts?.externalLP[name],
		[contracts, name],
	)

	// const DAY_BLOCKS = 43000
	// const block = useBlockNumber()

	// const [volume, setVolume] = useState(0)

	// useEffect(() => {
	// const getEvents = async () => {
	// 	const events = await externalLP?.pool.queryFilter(
	// 		externalLP?.pool.filters.TokenExchange(),
	// 		block - DAY_BLOCKS,
	// 		block,
	// 	)
	// 	let volume

	// 	events.map(async (trade) => {
	// 		const t = trade.returnValues['tokens_bought'] / 10 ** 18
	// decimals[trade.returnValues['bought_id']]
	// volume += t

	// if (t > 1000000) {
	//   console.log('$',t, trade.transactionHash)
	// }
	// })
	// 		setVolume(volume)
	// 	}
	// 	getEvents()
	// }, [block, setVolume, externalLP])

	const { result: rewardCount } = useSingleCallResult(
		externalLP?.rewards,
		'reward_count',
	)

	const { result: totalSupply } = useSingleCallResult(
		externalLP?.gauge,
		'totalSupply()',
	)

	const rewardCountData = useMemo(
		() => (rewardCount ? rewardCount.toString() : '0'),
		[rewardCount],
	)

	const rewardTokens = useSingleContractMultipleMethods(
		externalLP?.rewards,
		Array(Number(rewardCountData))
			.fill('')
			.map((_, i) => ['reward_tokens', [i]]),
	)

	const rewardTokensData = useMemo(
		() => rewardTokens?.map(({ result }) => result?.toString()),
		[rewardTokens],
	)

	const rewardData = useSingleContractMultipleMethods(
		externalLP?.rewards,
		rewardTokensData.every((address) => address)
			? rewardTokensData.map((address, i) => {
					return ['reward_data', [address]]
			  })
			: [],
	)

	const { prices } = usePrices()

	return useMemo(() => {
		const extraAPR = new BigNumber(0)
		let crvAPR = new BigNumber(0),
			wavaxAPR = new BigNumber(0)

		rewardData.forEach(({ result }, i) => {
			if (result) {
				const virtualSupply = new BigNumber(
					totalSupply?.toString() || 0,
				).dividedBy(10 ** 18)

				const [, , rate] = result

				const tokenPerSecond = new BigNumber(
					rate?.toString() || 0,
				).dividedBy(10 ** 18)

				const tokenPerYear = tokenPerSecond
					.multipliedBy(86400)
					.multipliedBy(365)

				if (
					contracts.currencies.ERC20['wavax'].contract.address ===
					rewardTokensData[i]
				)
					wavaxAPR = tokenPerYear
						.multipliedBy(prices?.wavax)
						.dividedBy(virtualSupply.multipliedBy(prices[name]))
				else if (
					contracts.currencies.ERC20.crv.contract.address ===
					rewardTokensData[i]
				)
					crvAPR = tokenPerYear
						.multipliedBy(prices?.crv)
						.dividedBy(virtualSupply.multipliedBy(prices[name]))
			}
		})

		const totalAPR = new BigNumber(0)
			.plus(crvAPR)
			.plus(wavaxAPR)
			.plus(extraAPR)

		return {
			extraAPR,
			crvAPR,
			wavaxAPR,
			totalAPR,
		}
	}, [name, contracts, prices, rewardTokensData, rewardData, totalSupply])
}

export function useAaveAPYAvalanche(name: TAaveLPContractsA) {
	const { contracts } = useContracts()

	const { result: rewardData } = useSingleCallResult(
		contracts?.external['aaveRewards'],
		'assets',
		[contracts?.externalLP[name]?.token.address],
	)

	const { result: totalSupply } = useSingleCallResult(
		contracts?.externalLP[name]?.token,
		'totalSupply',
	)

	const { prices } = usePrices()

	return useMemo(() => {
		const extraAPR = new BigNumber(0),
			crvAPR = new BigNumber(0)
		let wavaxAPR = new BigNumber(0)

		const virtualSupply = new BigNumber(totalSupply?.toString() || 0)
			.dividedBy(10 ** 18)
			.multipliedBy(prices?.wavax)

		const [rate] = rewardData ?? []

		const tokenPerSecond = new BigNumber(rate?.toString() || 0).dividedBy(
			10 ** 18,
		)

		const tokenPerYear = tokenPerSecond
			.multipliedBy(86400)
			.multipliedBy(365)

		wavaxAPR = tokenPerYear
			.multipliedBy(prices?.wavax)
			.dividedBy(virtualSupply)

		const totalAPR = new BigNumber(0)
			.plus(crvAPR)
			.plus(wavaxAPR)
			.plus(extraAPR)

		return {
			extraAPR,
			crvAPR,
			wavaxAPR,
			totalAPR,
		}
	}, [contracts, prices, rewardData, totalSupply])
}

export function useTraderJoeAPYAvalanche(name: TTraderJoeLPContractsA) {
	const { contracts } = useContracts()

	if (name !== 'joewavax') throw new Error('not supported')

	const [poolInfo, joePerSec, totalAllocPoint] =
		useSingleContractMultipleMethods(contracts?.external['joeMasterChef'], [
			['poolInfo', [0]],
			['joePerSec'],
			['totalAllocPoint'],
		])

	const { result: totalSupply } = useSingleCallResult(
		contracts?.externalLP[name]?.token,
		'totalSupply',
	)

	const { prices } = usePrices()

	return useMemo(() => {
		// TODO: trading fees APR

		const extraAPR = new BigNumber(0)
		let joeAPR = new BigNumber(0)

		const virtualSupply = new BigNumber(totalSupply?.toString() || 0)
			.dividedBy(10 ** 18)
			.multipliedBy(prices?.joewavax)

		const allocPoint = new BigNumber(poolInfo?.result?.[1]?.toString() ?? 0)
		const totalJoePerSec = new BigNumber(joePerSec?.result?.toString() ?? 0)
		const totalAlloc = new BigNumber(
			totalAllocPoint?.result?.toString() ?? 0,
		)

		const percentageShare = allocPoint.dividedBy(totalAlloc)
		const poolJoePerSec = totalJoePerSec.multipliedBy(percentageShare)

		// const joeShare = joePerShare.dividedBy(allocPoint)
		// const poolJoePerSec = totalJoePerSec.multipliedBy(percentageShare)

		const tokenPerSecond = poolJoePerSec.dividedBy(10 ** 18)

		const tokenPerYear = tokenPerSecond
			.multipliedBy(86400)
			.multipliedBy(365)

		joeAPR = tokenPerYear.multipliedBy(prices?.joe).dividedBy(virtualSupply)

		const totalAPR = new BigNumber(0).plus(joeAPR).plus(extraAPR)

		return {
			extraAPR,
			joeAPR,
			totalAPR,
		}
	}, [contracts, prices, poolInfo, joePerSec, totalAllocPoint, totalSupply])
}

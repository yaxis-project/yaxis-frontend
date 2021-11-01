import { useMemo } from 'react'
import { ethers } from 'ethers'
import { useContracts } from '../../contexts/Contracts'
import {
	useSingleContractMultipleMethods,
	useSingleCallResult,
	useSingleContractMultipleData,
} from '../onchain/hooks'
import BigNumber from 'bignumber.js'
import { usePrices } from '../prices/hooks'
import { useCurveRewardsAPR, useCurvePoolAPR } from '../external/hooks'
import { numberToFloat } from '../../utils/number'
import {
	TLiquidityPools,
	TRewardsContracts,
	TVaults,
} from '../../constants/type'
import ERC20Abi from '../../constants/abis/mainnet/erc20.json'

const ERC20_INTERFACE = new ethers.utils.Interface(ERC20Abi)

export function useMetaVaultData() {
	const { contracts } = useContracts()

	const { prices } = usePrices()
	const metaVaultData = useSingleContractMultipleMethods(
		contracts?.internal.yAxisMetaVault,
		[['balance'], ['totalSupply'], ['getPricePerFullShare'], ['token']],
	)

	const token = useMemo(() => {
		const { result, loading } = metaVaultData[3]
		if (loading) return undefined
		if (!result) return undefined
		return result.toString()
	}, [metaVaultData])

	const strategy = useSingleCallResult(
		token && new ethers.Contract(token, ERC20_INTERFACE),
		'name',
	)

	return useMemo(() => {
		const [balance, totalSupply, pricePerFullShare] = metaVaultData.map(
			({ result, loading }, i) => {
				if (loading) return ethers.BigNumber.from(0)
				if (!result) return ethers.BigNumber.from(0)
				return result
			},
		)
		const { result: strategyResult } = strategy
		const totalStakedBN = new BigNumber(balance?.toString() || 0)
		const totalSupplyBN = new BigNumber(totalSupply?.toString() || 0)
		const tvl = totalStakedBN
			.dividedBy(10 ** 18)
			.multipliedBy(prices?.['3crv'] || 0)
			.toNumber()
		const threeCrvBalance =
			!totalStakedBN.isZero() && !totalSupplyBN.isZero()
				? totalStakedBN.div(totalSupplyBN)
				: new BigNumber(0)
		const mvltPrice = threeCrvBalance.multipliedBy(prices?.['3crv'] || 0)
		return {
			totalStaked: totalStakedBN,
			totalSupply: totalSupplyBN,
			strategy: strategyResult,
			tvl,
			mvltPrice,
			pricePerFullShare: new BigNumber(pricePerFullShare.toString()),
		}
	}, [metaVaultData, strategy, prices])
}

export function useVault(name: TVaults) {
	const { contracts } = useContracts()

	const vaultContracts = useMemo(
		() => contracts?.vaults[name],
		[contracts, name],
	)

	const vaultData = useSingleContractMultipleMethods(vaultContracts?.vault, [
		['balance'],
		['getPricePerFullShare'],
	])

	const tokenData = useSingleContractMultipleMethods(
		vaultContracts?.token.contract,
		[['totalSupply']],
	)

	return useMemo(() => {
		const [balance, pricePerFullShare] = vaultData.map(
			({ result, loading }, i) => {
				if (loading) return ethers.BigNumber.from(0)
				if (!result) return ethers.BigNumber.from(0)
				return result
			},
		)

		const [totalSupply] = tokenData.map(({ result, loading }, i) => {
			if (loading) return ethers.BigNumber.from(0)
			if (!result) return ethers.BigNumber.from(0)
			return result
		})
		return {
			balance: new BigNumber(balance?.toString()),
			totalSupply: new BigNumber(totalSupply?.toString()),
			pricePerFullShare: new BigNumber(
				pricePerFullShare?.toString(),
			).dividedBy(10 ** 18),
		}
	}, [vaultData, tokenData])
}

export function useGauge(name: TVaults) {
	const { contracts } = useContracts()

	const vaultContracts = useMemo(
		() => contracts?.vaults[name],
		[contracts, name],
	)

	const data = useSingleContractMultipleMethods(vaultContracts?.gauge, [
		['reward_contract'],
		// ['reward_tokens'],
	])

	// const data2 = useSingleContractMultipleMethods(
	// 	contracts?.internal.gaugeController,
	// 	[
	// 		[
	// 			'get_gauge_weight(address)',
	// 			[contracts?.vaults[name].gauge.address],
	// 		],
	// 		// ['reward_tokens'],
	// 	],
	// )

	return useMemo(() => {
		// const [
		// 	reward_contract,
		// 	reward_tokens
		// ] = data.map(
		// 	({ result, loading }, i) => {
		// 		// if (loading) return ethers.BigNumber.from(0)
		// 		// if (!result) return ethers.BigNumber.from(0)
		// 		return result
		// 	},
		// )
		// console.log(reward_contract, reward_tokens)
		return {
			// reward_contract: new BigNumber(
			// 	reward_contract?.toString()
			// ),
			// reward_tokens: new BigNumber(
			// 	reward_tokens?.toString()
			// ),
		}
	}, [data])
}

export function useVaultAPR(name: TVaults) {
	const { contracts } = useContracts()

	// gauge.working_balances * ( gauge.inflation_rate * gauge_controller.gauge_relative_weight * time / gauge.working_supply) / 10**18

	const gauge = useSingleContractMultipleMethods(
		contracts?.vaults[name].gauge,
		[['inflation_rate'], ['working_supply']],
	)

	const controller = useSingleCallResult(
		contracts?.internal.gaugeController,
		'gauge_relative_weight(address)',
		[contracts?.vaults[name].gauge.address],
	)

	return useMemo(() => {
		const [inflation_rate, working_supply] = gauge.map(
			({ result, loading }, i) => {
				if (loading) return ethers.BigNumber.from(0)
				if (!result) return ethers.BigNumber.from(0)
				return result
			},
		)

		const { result: relative_weight } = controller

		const working_balances = new BigNumber(1)
		const time = new BigNumber(1342)

		if (new BigNumber(working_supply.toString()).isZero())
			return new BigNumber(0)

		return working_balances
			.multipliedBy(
				new BigNumber(inflation_rate.toString())
					.multipliedBy(
						new BigNumber(relative_weight?.toString() || 0),
					)
					.multipliedBy(time)
					.dividedBy(new BigNumber(working_supply.toString())),
			)
			.dividedBy(10 ** 18)
	}, [gauge, controller])
}

export function useVaults() {
	const v3crv = useVault('3crv')
	const wbtc = useVault('wbtc')
	const weth = useVault('weth')
	const link = useVault('link')

	return useMemo(() => {
		return {
			'3crv': v3crv,
			wbtc,
			weth,
			link,
		}
	}, [v3crv, wbtc, weth, link])
}

export function useYaxisSupply() {
	const { contracts } = useContracts()

	const totalSupply = useSingleCallResult(
		contracts?.currencies.ERC677.yaxis?.contract,
		'totalSupply',
	)

	return useMemo(() => {
		const { result: stakedSupply } = totalSupply
		return {
			totalSupply: new BigNumber(stakedSupply?.toString() || 0),
		}
	}, [totalSupply])
}

const useRewardAPR = (rewardsContract: TRewardsContracts) => {
	const { contracts } = useContracts()

	const rewardData = useSingleContractMultipleMethods(
		contracts?.rewards[rewardsContract],
		[['duration'], ['totalSupply']],
	)
	const balance = useSingleCallResult(
		contracts?.currencies.ERC677.yaxis.contract,
		'balanceOf',
		[contracts?.rewards[rewardsContract]?.address],
	)

	const {
		prices: { yaxis },
	} = usePrices()

	// TODO
	const { tvl: metaVaultTVL } = { tvl: 0 }

	const pool = useMemo(
		() =>
			Object.values(contracts?.pools || {}).find(
				(p) => p.rewards === rewardsContract,
			)?.lpContract,
		[contracts, rewardsContract],
	)

	const reserves = useSingleCallResult(pool, 'getReserves')

	return useMemo(() => {
		const [duration, totalSupply] = rewardData.map(
			({ result, loading }, i) => {
				if (loading) return ethers.BigNumber.from(0)
				if (!result) return ethers.BigNumber.from(0)
				return result
			},
		)

		let tvl = new BigNumber(0)
		if (pool)
			tvl = new BigNumber(
				reserves?.result?.['_reserve0']?.toString() || 0,
			).plus(
				new BigNumber(
					reserves?.result?.['_reserve1']?.toString() || 0,
				).multipliedBy(
					new BigNumber(
						reserves?.result?.['_reserve0']?.toString() || 0,
					).dividedBy(
						new BigNumber(
							reserves?.result?.['_reserve1']?.toString(),
						) || 0,
					),
				),
			)
		else if (rewardsContract === 'Yaxis' || rewardsContract === 'MetaVault')
			tvl = new BigNumber(totalSupply.toString() || 0)
		else if (metaVaultTVL && yaxis)
			tvl = new BigNumber(metaVaultTVL)
				.dividedBy(yaxis)
				.multipliedBy(10 ** 18)

		const balanceBN = new BigNumber(balance?.result?.toString() || 0)
		let funding = new BigNumber(0)
		if (rewardsContract === 'Yaxis') funding = new BigNumber(0)
		else if (rewardsContract === 'MetaVault') funding = new BigNumber(0)
		else funding = balanceBN
		const period = new BigNumber(duration.toString() || 0).dividedBy(86400)
		const AVERAGE_BLOCKS_PER_DAY = 6450
		const rewardsPerBlock = funding.isZero()
			? new BigNumber(0)
			: funding
					.dividedBy(period)
					.dividedBy(AVERAGE_BLOCKS_PER_DAY)
					.dividedBy(10 ** 18)

		const rewardPerToken = tvl.isZero()
			? new BigNumber(0)
			: funding.dividedBy(tvl)

		const apr = rewardPerToken
			.dividedBy(period)
			.multipliedBy(365)
			.multipliedBy(100)
		return {
			rewardsPerBlock: new BigNumber(rewardsPerBlock.toString() || 0),
			apr: new BigNumber(apr.toString() || 0),
		}
	}, [
		yaxis,
		rewardData,
		pool,
		balance,
		metaVaultTVL,
		reserves.result,
		rewardsContract,
	])
}

export function useLiquidityPool(name: TLiquidityPools) {
	const { contracts } = useContracts()

	const { prices } = usePrices()

	const LP = useMemo(() => contracts?.pools[name], [contracts, name])

	const data = useSingleContractMultipleMethods(LP?.lpContract, [
		['getReserves'],
		['totalSupply'],
		['balanceOf', [contracts?.rewards['Uniswap YAXIS/ETH'].address]],
	])

	return useMemo(() => {
		const [reserves, totalSupply, balance] = data.map(
			({ result, loading }, i) => {
				if (loading) return ethers.BigNumber.from(0)
				if (!result) return ethers.BigNumber.from(0)
				return result
			},
		)

		const _reserve0 = reserves[0]?.toString() || 0
		const _reserve1 = reserves[1]?.toString() || 0

		const reserve = [
			numberToFloat(_reserve0, LP?.lpTokens[0].decimals),
			numberToFloat(_reserve1, LP?.lpTokens[1].decimals),
		]

		let totalSupplyBN = numberToFloat(totalSupply.toString())

		const tokenPrices = [
			prices[LP?.lpTokens[0].tokenId.toLowerCase()],
			prices[LP?.lpTokens[1].tokenId.toLowerCase()],
		]

		if (tokenPrices[1]) {
			tokenPrices[0] = (tokenPrices[1] * reserve[1]) / reserve[0]
		} else if (tokenPrices[0]) {
			tokenPrices[1] = (tokenPrices[0] * reserve[0]) / reserve[1]
		}

		const totalLpValue =
			reserve[0] * tokenPrices[0] + reserve[1] * tokenPrices[1]
		const lpPrice = new BigNumber(totalLpValue)
			.div(totalSupplyBN)
			.toNumber()
		const tvl = new BigNumber(balance.toString())
			.dividedBy(10 ** 18)
			.multipliedBy(lpPrice)

		return {
			...contracts?.pools[name],
			totalSupply: totalSupplyBN,
			reserve,
			lpPrice,
			tvl,
		}
	}, [prices, data, LP?.lpTokens, contracts?.pools, name])
}

export function useLiquidityPools() {
	const linkswapYaxEth = useLiquidityPool('Linkswap YAX/ETH')
	const uniswapYaxEth = useLiquidityPool('Uniswap YAX/ETH')
	const uniswapYaxisEth = useLiquidityPool('Uniswap YAXIS/ETH')

	return { pools: { linkswapYaxEth, uniswapYaxEth, uniswapYaxisEth } }
}

export function useTVL() {
	const { contracts } = useContracts()
	// TODO
	const { metaVaultTVL } = { metaVaultTVL: 0 }

	const { prices } = usePrices()

	const { pools } = useLiquidityPools()

	const totalSupply = useSingleCallResult(
		contracts?.rewards.Yaxis,
		'totalSupply',
	)

	return useMemo(() => {
		const { result } = totalSupply
		const stakingTvl = new BigNumber(result?.toString() || 0)
			.div(1e18)
			.times(prices.yaxis)

		const liquidityTvl = Object.values(pools)?.reduce(
			(c, { active, tvl }, i) => {
				return c.plus(active && !tvl.isZero() ? tvl : 0)
			},
			new BigNumber(0),
		)

		const metavaultTvl = new BigNumber(metaVaultTVL || 0)
		return {
			stakingTvl,
			liquidityTvl,
			metavaultTvl,
			tvl: stakingTvl.plus(liquidityTvl).plus(metavaultTvl),
		}
	}, [pools, metaVaultTVL, totalSupply, prices])
}

export function useAPY(
	rewardsContract: TRewardsContracts,
	strategyPercentage: number = 1,
) {
	const curveRewardsAPRs = useCurveRewardsAPR()
	const curveBaseAPR = useCurvePoolAPR('3pool')
	const { rewardsPerBlock, apr: rewardsAPR } = useRewardAPR(rewardsContract)

	return useMemo(() => {
		const yaxisAprPercent = rewardsAPR
		const yaxisApyPercent = yaxisAprPercent
			.div(100)
			.dividedBy(365)
			.plus(1)
			.pow(365)
			.minus(1)
			.multipliedBy(100)

		let lpAprPercent = new BigNumber(curveBaseAPR).times(100)
		let lpApyPercent = lpAprPercent
			.div(100)
			.div(12)
			.plus(1)
			.pow(12)
			.minus(1)
			.times(100)
			.decimalPlaces(18)
		lpApyPercent = lpApyPercent.multipliedBy(strategyPercentage)

		let threeCrvAprPercent = new BigNumber(curveRewardsAPRs['3crv'])
		let threeCrvApyPercent = threeCrvAprPercent
			.div(100)
			.div(12)
			.plus(1)
			.pow(12)
			.minus(1)
			.times(100)
			.decimalPlaces(18)
		threeCrvApyPercent = threeCrvApyPercent.multipliedBy(strategyPercentage)

		const totalAPR = rewardsAPR.plus(lpApyPercent).plus(threeCrvApyPercent)
		const totalAPY = yaxisApyPercent
			.plus(lpApyPercent)
			.plus(threeCrvApyPercent)
		return {
			lpAprPercent,
			lpApyPercent,
			threeCrvAprPercent,
			threeCrvApyPercent,
			yaxisApyPercent,
			yaxisAprPercent,
			totalAPY,
			totalAPR,
			rewardsPerBlock,
		}
	}, [
		curveRewardsAPRs,
		curveBaseAPR,
		rewardsAPR,
		strategyPercentage,
		rewardsPerBlock,
	])
}

export function useNewAPY() {
	const v3crv = useVaultAPR('3crv')
	const wbtc = useVaultAPR('wbtc')
	const weth = useVaultAPR('weth')
	const link = useVaultAPR('link')
	const yaxis = useVaultAPR('yaxis')

	return useMemo(() => {
		return {
			'3crv': v3crv,
			wbtc,
			weth,
			link,
			yaxis,
		}
	}, [v3crv, wbtc, weth, link, yaxis])
}

/**
 * Computes the current annual profits for the MetaVault.
 */
export function useAnnualProfits(): BigNumber {
	// TODO: by strategy
	const curveRewardsAPRs = useCurveRewardsAPR()
	const curveBaseAPR = useCurvePoolAPR('3pool')
	const { metavaultTvl } = useTVL()

	return useMemo(() => {
		const strategyAPR = new BigNumber(curveBaseAPR).plus(
			curveRewardsAPRs['3pool'] || 0,
		)

		const strategyAPY = strategyAPR
			.div(100)
			.div(100)
			.div(12)
			.plus(1)
			.pow(12)
			.minus(1)
			.times(100)

		return strategyAPY.times(metavaultTvl)
	}, [curveRewardsAPRs, curveBaseAPR, metavaultTvl])
}

export function useVaultStrategies() {
	const { contracts } = useContracts()

	const strategies = useSingleContractMultipleMethods(
		contracts?.internal.controller,
		Object.values(contracts?.vaults || {})
			.slice(0, 1)
			.map((data) => ['strategies(address)', [data.vault.address]]),
	)

	return useMemo(() => {
		// TODO
	}, [])
}

export function useGauges() {
	const { contracts } = useContracts()

	const callInputs = useMemo(() => {
		if (!contracts?.vaults) return []
		return Object.keys(contracts?.vaults).map((vault) => [
			contracts?.vaults[vault].gauge.address,
		])
	}, [contracts?.vaults])

	const results = useSingleContractMultipleData(
		contracts?.internal.gaugeController,
		'gauge_relative_weight(address)',
		callInputs,
	)

	const resultsWithDefaults = useMemo(() => {
		if (results.length)
			return results.map(({ result, loading }, i) => {
				if (loading) return ethers.BigNumber.from(0)
				if (!result) return ethers.BigNumber.from(0)
				return result
			})

		return Object.keys(contracts?.vaults || {}).map(() =>
			ethers.BigNumber.from(0),
		)
	}, [results, contracts?.vaults])

	const loading = useMemo(
		() =>
			results.length > 0 ? results.some(({ loading }) => loading) : true,
		[results],
	)

	return useMemo(() => {
		return [
			loading,
			Object.fromEntries(
				Object.keys(contracts?.vaults || {}).map((vault, i) => {
					return [
						vault,
						new BigNumber(
							resultsWithDefaults[i][0]?.toString(),
						).dividedBy(10 ** 18),
					]
				}),
			),
		]
	}, [loading, contracts?.vaults, resultsWithDefaults])
}

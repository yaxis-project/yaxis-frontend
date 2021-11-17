import { useMemo } from 'react'
import { ethers } from 'ethers'
import { useContracts } from '../../contexts/Contracts'
import {
	useSingleContractMultipleMethods,
	useSingleCallResult,
	useSingleContractMultipleData,
	useMultipleContractSingleData,
} from '../onchain/hooks'
import BigNumber from 'bignumber.js'
import { usePrices } from '../prices/hooks'
import {
	useCurveRewardsAPR,
	useFetchCurvePoolBaseAPR,
	useCurvePoolRewards,
} from '../external/hooks'
import { numberToFloat } from '../../utils/number'
import {
	TLiquidityPools,
	TRewardsContracts,
	TVaults,
} from '../../constants/type'
import { abis } from '../../constants/abis/mainnet'
import { uniq } from 'lodash'

const ERC20_INTERFACE = new ethers.utils.Interface(abis.ERC20Abi)
const STRATEGY_INTERFACE = new ethers.utils.Interface(abis.StrategyABI)

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
		vaultContracts?.vaultToken.contract,
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

export function useYaxisGauge() {
	const { contracts } = useContracts()

	const gaugeData = useSingleContractMultipleMethods(
		contracts?.vaults.yaxis.gauge,
		[['working_supply'], ['totalSupply']],
	)

	return useMemo(() => {
		const [working_supply, totalSupply] = gaugeData.map(
			({ result, loading }, i) => {
				if (loading) return ethers.BigNumber.from(0)
				if (!result) return ethers.BigNumber.from(0)
				return result
			},
		)

		return {
			balance: new BigNumber(working_supply?.toString()),
			totalSupply: new BigNumber(totalSupply?.toString()),
			pricePerFullShare: new BigNumber(1),
		}
	}, [gaugeData])
}

export function useVaultRewards(name: TVaults) {
	const { contracts } = useContracts()

	const rate = useSingleCallResult(contracts?.internal.minterWrapper, 'rate')

	const { prices } = usePrices()

	const relativeWeight = useSingleCallResult(
		contracts?.internal.gaugeController,
		'gauge_relative_weight(address)',
		[contracts?.vaults[name].gauge.address],
	)

	const virtualPriceCall = useSingleCallResult(
		contracts?.vaults[name].token.name && // YAXIS config has none
			contracts?.externalLP[contracts?.vaults[name].token.name].pool,
		'get_virtual_price()',
	)

	const balance = useSingleCallResult(
		contracts?.vaults[name].gauge,
		'working_supply',
	)

	return useMemo(() => {
		const yearlyEmissions = new BigNumber(rate?.result?.toString() || 0)
			.multipliedBy(relativeWeight?.result?.toString() || 0)
			.multipliedBy(31_536_000)
			.dividedBy(10 ** 18)
			.multipliedBy(prices?.yaxis || 0)

		const virtualPrice =
			name === 'yaxis'
				? prices?.yaxis
				: new BigNumber(virtualPriceCall?.result?.toString() || 0)

		const totalValue = new BigNumber(balance?.result?.toString() || 0)
			.multipliedBy(virtualPrice)
			.dividedBy(10 ** 18)

		const APR = totalValue.isZero()
			? new BigNumber(0)
			: yearlyEmissions.dividedBy(totalValue)

		// APY (weekly compounding):
		// (1+(APR/52))^52-1

		return {
			yearlyEmissions,
			APR,
		}
	}, [name, prices?.yaxis, relativeWeight, virtualPriceCall, balance, rate])
}

export function useVaultsAPY() {
	const v3crv = useVaultRewards('3crv')
	const wbtc = useVaultRewards('wbtc')
	const weth = useVaultRewards('weth')
	const link = useVaultRewards('link')
	const yaxis = useVaultRewards('yaxis')

	const test = useCurvePoolRewards('mim3crv')

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

export function useVaults() {
	const v3crv = useVault('3crv')
	const wbtc = useVault('wbtc')
	const weth = useVault('weth')
	const link = useVault('link')
	const yaxis = useYaxisGauge()

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

export function useYaxisSupply() {
	const { contracts } = useContracts()

	const totalSupply = useSingleCallResult(
		contracts?.currencies.ERC677.yaxis?.contract,
		'totalSupply',
	)

	const DEV_FUND_ADDRESS = '0x5118Df9210e1b97a4de0df15FBbf438499d6b446'
	const TEAM_FUND_ADDRESS = '0xEcD3aD054199ced282F0608C4f0cea4eb0B139bb'
	const TREASURY_ADDRESS = '0xC1d40e197563dF727a4d3134E8BD1DeF4B498C6f'
	// unswapped yaxis, check swap contract
	// rewards contracts
	// gauges

	return useMemo(() => {
		const { result: stakedSupply } = totalSupply
		return {
			total: new BigNumber(stakedSupply?.toString() || 0),
			circulating: new BigNumber(0),
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

	const vaults = useVaults()

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
			(total, { active, tvl }) =>
				total.plus(active && !tvl.isNaN() ? tvl : 0),
			new BigNumber(0),
		)

		const vaultTvl = Object.fromEntries(
			Object.entries(vaults).map(([vault, data]) => {
				const token = contracts?.vaults[vault].token.name.toLowerCase()
				return [
					vault,
					new BigNumber(
						data.pricePerFullShare
							.multipliedBy(data.totalSupply.dividedBy(10 ** 18))
							.multipliedBy(prices[token] || 0),
					),
				]
			}),
		)

		const vaultsTvl = Object.entries(vaults).reduce(
			(total, [vault, data]) => {
				const token = contracts?.vaults[vault].token.name.toLowerCase()
				return total.plus(
					data.pricePerFullShare
						.multipliedBy(data.totalSupply.dividedBy(10 ** 18))
						.multipliedBy(prices[token] || 0),
				)
			},
			new BigNumber(0),
		)

		return {
			vaultTvl,
			vaultsTvl,
			stakingTvl,
			liquidityTvl,
			tvl: stakingTvl.plus(liquidityTvl).plus(vaultsTvl),
		}
	}, [contracts, pools, totalSupply, vaults, prices])
}

export function useAPY(
	rewardsContract: TRewardsContracts,
	strategyPercentage: number = 1,
) {
	const curveRewardsAPRs = useCurvePoolRewards('3pool')
	const curveBaseAPR = useFetchCurvePoolBaseAPR()
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

		let lpAprPercent = new BigNumber(
			curveBaseAPR.apy.day['3pool'] || 0,
		).times(100)
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

export function useYaxisManager() {
	const { contracts } = useContracts()

	const data = useSingleContractMultipleMethods(contracts?.internal.manager, [
		['treasuryFee'],
		['withdrawalProtectionFee'],
		['stakingPoolShareFee'],
		['insuranceFee'],
		['insurancePoolFee'],
	])

	return useMemo(() => {
		const [
			treasuryFee,
			withdrawalProtectionFee,
			stakingPoolShareFee,
			insuranceFee,
			insurancePoolFee,
		] = data.map(({ result, loading }) => {
			if (loading) return new BigNumber(0)
			if (!result) return new BigNumber(0)
			return new BigNumber(result.toString())
		})
		return {
			treasuryFee,
			withdrawalProtectionFee,
			stakingPoolShareFee,
			insuranceFee,
			insurancePoolFee,
		}
	}, [data])
}
export type TYaxisManagerData = ReturnType<typeof useYaxisManager>

export function useVaultStrategies() {
	const { contracts } = useContracts()

	const vaults = useMemo(
		() =>
			Object.entries(contracts?.vaults || {}).filter(
				([, data]) => data.vaultToken.name !== 'YAXIS',
			),
		[contracts?.vaults],
	)

	const strategies = useSingleContractMultipleMethods(
		contracts?.internal.controller,
		vaults.map(([, data]) => ['strategies(address)', [data.vault.address]]),
	)

	const uniqueStrategies = useMemo(() => {
		const output = []
		if (!strategies.length) return output

		strategies.forEach(({ loading, result }) => {
			if (!loading && result) {
				if (Array.isArray(result)) {
					for (const address of result) {
						if (Array.isArray(result)) {
							for (const addr of address) {
								output.push(addr)
							}
						} else output.push(address)
					}
				} else output.push(result)
			}
		})

		return uniq(output)
	}, [strategies])

	const strategyNames = useMultipleContractSingleData(
		uniqueStrategies,
		STRATEGY_INTERFACE,
		'name',
	)

	const strategyLookUp = useMemo(() => {
		return Object.fromEntries(
			uniqueStrategies.map((address, i) => {
				const { loading, result } = strategyNames[i]
				const name = !loading && result ? result : ''
				return [address, name]
			}),
		)
	}, [strategyNames, uniqueStrategies])

	// TODO: add getCap(vault, strategy) to get caps

	return useMemo(() => {
		const strategiesWithDefaults = strategies.map(({ result, loading }) => {
			if (loading) return ''
			if (!result) return ''
			return result.toString()
		})

		return Object.fromEntries(
			vaults.map(([vault], i) => {
				const strategies = strategiesWithDefaults[i] || ''
				const names = strategies
					.split(',')
					.map((strategy) => strategyLookUp[strategy] || '')
				return [vault, names]
			}),
		)
	}, [vaults, strategies, strategyLookUp])
}

export function useGauges() {
	const { contracts } = useContracts()

	const callInputs = useMemo(() => {
		if (!contracts?.vaults) return []
		return Object.keys(contracts?.vaults).map((vault) => [
			contracts?.vaults[vault].gauge.address,
		])
	}, [contracts?.vaults])

	const relativeWeights = useSingleContractMultipleData(
		contracts?.internal.gaugeController,
		'gauge_relative_weight(address)',
		callInputs,
	)

	const relativeWeightsWithDefaults = useMemo(() => {
		if (relativeWeights.length)
			return relativeWeights.map(({ result, loading }, i) => {
				if (loading) return ethers.BigNumber.from(0)
				if (!result) return ethers.BigNumber.from(0)
				return result
			})

		return Object.keys(contracts?.vaults || {}).map(() =>
			ethers.BigNumber.from(0),
		)
	}, [relativeWeights, contracts?.vaults])

	const times = useSingleContractMultipleData(
		contracts?.internal.gaugeController,
		'time_weight',
		callInputs,
	)

	const timesWithDefaults = useMemo(() => {
		if (times.length)
			return times.map(({ result, loading }, i) => {
				if (loading) return ethers.BigNumber.from(0)
				if (!result) return ethers.BigNumber.from(0)
				return result
			})

		return Object.keys(contracts?.vaults || {}).map(() =>
			ethers.BigNumber.from(0),
		)
	}, [times, contracts?.vaults])

	const loading = useMemo(() => {
		const weightsLoading =
			relativeWeights.length > 0
				? relativeWeights.some(({ loading }) => loading)
				: true
		const timesLoading =
			times.length > 0 ? times.some(({ loading }) => loading) : true
		return weightsLoading || timesLoading
	}, [relativeWeights, times])

	return useMemo(() => {
		return [
			loading,
			Object.fromEntries(
				Object.keys(contracts?.vaults || {}).map((vault, i) => {
					return [
						vault,
						{
							relativeWeight: new BigNumber(
								relativeWeightsWithDefaults[i][0]?.toString(),
							).dividedBy(10 ** 18),
							time: new BigNumber(
								timesWithDefaults[i][0]?.toString(),
							),
						},
					]
				}),
			),
		]
	}, [
		loading,
		contracts?.vaults,
		relativeWeightsWithDefaults,
		timesWithDefaults,
	])
}

export function useRewardRate() {
	const { contracts } = useContracts()

	const rate = useSingleCallResult(contracts?.internal.minterWrapper, 'rate')

	return useMemo(() => {
		const { result } = rate
		return new BigNumber(result?.toString() || 0).dividedBy(10 ** 18)
	}, [rate])
}

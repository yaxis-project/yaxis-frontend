import { useMemo } from 'react'
import { ethers } from 'ethers'
import { uniq, isEmpty } from 'lodash'
import BigNumber from 'bignumber.js'
import { useContracts } from '../../contexts/Contracts'
import { abis } from '../../constants/abis/ethereum/mainnet'
import {
	TLiquidityPools as TLiquidityPoolsE,
	TVaults as TVaultsEthereum,
} from '../../constants/type/ethereum'
import {
	TVaults as TVaultsAvalanche,
	TLiquidityPools as TLiquidityPoolsA,
} from '../../constants/type/avalanche'
import { TRewardsContracts } from '../../constants/type'
import {
	useSingleContractMultipleMethods,
	useSingleCallResult,
	useSingleContractMultipleData,
	useMultipleContractSingleData,
} from '../onchain/hooks'
import {
	useFetchCurvePoolBaseAPR,
	useCurvePoolRewards,
	useConvexAPY,
	useCurveAPYAvalanche,
	useAaveAPYAvalanche,
	useTraderJoeAPYAvalanche,
	useLiquidityPool,
} from '../external/hooks'
import { usePrices } from '../prices/hooks'
import { BaseChainInfo } from '../../constants/chains'
import { TVaults } from '../../constants/type'
import { useChainInfo } from '../user'
import { LiquidityPoolWithContract } from '../../constants/contracts/avalanche'

const STRATEGY_INTERFACE = new ethers.utils.Interface(abis.StrategyABI)

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
		contracts?.vaults && 'yaxis' in contracts?.vaults
			? contracts?.vaults.yaxis.gauge
			: null,
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

export function useVaultRewards(
	name: TVaults,
	blockchain: BaseChainInfo['blockchain'],
) {
	const { contracts } = useContracts()
	const chainInfo = useChainInfo()

	const active = useMemo(
		() => blockchain === chainInfo.blockchain,
		[blockchain, chainInfo],
	)

	const { result: rateResult } = useSingleCallResult(
		active && contracts?.internal.minterWrapper,
		'rate',
	)

	const { prices } = usePrices()

	const { result: relativeWeightResult } = useSingleCallResult(
		active && contracts?.internal.gaugeController,
		'gauge_relative_weight(address)',
		[contracts?.vaults[name]?.gauge.address],
	)

	const balance = useSingleCallResult(
		active && contracts?.vaults[name]?.gauge,
		'working_supply',
	)

	return useMemo(() => {
		const supply = new BigNumber(
			balance?.result?.toString() || 0,
		).dividedBy(10 ** 18)

		const virtualPrice = new BigNumber(
			prices[contracts?.vaults[name]?.token.name.toLowerCase()],
		)

		const virtualSupply = virtualPrice.multipliedBy(
			// If supply is 0 mock to 1 to show a value
			supply.gt(0) ? supply : 1,
		)

		const rate = new BigNumber(rateResult?.toString() || 0)

		const relativeWeight = new BigNumber(
			relativeWeightResult?.toString() || 0,
		)

		const yaxisPerSecond = virtualSupply.isZero()
			? new BigNumber(0)
			: rate
					.dividedBy(10 ** 18)
					.multipliedBy(relativeWeight)
					.dividedBy(10 ** 18)
					.dividedBy(virtualSupply)

		const yaxisPerYear = yaxisPerSecond
			.multipliedBy(86400)
			.multipliedBy(365)

		const APR = yaxisPerYear.multipliedBy(prices?.yaxis || 0)

		return {
			workingSupply: new BigNumber(balance?.result?.toString() || 0),
			amountPerYear: yaxisPerYear,
			maxAPR: APR,
			minAPR: APR.isZero() ? APR : APR.dividedBy(2.5),
		}
	}, [
		name,
		contracts?.vaults,
		prices,
		relativeWeightResult,
		balance,
		rateResult,
	])
}

export interface YaxisAPR {
	min: BigNumber
	max: BigNumber
}
export interface ConvexStrategy {
	extraAPR: any
	crvAPR: BigNumber
	cvxAPR: BigNumber
	totalAPR: BigNumber
}
export interface AaveStrategy {
	extraAPR: any
	wavaxAPR: BigNumber
	totalAPR: BigNumber
}
export interface TraderJoeStrategy {
	extraAPR: any
	joeAPR: BigNumber
	totalAPR: BigNumber
}
export interface VaultAPR {
	yaxisAPR: YaxisAPR
	strategy?: ConvexStrategy | AaveStrategy | TraderJoeStrategy
}

type BaseVaultsAPR = {
	[chain in BaseChainInfo['blockchain']]: {
		[vault: string]: VaultAPR
	}
}
type ReturnVaultsAPR = BaseVaultsAPR & {
	avalanche: {
		[vault in TVaultsAvalanche]: {
			yaxisAPR: YaxisAPR
			strategy?: AaveStrategy | TraderJoeStrategy
		}
	}
	ethereum: {
		[vault in TVaultsEthereum]: {
			yaxisAPR: YaxisAPR
			strategy?: ConvexStrategy
		}
	}
}

export function useVaultsAPR() {
	/* ETHEREUM */
	const usd = useVaultRewards('usd', 'ethereum')
	const btc = useVaultRewards('btc', 'ethereum')
	const eth = useVaultRewards('eth', 'ethereum')
	const link = useVaultRewards('link', 'ethereum')
	const frax = useVaultRewards('frax', 'ethereum')
	const tricrypto = useVaultRewards('tricrypto', 'ethereum')
	const cvx = useVaultRewards('cvx', 'ethereum')
	const yaxis = useVaultRewards('yaxis', 'ethereum')

	const mim3crv = useConvexAPY('mim3crv')
	const rencrv = useConvexAPY('rencrv')
	const alethcrv = useConvexAPY('alethcrv')
	const linkcrv = useConvexAPY('linkcrv')
	const crvcvxeth = useConvexAPY('crvcvxeth', true)
	const crv3crypto = useConvexAPY('crv3crypto', true)
	const frax3crv = useConvexAPY('frax3crv')

	/* AVALANCHE */
	const av3crvAvalanche = useVaultRewards('av3crv', 'avalanche')
	const atricryptoAvalanche = useVaultRewards('atricrypto', 'avalanche')
	const avaxAvalanche = useVaultRewards('avax', 'avalanche')
	const joewavaxAvalanche = useVaultRewards('joewavax', 'avalanche')

	const av3crv = useCurveAPYAvalanche('av3crv')
	const atricrypto = useCurveAPYAvalanche('atricrypto')
	const avax = useAaveAPYAvalanche('avax')
	const joewavax = useTraderJoeAPYAvalanche('joewavax')

	return useMemo(() => {
		const output: ReturnVaultsAPR = {
			avalanche: {
				av3crv: {
					yaxisAPR: {
						min: av3crvAvalanche.minAPR,
						max: av3crvAvalanche.maxAPR,
					},
					strategy: av3crv,
				},
				atricrypto: {
					yaxisAPR: {
						min: atricryptoAvalanche.minAPR,
						max: atricryptoAvalanche.maxAPR,
					},
					strategy: atricrypto,
				},
				avax: {
					yaxisAPR: {
						min: avaxAvalanche.minAPR,
						max: avaxAvalanche.maxAPR,
					},
					strategy: avax,
				},
				joewavax: {
					yaxisAPR: {
						min: joewavaxAvalanche.minAPR,
						max: joewavaxAvalanche.maxAPR,
					},
					strategy: joewavax,
				},
			},
			ethereum: {
				usd: {
					yaxisAPR: {
						min: usd.minAPR,
						max: usd.maxAPR,
					},
					strategy: mim3crv,
				},
				btc: {
					yaxisAPR: {
						min: btc.minAPR,
						max: btc.maxAPR,
					},
					strategy: rencrv,
				},
				eth: {
					yaxisAPR: {
						min: eth.minAPR,
						max: eth.maxAPR,
					},
					strategy: alethcrv,
				},
				link: {
					yaxisAPR: {
						min: link.minAPR,
						max: link.maxAPR,
					},
					strategy: linkcrv,
				},
				cvx: {
					yaxisAPR: {
						min: cvx.minAPR,
						max: cvx.maxAPR,
					},
					strategy: crvcvxeth,
				},
				tricrypto: {
					yaxisAPR: {
						min: tricrypto.minAPR,
						max: tricrypto.maxAPR,
					},
					strategy: crv3crypto,
				},
				frax: {
					yaxisAPR: {
						min: frax.minAPR,
						max: frax.maxAPR,
					},
					strategy: frax3crv,
				},
				yaxis: {
					yaxisAPR: {
						min: yaxis.minAPR,
						max: yaxis.maxAPR,
					},
					strategy: null,
				},
			},
		}
		return output
	}, [
		usd,
		btc,
		eth,
		link,
		cvx,
		tricrypto,
		frax,
		yaxis,
		mim3crv,
		rencrv,
		alethcrv,
		linkcrv,
		crvcvxeth,
		crv3crypto,
		frax3crv,
	])
}

type useVaultsReturn = {
	[vault in TVaults]: ReturnType<typeof useVault>
}

export function useVaults(): useVaultsReturn {
	/** ETHEREUM  */
	const usd = useVault('usd')
	const btc = useVault('btc')
	const eth = useVault('eth')
	const link = useVault('link')
	const frax = useVault('frax')
	const tricrypto = useVault('tricrypto')
	const cvx = useVault('cvx')
	const yaxis = useYaxisGauge()

	/** AVALANCHE  */
	const av3crv = useVault('av3crv')
	const atricrypto = useVault('atricrypto')
	const avax = useVault('avax')
	const joewavax = useVault('joewavax')

	return useMemo(() => {
		return {
			usd,
			btc,
			eth,
			link,
			frax,
			tricrypto,
			cvx,
			yaxis,
			av3crv,
			atricrypto,
			avax,
			joewavax,
		}
	}, [
		usd,
		btc,
		eth,
		link,
		frax,
		tricrypto,
		cvx,
		yaxis,
		av3crv,
		atricrypto,
		avax,
		joewavax,
	])
}

const DEV_FUND_ADDRESS = '0x5118Df9210e1b97a4de0df15FBbf438499d6b446'
const TEAM_FUND_ADDRESS = '0xEcD3aD054199ced282F0608C4f0cea4eb0B139bb'
const TREASURY_ADDRESS = '0xC1d40e197563dF727a4d3134E8BD1DeF4B498C6f'

export function useYaxisSupply() {
	// TODO: make this work multi-chain
	const { contracts } = useContracts()

	const totalSupply = useSingleCallResult(
		contracts?.currencies.ERC677?.yaxis?.contract,
		'totalSupply',
	)

	const balances = useSingleContractMultipleData(
		contracts?.currencies.ERC677.yaxis?.contract,
		'balanceOf',
		[
			[DEV_FUND_ADDRESS],
			[TEAM_FUND_ADDRESS],
			[TREASURY_ADDRESS],
			[contracts?.internal.minterWrapper.address],
		],
	)

	const ethereumBalances = useSingleContractMultipleData(
		contracts?.currencies.ERC677.yaxis?.contract,
		'balanceOf',
		contracts?.currencies.ERC677.yaxis?.contract &&
			'swap' in contracts?.internal
			? [
					[contracts?.internal.swap.address],
					[contracts?.rewards['Uniswap YAXIS/ETH']?.address],
			  ]
			: [],
	)

	return useMemo(() => {
		const { result: stakedSupply } = totalSupply

		const [
			devFund,
			teamFund,
			treasury,
			metavaultRewards,
			yaxisRewards,
			gauges,
		] = balances.map(({ result, loading }) => {
			if (loading) return new BigNumber(0)
			if (!result) return new BigNumber(0)
			return new BigNumber(result.toString())
		})

		const [unswapped, uniswapLPRewards] = ethereumBalances.map(
			({ result, loading }) => {
				if (loading) return new BigNumber(0)
				if (!result) return new BigNumber(0)
				return new BigNumber(result.toString())
			},
		)

		const notCirculating = (unswapped || new BigNumber(0))
			.plus(devFund || 0)
			.plus(teamFund || 0)
			.plus(treasury || 0)
			.plus(metavaultRewards || 0)
			.plus(uniswapLPRewards || 0)
			.plus(yaxisRewards || 0)
			.plus(gauges || 0)

		const total = new BigNumber(stakedSupply?.toString() || 0)

		return {
			total,
			circulating: total.minus(notCirculating),
			devFund: devFund || new BigNumber(0),
			teamFund: teamFund || new BigNumber(0),
			treasury: treasury || new BigNumber(0),
			metavaultRewards: metavaultRewards || new BigNumber(0),
			uniswapLPRewards: uniswapLPRewards || new BigNumber(0),
			yaxisRewards: yaxisRewards || new BigNumber(0),
			gauges: gauges || new BigNumber(0),
		}
	}, [totalSupply, balances, ethereumBalances])
}

const useRewardAPR = (rewardsContract: TRewardsContracts, active: boolean) => {
	const { contracts } = useContracts()

	const rewardData = useSingleContractMultipleMethods(
		active ? contracts?.rewards[rewardsContract] : null,
		[['duration'], ['totalSupply']],
	)
	const balance = useSingleCallResult(
		active && contracts?.currencies.ERC677.yaxis.contract,
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

const useAvalancheRewardAPR = (
	rewardsContract: TRewardsContracts,
	active: boolean,
) => {
	const { contracts } = useContracts()

	const results = useSingleContractMultipleMethods(
		active ? contracts?.rewards[rewardsContract] : null,
		[['emission'], ['totalStaked']],
	)

	const {
		prices: { yaxis },
	} = usePrices()

	const pool = useMemo(
		() =>
			(
				Object.entries(contracts?.pools || {}) as [
					TLiquidityPoolsA,
					LiquidityPoolWithContract,
				][]
			).find(([, p]) => p.rewards === rewardsContract)?.[0],
		[contracts, rewardsContract],
	)

	const lp = useLiquidityPool(pool)

	return useMemo(() => {
		const [emission, totalSupply] = results.map(({ result, loading }) => {
			if (loading) return null
			if (!result) return null
			return result
		})
		const lpTvl = lp.tvl
		const lpTotalSupply = lp.totalSupply

		const percentageStaked = new BigNumber(
			(totalSupply && totalSupply[0]?.toString()) || 0,
		)
			.dividedBy(10 ** 18)
			.dividedBy(lpTotalSupply.isZero() ? 1 : lpTotalSupply)
		const tvl = lpTvl.multipliedBy(percentageStaked)
		const yaxisPerYear = new BigNumber(
			(emission && emission[0].toString()) || 0,
		)
			.dividedBy(10 ** 18)
			.multipliedBy(31_536_000)

		const usdEmissionsPerYear = yaxisPerYear.multipliedBy(yaxis)

		const apr = usdEmissionsPerYear.dividedBy(tvl)

		return {
			rewardsPerBlock: new BigNumber(0),
			apr: apr.multipliedBy(100),
		}
	}, [yaxis, results, lp])
}

export function useLiquidityPools(): Record<
	TLiquidityPoolsE | TLiquidityPoolsA,
	ReturnType<typeof useLiquidityPool>
> {
	const linkswapYaxEth = useLiquidityPool('Linkswap YAX/ETH')
	const uniswapYaxEth = useLiquidityPool('Uniswap YAX/ETH')
	const uniswapYaxisEth = useLiquidityPool('Uniswap YAXIS/ETH')
	const traderjoeJoeAvax = useLiquidityPool('TraderJoe YAXIS/WAVAX')

	return {
		'Uniswap YAX/ETH': uniswapYaxEth,
		'Uniswap YAXIS/ETH': uniswapYaxisEth,
		'Linkswap YAX/ETH': linkswapYaxEth,
		'TraderJoe YAXIS/WAVAX': traderjoeJoeAvax,
	}
}

export function useTVL() {
	const { contracts } = useContracts()

	const vaults = useVaults()

	const { prices } = usePrices()

	const pools = useLiquidityPools()

	const veSupply = useSingleCallResult(
		contracts?.internal.votingEscrow,
		'supply',
	)

	const totalSupply = useSingleCallResult(
		contracts?.rewards && 'Yaxis' in contracts?.rewards
			? contracts?.rewards.Yaxis
			: null,
		'totalSupply',
	)

	const metavaultTotalSupply = useSingleCallResult(
		contracts?.internal && 'yAxisMetaVault' in contracts?.internal
			? contracts?.internal.yAxisMetaVault
			: null,
		'totalSupply',
	)

	return useMemo(() => {
		const { result } = totalSupply

		const governanceTvl = new BigNumber(veSupply?.result?.toString() || 0)
			.dividedBy(10 ** 18)
			.multipliedBy(prices.yaxis)

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
				const token =
					contracts?.vaults[vault]?.token.name?.toLowerCase()
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
				const token =
					contracts?.vaults[vault]?.token.name?.toLowerCase()
				return total.plus(
					data.pricePerFullShare
						.multipliedBy(data.totalSupply.dividedBy(10 ** 18))
						.multipliedBy(prices[token] || 0),
				)
			},
			new BigNumber(0),
		)

		const metavaultTvl = new BigNumber(
			metavaultTotalSupply?.result?.toString() || 0,
		)
			.dividedBy(10 ** 18)
			.multipliedBy(prices['3crv'])

		return {
			vaultTvl,
			vaultsTvl,
			stakingTvl,
			liquidityTvl,
			governanceTvl,
			metavaultTvl,
			tvl: stakingTvl
				.plus(liquidityTvl)
				.plus(vaultsTvl)
				.plus(governanceTvl)
				.plus(metavaultTvl),
		}
	}, [
		contracts,
		pools,
		totalSupply,
		veSupply,
		metavaultTotalSupply,
		vaults,
		prices,
	])
}

export function useAPY(
	rewardsContract: TRewardsContracts,
	strategyPercentage = 1,
) {
	const { blockchain } = useChainInfo()
	const curveRewardsAPRs = useCurvePoolRewards(
		'3pool',
		blockchain === 'ethereum',
	)
	const curveBaseAPR = useFetchCurvePoolBaseAPR()
	const {
		rewardsPerBlock: rewardsPerBlockEthereum,
		apr: rewardsAPREthereum,
	} = useRewardAPR(rewardsContract, blockchain === 'ethereum')

	const {
		rewardsPerBlock: rewardsPerBlockAvalanche,
		apr: rewardsAPRAvalanche,
	} = useAvalancheRewardAPR(rewardsContract, blockchain === 'avalanche')

	const rewardsAPR = useMemo(
		() =>
			blockchain === 'ethereum'
				? rewardsAPREthereum
				: rewardsAPRAvalanche,
		[blockchain, rewardsPerBlockEthereum, rewardsPerBlockAvalanche],
	)

	const rewardsPerBlock = useMemo(
		() =>
			blockchain === 'ethereum'
				? rewardsPerBlockEthereum
				: rewardsPerBlockAvalanche,
		[blockchain, rewardsPerBlockEthereum, rewardsPerBlockAvalanche],
	)

	return useMemo(() => {
		const yaxisAprPercent = rewardsAPR
		const yaxisApyPercent = yaxisAprPercent
			.div(100)
			.dividedBy(365)
			.plus(1)
			.pow(365)
			.minus(1)
			.multipliedBy(100)

		const lpAprPercent = new BigNumber(
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

		const threeCrvAprPercent = new BigNumber(curveRewardsAPRs['3crv'] || 0)
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
				const name = !loading && !isEmpty(result) ? result : ''
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
					.map((strategy) => strategyLookUp[strategy])
					.filter((strategy) => !!strategy)
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

	const nextWeekStart = useSingleContractMultipleData(
		contracts?.internal.gaugeController,
		'time_weight(address)',
		callInputs,
	)

	const nextRelativeWeightsCalls = useMemo(
		() =>
			callInputs.map((input, i) => [
				...input,
				nextWeekStart[i]?.result?.toString() || 0,
			]),
		[callInputs, nextWeekStart],
	)

	const nextRelativeWeights = useSingleContractMultipleData(
		contracts?.internal.gaugeController,
		'gauge_relative_weight(address,uint256)',
		nextRelativeWeightsCalls,
	)

	const nextRelativeWeightsWithDefaults = useMemo(() => {
		if (nextRelativeWeights.length)
			return nextRelativeWeights.map(({ result, loading }, i) => {
				if (loading) return ethers.BigNumber.from(0)
				if (!result) return ethers.BigNumber.from(0)
				return result
			})
		return Object.keys(contracts?.vaults || {}).map(() =>
			ethers.BigNumber.from(0),
		)
	}, [nextRelativeWeights, contracts?.vaults])

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
		const unchangedNextRelativeWeights = nextRelativeWeightsWithDefaults
			.reduce(
				(total, current) => total.plus(current.toString()),
				new BigNumber(0),
			)
			.isZero()

		const gauges = Object.fromEntries(
			Object.keys(contracts?.vaults || {}).map((vault, i) => {
				const relativeWeight = new BigNumber(
					relativeWeightsWithDefaults[i][0]?.toString(),
				).dividedBy(10 ** 18)
				const nextRelativeWeight = new BigNumber(
					nextRelativeWeightsWithDefaults[i][0]?.toString(),
				).dividedBy(10 ** 18)

				return [
					vault,
					{
						relativeWeight,
						nextRelativeWeight: unchangedNextRelativeWeights
							? relativeWeight
							: nextRelativeWeight,
						time: new BigNumber(
							timesWithDefaults[i][0]?.toString(),
						),
					},
				]
			}),
		)
		return {
			gauges,
			nextWeekStart: nextWeekStart[0]?.result?.toString() || '0',
			loading,
		}
	}, [
		loading,
		contracts?.vaults,
		relativeWeightsWithDefaults,
		nextRelativeWeightsWithDefaults,
		timesWithDefaults,
		nextWeekStart,
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

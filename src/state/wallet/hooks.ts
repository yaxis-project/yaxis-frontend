import { useState, useEffect, useMemo } from 'react'
import { useContracts } from '../../contexts/Contracts'
import {
	CurrencyContract,
	CurrencyValue,
	CurrencyApproved,
	ETH,
	YAXIS,
	MVLT,
} from '../../constants/currencies'
import {
	TRewardsContracts,
	RewardsContracts,
	LiquidityPool,
	Vaults,
	TVaults,
	LPVaults,
} from '../../constants/type'
import { usePrices } from '../prices/hooks'
import {
	useSingleContractMultipleData,
	useSingleContractMultipleMethods,
	useSingleCallResult,
	useMultipleContractSingleData,
} from '../onchain/hooks'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { BigNumber } from 'bignumber.js'
import { useLP } from '../external/hooks'
import { ethers } from 'ethers'
import { Interface } from '@ethersproject/abi'
import { useBlockNumber } from '../application/hooks'
import ERC20Abi from '../../constants/abis/mainnet/erc20.json'
import GaugeAbi from '../../constants/abis/mainnet/gauge.json'
import { useVaults, useLiquidityPools, useVaultsAPR } from '../internal/hooks'

const ERC20_INTERFACE = new Interface(ERC20Abi)
const GAUGE_INTERFACE = new Interface(GaugeAbi)

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(uncheckedAddresses?: (string | undefined)[]): {
	[address: string]: CurrencyValue | undefined
} {
	const { contracts } = useContracts()

	const addresses: string[] = useMemo(
		() =>
			uncheckedAddresses
				? uncheckedAddresses
						.filter((a) => ethers.utils.isAddress(a))
						.sort()
				: [],
		[uncheckedAddresses],
	)

	const results = useSingleContractMultipleData(
		contracts?.external.multicall,
		'getEthBalance',
		addresses.map((address) => [address]),
	)

	return useMemo(
		() =>
			addresses.reduce<{ [address: string]: CurrencyValue }>(
				(memo, address, i) => {
					const value = new BigNumber(
						results?.[i]?.result?.[0]?.toString() || 0,
					)
					const amount = new BigNumber(value).dividedBy(
						10 ** ETH.decimals,
					)
					if (value)
						memo[address] = {
							...ETH,
							amount,
							value,
							contract: null,
						}
					return memo
				},
				{},
			),
		[addresses, results],
	)
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
	address?: string,
	tokens?: (CurrencyContract | undefined)[],
): [{ [tokenId: string]: CurrencyValue | undefined }, boolean] {
	const validatedTokens: CurrencyContract[] = useMemo(
		() =>
			tokens?.filter((t?: CurrencyContract): t is CurrencyContract => {
				const isValid = ethers.utils.isAddress(t?.contract.address)
				if (isValid === false)
					console.error(`Invalid Token address: ${t.name}`)
				return isValid !== false
			}) ?? [],
		[tokens],
	)

	const validatedTokenAddresses = useMemo(
		() => validatedTokens.map((vt) => vt.contract.address),
		[validatedTokens],
	)

	const balances = useMultipleContractSingleData(
		validatedTokenAddresses,
		ERC20_INTERFACE,
		'balanceOf',
		[address],
	)

	const anyLoading: boolean = useMemo(
		() => balances.some((callState) => callState.loading),
		[balances],
	)

	return [
		useMemo(
			() =>
				address && validatedTokens.length > 0
					? validatedTokens.reduce<{
							[tokenAddress: string]: CurrencyValue | undefined
					  }>((memo, token, i) => {
							const value = new BigNumber(
								balances?.[i]?.result?.[0]?.toString() || 0,
							)
							const amount = new BigNumber(value).dividedBy(
								10 ** token.decimals,
							)
							memo[token.tokenId] = {
								...token,
								amount,
								value,
							}
							return memo
					  }, {})
					: Object.fromEntries(
							tokens.map((t) => {
								return [
									t.tokenId,
									{
										...t,
										amount: new BigNumber(0),
										value: new BigNumber(0),
									},
								]
							}),
					  ),
			[address, tokens, validatedTokens, balances],
		),
		anyLoading,
	]
}

export function useAllTokenBalances(): [
	{ [tokenId: string]: CurrencyValue | undefined },
	boolean,
] {
	const { account } = useWeb3Provider()
	const { contracts } = useContracts()

	const ERC20 = Object.values(contracts?.currencies.ERC20 || {}) || []
	const ERC677 = Object.values(contracts?.currencies.ERC677 || {}) || []
	const LP =
		Object.values(contracts?.pools || {}).map(
			(pool) => pool.tokenContract,
		) || []
	const DEPOSIT_VAULT =
		Object.entries(contracts?.vaults || {})
			.filter(([vault]) => vault !== 'yaxis')
			.map(([, data]) => data.token) || []
	const VAULT =
		Object.entries(contracts?.vaults || {})
			.filter(([vault]) => vault !== 'yaxis')
			.map(([, data]) => data.vaultToken) || []
	const GAUGE =
		Object.values(contracts?.vaults || {}).map(
			(vault) => vault.gaugeToken,
		) || []

	return useTokenBalancesWithLoadingIndicator(account, [
		...ERC20,
		...ERC677,
		...LP,
		...DEPOSIT_VAULT,
		...VAULT,
		...GAUGE,
	])
}

type StakedBalanceReturn = { [key in TRewardsContracts]: CurrencyValue }
const defaultStakedBalancesState = Object.fromEntries(
	RewardsContracts.map((r) => [
		r,
		{ ...YAXIS, value: new BigNumber(0), amount: new BigNumber(0) },
	]),
) as StakedBalanceReturn
export function useStakedBalances(): StakedBalanceReturn {
	const { account } = useWeb3Provider()
	const { contracts } = useContracts()

	const rewardsContracts = useMemo(
		() => Object.entries(contracts?.rewards || {}),
		[contracts],
	)

	const balances = useMultipleContractSingleData(
		rewardsContracts.map(([name, contract]) => contract.address),
		contracts && contracts.rewards.MetaVault.interface,
		'balanceOf',
		[account],
	)

	return useMemo(() => {
		return account && balances.length > 0
			? balances.reduce<StakedBalanceReturn>((memo, token, i) => {
					const value = new BigNumber(
						token?.result?.[0]?.toString() || 0,
					)
					const amount = new BigNumber(
						value.toString() || 0,
					).dividedBy(10 ** YAXIS.decimals)
					memo[rewardsContracts[i][0]] = {
						...YAXIS,
						value,
						amount,
					}
					return memo
			  }, {} as StakedBalanceReturn)
			: defaultStakedBalancesState
	}, [account, rewardsContracts, balances])
}

type ApprovedAmounts = { [tokenId: string]: CurrencyApproved | undefined }
/**
 * Returns a map of token addresses to their eventually consistent token approval amounts for a single account.
 */
export function useApprovedAmounts(
	owner?: string,
	spender?: string,
	tokens?: (CurrencyContract | undefined)[],
): [ApprovedAmounts, boolean] {
	const validatedTokens: CurrencyContract[] = useMemo(
		() =>
			tokens?.filter(
				(t?: CurrencyContract): t is CurrencyContract =>
					ethers.utils.isAddress(t?.contract.address) !== false,
			) ?? [],
		[tokens],
	)

	const validatedTokenAddresses = useMemo(
		() => validatedTokens.map((vt) => vt.contract.address),
		[validatedTokens],
	)

	const balances = useMultipleContractSingleData(
		validatedTokenAddresses,
		ERC20_INTERFACE,
		'allowance',
		[owner, spender],
	)

	const anyLoading: boolean = useMemo(
		() => balances.some((callState) => callState.loading),
		[balances],
	)

	return [
		useMemo(
			() =>
				spender && owner && validatedTokens.length > 0
					? validatedTokens.reduce<ApprovedAmounts>(
							(memo, token, i) => {
								const value = new BigNumber(
									balances?.[i]?.result?.[0]?.toString() || 0,
								)
								memo[token.tokenId] = {
									...token,
									approved: value,
									spender,
									owner,
								}
								return memo
							},
							{},
					  )
					: Object.fromEntries(
							tokens.map((t) => [
								t.tokenId,
								{
									...t,
									approved: new BigNumber(0),
									spender,
									owner,
								},
							]),
					  ),
			[spender, owner, tokens, validatedTokens, balances],
		),
		anyLoading,
	]
}

// TODO: collapse approvals into one hook
// add a way to update state before next block
export function useApprovals() {
	const { contracts } = useContracts()
	const { account } = useWeb3Provider()

	const [{ mvlt: mvRewardsStaking }, loadingMvRewardsStaking] =
		useApprovedAmounts(
			account,
			contracts?.rewards.MetaVault.address,
			contracts?.currencies.ERC20.mvlt
				? [contracts?.currencies.ERC20.mvlt]
				: [],
		)

	const [mvDepositCurrencies, loadingMvDeposit] = useApprovedAmounts(
		account,
		contracts?.internal.yAxisMetaVault.address,
		contracts?.currencies.ERC20['3crv']
			? [contracts?.currencies.ERC20['3crv']]
			: [],
	)

	const [converter3PoolCurrencies, loadingConverter3Pool] =
		useApprovedAmounts(
			account,
			contracts?.externalLP['3pool'].pool.address,
			['dai', 'usdc', 'usdt']
				.map((c) => contracts?.currencies.ERC20[c])
				.filter((c) => c),
		)

	const [
		{ YAXIS_ETH_UNISWAP_LP: uniYaxisEthRewardsStaking },
		loadingUniYaxisEthRewardsStaking,
	] = useApprovedAmounts(
		account,
		contracts?.rewards['Uniswap YAXIS/ETH'].address,
		contracts?.pools['Uniswap YAXIS/ETH'].tokenContract
			? [contracts?.pools['Uniswap YAXIS/ETH'].tokenContract]
			: [],
	)

	return useMemo(() => {
		return {
			metavault: {
				loadingStaking: loadingMvRewardsStaking,
				staking: mvRewardsStaking?.approved || new BigNumber(0),
				loadingDeposit: loadingMvDeposit,
				deposit:
					mvDepositCurrencies?.['3crv']?.approved || new BigNumber(0),
			},
			uniYaxisEth: {
				loadingStaking: loadingUniYaxisEthRewardsStaking,
				staking:
					uniYaxisEthRewardsStaking?.approved || new BigNumber(0),
			},
			converter3pool: {
				loading: loadingConverter3Pool,
				...Object.fromEntries(
					Object.entries(converter3PoolCurrencies).map(
						([currency, value]) => [
							currency,
							value?.approved || new BigNumber(0),
						],
					),
				),
			},
		}
	}, [
		mvRewardsStaking,
		loadingMvRewardsStaking,
		mvDepositCurrencies,
		loadingMvDeposit,
		converter3PoolCurrencies,
		loadingConverter3Pool,
		uniYaxisEthRewardsStaking,
		loadingUniYaxisEthRewardsStaking,
	])
}

export function useSwapApprovals() {
	const { contracts } = useContracts()
	const { account } = useWeb3Provider()

	const [{ yax: allowanceYAX }, loadingAllowanceYAX] = useApprovedAmounts(
		account,
		contracts?.internal.swap.address,
		contracts?.currencies.ERC20.yax
			? [contracts?.currencies.ERC20.yax]
			: [],
	)

	const { result: allowanceSYAX, loading: loadingAllowanceSYAX } =
		useSingleCallResult(contracts?.internal.xYaxStaking, 'allowance', [
			account,
			contracts?.internal.swap.address,
		])

	return useMemo(() => {
		return {
			YAX: allowanceYAX?.approved,
			loadingYAX: loadingAllowanceYAX,
			SYAX: new BigNumber(allowanceSYAX?.toString() || 0),
			loadingSYAX: loadingAllowanceSYAX,
		}
	}, [allowanceSYAX, loadingAllowanceYAX, allowanceYAX, loadingAllowanceSYAX])
}

export function useV3Approvals() {
	const { contracts } = useContracts()
	const { account } = useWeb3Provider()

	const { result: allowanceVault, loading: loadingAllowanceVault } =
		useSingleCallResult(
			contracts?.vaults['usd'].token.contract,
			'allowance',
			[account, contracts?.vaults['usd'].vault.address],
		)

	const { result: allowanceHelper, loading: loadingAllowanceHelper } =
		useSingleCallResult(
			contracts?.vaults['usd'].token.contract,
			'allowance',
			[account, contracts?.internal.vaultHelper.address],
		)

	return useMemo(() => {
		return {
			loading:
				!allowanceHelper ||
				!allowanceVault ||
				loadingAllowanceVault ||
				loadingAllowanceHelper,
			helper: new BigNumber(allowanceHelper?.toString() || 0),
			vault: new BigNumber(allowanceVault?.toString() || 0),
		}
	}, [
		allowanceVault,
		allowanceHelper,
		loadingAllowanceVault,
		loadingAllowanceHelper,
	])
}

const defaultUseClaimedState = {
	claimedMetaVault: ethers.BigNumber.from(0),
	claimedLp: ethers.BigNumber.from(0),
	claimedGovernance: ethers.BigNumber.from(0),
}

// TODO
export const useClaimed = () => {
	const [state, setState] = useState(defaultUseClaimedState)
	const [loading, setLoading] = useState(true)
	const { account } = useWeb3Provider()
	const { contracts } = useContracts()
	const block = useBlockNumber()
	useEffect(() => {
		const getData = async () => {
			const [claimedMetaVault, claimedGovernance, claimedLp] =
				await Promise.all(
					Object.values(contracts.rewards).map((c) =>
						c
							.queryFilter(c.filters.RewardPaid(account))
							.then((e) =>
								e.reduce(
									(acc, curr) =>
										acc.add(
											curr.decode(curr.data, curr.topics)
												.reward,
										),
									ethers.BigNumber.from(0),
								),
							),
					),
				)
			setState({ claimedMetaVault, claimedLp, claimedGovernance })
			setLoading(false)
		}
		if (contracts?.rewards) getData()
	}, [block, account, contracts?.rewards])
	return { state, loading }
}

const defaultUseReturnsState = {
	rewards: {
		lp: new BigNumber(0),
		metaVault: new BigNumber(0),
		governance: new BigNumber(0),
	},
	// metaVaultUSD: new BigNumber(0),
	rewardsUSD: new BigNumber(0),
	// totalUSD: new BigNumber(0),
}

// TODO
export const useReturns = () => {
	const { account } = useWeb3Provider()
	const { contracts } = useContracts()

	// const {
	// 	loading: loadingStaking,
	// 	balances: { stakedBalance },
	// } = useYAXISStaking()
	// const {
	// 	metaVaultData: { totalBalance, mvltPrice },
	// 	loading: loadingMetaVaultData,
	// } = useMetaVaultData('v1')
	// const { loading: loadingERC20, state: erc20 } = useERC20Transactions()

	const { prices } = usePrices()

	const earned = useMultipleContractSingleData(
		contracts &&
			Object.values(contracts?.rewards || {}).map((c) => c.address),
		contracts && contracts.rewards.MetaVault.interface,
		'earned',
		[account],
	)

	const {
		state: { claimedMetaVault, claimedLp, claimedGovernance },
		loading: loadingClaimed,
	} = useClaimed()

	return useMemo(() => {
		if (loadingClaimed || !earned.length || !prices?.yaxis)
			return defaultUseReturnsState

		const [pendingMetaVault, pendingGovernance, pendingLp] = earned.map(
			({ result: reward, loading }, i) => {
				if (loading) return ethers.BigNumber.from(0)
				if (!reward) return ethers.BigNumber.from(0)
				return reward
			},
		)

		const [metaVault, lp, governance] = [
			new BigNumber(claimedMetaVault.toString())
				.plus(pendingMetaVault.toString())
				.dividedBy(10 ** 18)
				.multipliedBy(prices?.yaxis),
			new BigNumber(claimedLp.toString())
				.plus(pendingLp.toString())
				.dividedBy(10 ** 18)
				.multipliedBy(prices?.yaxis),
			new BigNumber(claimedGovernance.toString())
				.plus(pendingGovernance.toString())
				.dividedBy(10 ** 18)
				.multipliedBy(prices?.yaxis),
		]
		return {
			rewards: {
				lp,
				metaVault,
				governance,
			},
			rewardsUSD: lp.plus(metaVault).plus(governance),
		}
	}, [
		prices,
		// account,
		earned,
		claimedGovernance,
		claimedLp,
		claimedMetaVault,
		loadingClaimed,
		// loadingClaimed,
	])
}

export function useLegacyReturns(pid: number) {
	const { account } = useWeb3Provider()
	const { contracts } = useContracts()

	const mvResults = useSingleContractMultipleMethods(
		contracts?.internal.yAxisMetaVault,
		[
			['pendingYax', [account]],
			['userInfo', [account]],
		],
	)

	const lpResults = useSingleContractMultipleMethods(
		contracts?.internal.yaxisChef,
		[
			['pendingYaxis', [pid, account]],
			['userInfo', [pid, account]],
		],
	)

	const { result: governanceStaked, loading: loadingGovernanceStaked } =
		useSingleCallResult(contracts?.internal.xYaxStaking, 'balanceOf', [
			account,
		])

	return useMemo(() => {
		let isLoading = false
		const [lpPendingYax, lpUserInfo] = lpResults.map(
			({ result, loading }, i) => {
				if (loading) {
					isLoading = true

					return ethers.BigNumber.from(0)
				}
				if (!result) return ethers.BigNumber.from(0)
				if (i === 1) return result?.amount
				return result
			},
		)
		const [mvPendingYax, mvUserInfo] = mvResults.map(
			({ result, loading }, i) => {
				if (loading) {
					isLoading = true

					return ethers.BigNumber.from(0)
				}
				if (!result) return ethers.BigNumber.from(0)
				if (i === 1) return result?.amount
				return result
			},
		)

		return {
			loading: !contracts || loadingGovernanceStaked || isLoading,
			lp: {
				pendingYax: new BigNumber(lpPendingYax?.toString() || 0),
				staked: new BigNumber(lpUserInfo?.toString() || 0),
			},
			metavault: {
				pendingYax: new BigNumber(mvPendingYax?.toString() || 0),
				staked: new BigNumber(mvUserInfo?.toString() || 0),
			},
			governance: {
				staked: new BigNumber(governanceStaked?.toString() || 0),
			},
		}
	}, [
		contracts,
		mvResults,
		lpResults,
		governanceStaked,
		loadingGovernanceStaked,
	])
}

/**
 * Returns details about the logged in user's liquidity pool stats.
 * @param lp The name of the LiquidityPool.
 */
export function useAccountLP(lp: LiquidityPool) {
	const { totalSupply } = useLP(lp?.name)

	const [{ [lp?.tokenSymbol]: walletBalance }] = useAllTokenBalances()

	const { [lp?.rewards]: stakedBalance } = useStakedBalances()

	return useMemo(() => {
		const userBalance = new BigNumber(
			walletBalance?.amount.toString() || 0,
		).plus(stakedBalance?.amount.toString() || 0)

		const poolShare = totalSupply.isZero()
			? new BigNumber(0)
			: userBalance.dividedBy(totalSupply)

		return { poolShare, walletBalance, stakedBalance }
	}, [walletBalance, stakedBalance, totalSupply])
}

export function useAccountLPs() {
	const { contracts } = useContracts()

	const linkswapYaxEth = useAccountLP(contracts?.pools['Linkswap YAX/ETH'])
	const uniswapYaxEth = useAccountLP(contracts?.pools['Uniswap YAX/ETH'])
	const uniswapYaxisEth = useAccountLP(contracts?.pools['Uniswap YAXIS/ETH'])

	return { pools: { linkswapYaxEth, uniswapYaxEth, uniswapYaxisEth } }
}

/**
 * Returns details about the signed in user's balances for a Reward contract.
 */
export function useRewardsBalances(token: string, name: TRewardsContracts) {
	const { [name]: staked } = useStakedBalances()
	const [{ [token]: wallet }] = useAllTokenBalances()
	return useMemo(() => {
		return {
			rawWalletBalance: wallet?.value,
			walletBalance: wallet?.amount,
			rawStakedBalance: staked.value,
			stakedBalance: staked.amount,
		}
	}, [staked, wallet])
}

type VaultBalance = {
	[key in TVaults]: {
		vaultToken: CurrencyValue
		gaugeToken: CurrencyValue
		totalToken: BigNumber
		usd: BigNumber
		balance: BigNumber
		totalSupply: BigNumber
		pricePerFullShare: BigNumber
	}
}

interface TVaultsBalances {
	loading: boolean
	balances: VaultBalance
	total: {
		usd: BigNumber
	}
}

export function useVaultsBalances() {
	const vaults = useVaults()
	const [balances, loading] = useAllTokenBalances()
	const { prices } = usePrices()
	return useMemo(() => {
		const defaultState = {
			loading,
			total: { usd: new BigNumber(0) },
			balances: Object.fromEntries(
				(Object.keys(vaults) as TVaults[]).map((vault) => [
					vault,
					{
						vaultToken: {
							amount: new BigNumber(0),
							value: new BigNumber(0),
						},
						gaugeToken: {
							amount: new BigNumber(0),
							value: new BigNumber(0),
						},
						totalToken: new BigNumber(0),
						usd: new BigNumber(0),
						balance: new BigNumber(0),
						totalSupply: new BigNumber(0),
						pricePerFullShare: new BigNumber(0),
					},
				]),
			) as VaultBalance,
		}
		const withData = Object.entries(vaults).reduce<TVaultsBalances>(
			(accumulator, [vault, data]) => {
				const [lpToken] = LPVaults.find(
					([, vaultName]) => vault === vaultName,
				)
				const vaultToken = balances[`cv:${vault}`]
				const gaugeToken = balances[`cv:${vault}-gauge`]
				const totalToken = (
					vaultToken?.amount || new BigNumber(0)
				).plus(gaugeToken?.amount || new BigNumber(0))
				const usd = totalToken
					.multipliedBy(data.pricePerFullShare)
					.multipliedBy(prices[lpToken])
				accumulator.balances[vault] = {
					...data,
					vaultToken,
					gaugeToken,
					totalToken,
					usd,
				}
				accumulator.total.usd = accumulator.total.usd.plus(usd)
				return accumulator
			},
			defaultState,
		)

		// Add YAXIS Gauge data
		const yaxisGauge = vaults.yaxis
		const yaxisVaultToken = balances['yaxis']
		const yaxisGaugeToken = balances['yaxis-gauge']
		const yaxisTotalToken = (
			yaxisVaultToken?.amount || new BigNumber(0)
		).plus(yaxisGaugeToken?.amount || new BigNumber(0))
		const yaxisUsd = (yaxisGaugeToken?.amount || new BigNumber(0))
			.multipliedBy(1)
			.multipliedBy(prices['yaxis'])
		withData.balances.yaxis = {
			...yaxisGauge,
			vaultToken: yaxisVaultToken,
			gaugeToken: yaxisGaugeToken,
			totalToken: yaxisTotalToken,
			usd: yaxisUsd,
		}
		withData.total.usd = withData.total.usd.plus(yaxisUsd)

		return withData
	}, [vaults, balances, prices, loading])
}

export function useLPsBalance() {
	const { pools } = useLiquidityPools()
	const { pools: poolAccounts } = useAccountLPs()

	const {
		prices: { yaxis, eth },
	} = usePrices()

	return useMemo(() => {
		return Object.keys(pools).reduce(
			(previous, current) => {
				const { walletBalance, stakedBalance } = poolAccounts[current]
				const { reserves, totalSupply } = pools[current]

				if (
					!reserves ||
					!eth ||
					!yaxis ||
					!totalSupply ||
					!stakedBalance
				)
					return previous

				const share = new BigNumber(stakedBalance?.value || 0)
					.plus(new BigNumber(walletBalance?.value || 0))
					.div(totalSupply.toString())
				const shareT0 = new BigNumber(
					reserves?.['_reserve0']?.toString() || 0,
				)
					.multipliedBy(share)
					.dividedBy(10 ** 18)
				const shareT1 = new BigNumber(
					reserves?.['_reserve1']?.toString() || 0,
				)
					.multipliedBy(share)
					.dividedBy(10 ** 18)
				const balanceUSD = shareT0
					.multipliedBy(yaxis)
					.plus(shareT1.multipliedBy(eth))

				previous[current].usd = balanceUSD
				previous[current].token = balanceUSD
				previous.total.usd = previous.total.usd.plus(balanceUSD)

				return previous
			},
			{
				'Uniswap YAX/ETH': {
					usd: new BigNumber(0),
				},
				'Uniswap YAXIS/ETH': {
					usd: new BigNumber(0),
				},
				'Linkswap YAX/ETH': {
					usd: new BigNumber(0),
				},
				total: {
					usd: new BigNumber(0),
				},
			},
		)
	}, [eth, poolAccounts, pools, yaxis])
}

export function useVotingPower() {
	const { account } = useWeb3Provider()
	const { contracts } = useContracts()
	const results = useSingleContractMultipleMethods(
		contracts?.internal.votingEscrow,
		[['balanceOf(address)', [account]], ['totalSupply()'], ['supply']],
	)

	const [balanceOf, totalSupply, supply] = useMemo(() => {
		return results.map(({ result, loading }, i) => {
			if (loading) return new BigNumber(0)
			if (!result) return new BigNumber(0)
			return new BigNumber(result.toString())
		})
	}, [results])

	return useMemo(() => {
		return {
			balance: balanceOf,
			totalSupply,
			supply,
		}
	}, [totalSupply, balanceOf, supply])
}

export function useLock() {
	const { account } = useWeb3Provider()
	const { contracts } = useContracts()

	const [loading, setLoading] = useState(true)

	const results = useSingleContractMultipleMethods(
		contracts?.internal.votingEscrow,
		[
			['locked__end', [account]],
			['locked(address)', [account]],
		],
	)

	useEffect(() => {
		if (results.every(({ valid, loading }) => valid && !loading))
			setLoading(false)
	}, [results])

	return useMemo(() => {
		const [locked_end, locked] = results.map(({ result, loading }, i) => {
			if (loading) return ethers.BigNumber.from(0)
			if (!result) return ethers.BigNumber.from(0)
			return result
		})

		return {
			loading,
			hasLock: !new BigNumber(locked_end.toString()).isZero(),
			end: new BigNumber(locked_end.toString()),
			locked: new BigNumber(locked.toString().split(',')[0]).div(
				10 ** 18,
			),
		}
	}, [results, loading])
}

export function useUserGaugeWeights() {
	const { account } = useWeb3Provider()
	const { contracts, loading: loadingContracts } = useContracts()

	const [loading, setLoading] = useState(true)

	const callInputs = useMemo(() => {
		if (!account || !contracts?.vaults) return []
		return Object.values(Vaults).map((vault) => [
			account,
			contracts?.vaults[vault].gauge.address,
		])
	}, [account, contracts?.vaults])

	const results = useSingleContractMultipleData(
		contracts?.internal.gaugeController,
		'vote_user_slopes',
		callInputs,
	)

	const resultsWithDefaults = useMemo(() => {
		if (results.length)
			return results.map(({ result, loading }, i) => {
				if (loading)
					return [
						ethers.BigNumber.from(0),
						ethers.BigNumber.from(0),
						ethers.BigNumber.from(0),
					]
				if (!result)
					return [
						ethers.BigNumber.from(0),
						ethers.BigNumber.from(0),
						ethers.BigNumber.from(0),
					]
				return result
			})

		return Object.values(Vaults).map(() => [
			ethers.BigNumber.from(0),
			ethers.BigNumber.from(0),
			ethers.BigNumber.from(0),
		])
	}, [results])

	useEffect(() => {
		if (
			!loadingContracts &&
			results.every(({ valid, loading }) => valid && !loading) &&
			loading
		)
			setLoading(false)
	}, [results, loadingContracts, loading])

	return useMemo(() => {
		return [
			loading,
			Object.fromEntries(
				Object.values(Vaults).map((vault, i) => {
					return [
						vault,
						{
							slope: resultsWithDefaults[i][0],
							power: resultsWithDefaults[i][1],
							end: resultsWithDefaults[i][2],
						},
					]
				}),
			),
		]
	}, [loading, resultsWithDefaults])
}

export function useUserGaugeClaimable() {
	const { account } = useWeb3Provider()
	const { contracts } = useContracts()

	const results = useMultipleContractSingleData(
		Object.values(contracts?.vaults || {}).map(
			(vault) => vault.gauge.address,
		),
		GAUGE_INTERFACE,
		'claimable_tokens',
		[account],
	)

	return useMemo<[boolean, { [vault in TVaults]: BigNumber }]>(() => {
		const names = Object.keys(contracts?.vaults || {})
		const loading =
			results.length > 0 ? results.some(({ loading }) => loading) : true
		return [
			loading,
			Object.fromEntries(
				results.map(({ result }, i) => {
					return [
						names[i] as TVaults,
						new BigNumber(
							(result || ethers.BigNumber.from(0)).toString(),
						),
					]
				}),
			) as { [vault in TVaults]: BigNumber },
		]
	}, [contracts?.vaults, results])
}

const TOKENLESS_PRODUCTION = 40
export function useUserBoost(vault: TVaults) {
	const { account } = useWeb3Provider()

	const { contracts } = useContracts()

	const results = useSingleContractMultipleMethods(
		contracts?.vaults[vault]?.gauge,
		[
			['balanceOf', [account]],
			['working_balances', [account]],
			['working_supply'],
		],
	)

	return useMemo(() => {
		let loading = true

		const [balance, workingBalance, workingSupply] = results.map(
			({ result, loading }) => {
				if (loading) return new BigNumber(0)
				if (!result) return new BigNumber(0)
				loading = false
				return new BigNumber(result.toString())
			},
		)

		if (balance.isZero())
			return {
				loading,
				workingBalance,
				workingSupply,
				boost: new BigNumber(1),
			}

		const unboostedMinimum = balance
			.multipliedBy(TOKENLESS_PRODUCTION)
			.dividedBy(100)

		const unboostedBalance = unboostedMinimum.lt(balance)
			? unboostedMinimum
			: balance

		const boost = workingBalance.dividedBy(unboostedBalance)
		return { loading, workingBalance, workingSupply, boost }
	}, [results])
}

export function useBoosts() {
	const usd = useUserBoost('usd')
	const btc = useUserBoost('btc')
	const eth = useUserBoost('eth')
	const link = useUserBoost('link')
	const yaxis = useUserBoost('yaxis')

	return useMemo(() => {
		return {
			usd,
			btc,
			eth,
			link,
			yaxis,
		}
	}, [usd, btc, eth, link, yaxis])
}

export function useVaultsAPRWithBoost() {
	const apr = useVaultsAPR()
	const boosts = useBoosts()

	return useMemo(
		() =>
			Object.fromEntries(
				Object.entries(apr).map(([vault, data]) => {
					const boost = boosts[vault].boost
					const yaxisAPRWithBoost = data.yaxisAPR.multipliedBy(boost)
					const totalAPRWithBoost = data.totalAPR
						.minus(data.yaxisAPR)
						.plus(yaxisAPRWithBoost)
					const dataWithBoost = {
						...data,
						boost,
						yaxisAPR: yaxisAPRWithBoost,
						totalAPR: totalAPRWithBoost,
					}
					return [vault, dataWithBoost]
				}),
			),
		[apr, boosts],
	)
}

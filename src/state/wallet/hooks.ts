import { useState, useEffect, useMemo } from 'react'
import { useContracts } from '../../contexts/Contracts'
import {
	CurrencyContract,
	CurrencyValue,
	CurrencyApproved,
	ETH,
	YAXIS,
	MVLT,
	CurrenciesIn3Pool,
} from '../../constants/currencies'
import {
	TRewardsContracts,
	RewardsContracts,
	LiquidityPool,
} from '../../constants/type'
import { usePrices } from '../prices/hooks'
import {
	useSingleContractMultipleData,
	useSingleContractMultipleMethods,
	useSingleCallResult,
} from '../onchain/hooks'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { BigNumber } from 'bignumber.js'
import { useMultipleContractSingleData } from '../onchain/hooks'
import { useLP } from '../external/hooks'
import { ethers } from 'ethers'
import { Interface } from '@ethersproject/abi'
import { useBlockNumber } from '../application/hooks'
import ERC20Abi from '../../constants/abis/mainnet/erc20.json'

const ERC20_INTERFACE = new Interface(ERC20Abi)

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

	return useTokenBalancesWithLoadingIndicator(account, [
		...ERC20,
		...ERC677,
		...LP,
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
			contracts?.external.curve3pool.address,
			CurrenciesIn3Pool.map((c) => contracts?.currencies.ERC20[c]).filter(
				(c) => c,
			),
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

const defaultUseClaimedState = {
	claimedMetaVault: ethers.BigNumber.from(0),
	claimedLp: ethers.BigNumber.from(0),
	claimedGovernance: ethers.BigNumber.from(0),
}

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
 * @param name The name of the LiquidityPool.
 */
export function useAccountLP(lp: LiquidityPool) {
	const { totalSupply } = useLP(lp.name)

	const [{ [lp.tokenSymbol]: walletBalance }] = useAllTokenBalances()

	const { [lp.rewards]: stakedBalance } = useStakedBalances()

	return useMemo(() => {
		const userBalance = new BigNumber(
			walletBalance?.amount.toString() || 0,
		).plus(stakedBalance?.amount.toString() || 0)
		const poolShare = userBalance.dividedBy(totalSupply)
		return { poolShare, walletBalance, stakedBalance }
	}, [walletBalance, stakedBalance, totalSupply])
}

export function useAccountMetaVaultData() {
	const { account } = useWeb3Provider()
	const { contracts } = useContracts()

	const metaVaultData = useSingleContractMultipleMethods(
		contracts?.internal.yAxisMetaVault,
		[
			['balanceOf', [account]],
			// ['pendingYax', [account]], // Legacy method
			// ['userInfo', [account]], // Legacy method
			/*
			{
				accEarned: '0',
				amount: '0',
				yaxRewardDebt: '0',
			},
			*/
		],
	)

	return useMemo(() => {
		const [
			balance,
			// userInfo,
			// pendingYax
		] = metaVaultData.map(({ result, loading }, i) => {
			if (loading) return ethers.BigNumber.from(0)
			if (!result) return ethers.BigNumber.from(0)
			return result
		})
		const deposited = new BigNumber(balance.toString()).dividedBy(
			10 ** MVLT.decimals,
		)
		return {
			deposited,
			// userInfo: ,
			// pendingYax: ,
		}
	}, [metaVaultData])
}

/**
 * Returns details about the signed in user's balances for a Reward contract.
 */
export function useRewardsBalances(token: string, name: TRewardsContracts) {
	const { [name]: staked } = useStakedBalances()
	// const token = useMemo(()=>contracts?.rewards[name],[name])
	const [{ [token]: wallet }] = useAllTokenBalances()

	return useMemo(() => {
		return {
			rawWalletBalance: wallet.value,
			walletBalance: wallet.amount,
			rawStakedBalance: staked.value,
			stakedBalance: staked.amount,
		}
	}, [staked, wallet])
}

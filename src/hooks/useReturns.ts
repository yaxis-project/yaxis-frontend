import { useState, useEffect } from 'react'
import useGlobal from '../hooks/useGlobal'
import useYAXISStaking from './useYAXISStaking'
import useMetaVaultData from '../hooks/useMetaVaultData'
import useERC20Transactions from '../hooks/useERC20Transactions'
import usePriceMap from '../hooks/usePriceMap'
import useWeb3Provider from '../hooks/useWeb3Provider'
import BN, { BigNumber } from 'bignumber.js'

const defaultState = {
	rewards: {
		lp: new BigNumber(0),
		metaVault: new BigNumber(0),
		governance: new BigNumber(0),
	},
	metaVaultUSD: new BigNumber(0),
	rewardsUSD: new BigNumber(0),
	totalUSD: new BigNumber(0),
}

const useReturns = () => {
	const { account } = useWeb3Provider()
	const { block, yaxis } = useGlobal()
	const [state, setState] = useState(defaultState)
	const [loading, setLoading] = useState(true)

	const {
		loading: loadingStaking,
		balances: { stakedBalance },
	} = useYAXISStaking()
	const {
		metaVaultData: { totalBalance, mvltPrice },
		loading: loadingMetaVaultData,
	} = useMetaVaultData('v1')
	const { loading: loadingERC20, state: erc20 } = useERC20Transactions()
	const priceMap = usePriceMap()

	useEffect(() => {
		const getData = async () => {
			const rewards = Object.fromEntries(
				await Promise.all(
					Object.values(yaxis.contracts.rewards).map((c) =>
						c.methods
							.earned(account)
							.call()
							.then((r) => [c.options.address, r]),
					),
				),
			)

			const paidRewards = Object.fromEntries(
				await Promise.all(
					Object.values(yaxis.contracts.rewards).map((c) =>
						c
							.getPastEvents('RewardPaid', {
								filter: {
									user: account,
								},
								fromBlock: 12250000,
								toBlock: 'latest',
							})
							.then((events) => [
								c.options.address,
								events.reduce(
									(
										accumulator,
										{ returnValues: { reward } },
									) => {
										return accumulator.plus(reward)
									},
									new BN(0),
								),
							]),
					),
				),
			)

			const [
				governance,
				lp,
				metaVault,
			] = Object.values(yaxis.contracts.rewards).map((c) =>
				new BN(rewards[c.options.address]).plus(
					paidRewards[c.options.address],
				).dividedBy(10 ** 18),
			)

			const investingBalance = new BN(totalBalance || '0').multipliedBy(
				mvltPrice || '0',
			)
			const mvReUSD = erc20.metaVault.USD.plus(investingBalance)
			// const mvReYAX = erc20.metaVault.YAX.plus(erc20.metaVault.YAXIS)
			// const mvReturn = mvReUSD.plus(mvReYAX.multipliedBy(priceMap?.YAXIS))
			// const stReYAX = erc20.staking.YAX.plus(erc20.staking.YAXIS).plus(
			// 	stakedBalance,
			// )
			const rewardsReturn = governance.plus(lp).plus(metaVault).multipliedBy(priceMap?.YAXIS)

			setState({
				rewards: {
					lp: lp.multipliedBy(priceMap?.YAXIS),
					metaVault: metaVault.multipliedBy(priceMap?.YAXIS),
					governance: governance.multipliedBy(priceMap?.YAXIS),
				},
				metaVaultUSD: mvReUSD,
				rewardsUSD: rewardsReturn,
				totalUSD: mvReUSD.plus(rewardsReturn),
			})
			setLoading(false)
		}
		if (
			!loadingStaking &&
			!loadingMetaVaultData &&
			!loadingERC20 &&
			yaxis
		) {
			getData()
		}
	}, [
		block,
		loadingStaking,
		loadingMetaVaultData,
		loadingERC20,
		erc20,
		mvltPrice,
		totalBalance,
		stakedBalance,
		priceMap,
		account,
		yaxis,
	])

	return { loading, returns: state }
}

export default useReturns

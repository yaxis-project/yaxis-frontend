import { useEffect, useState, useMemo, useCallback } from 'react'

import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { provider } from 'web3-core'
import useGlobal from './useGlobal'
import { getContract } from '../utils/erc20'
import useTokenBalance from './useTokenBalance'
import usePriceMap from './usePriceMap'

const defaultState = {
	sYaxBalance: new BigNumber(0),
	stakedBalance: new BigNumber(0),
	stakedBalanceUSD: new BigNumber(0),
	rate: new BigNumber(0),
	walletBalance: new BigNumber(0),
	yaxBalance: new BigNumber(0),
}

/**
 * Returns details for the yaxis token staking data for the signed in user.
 */
export default function useYaxisStaking() {
	const [balances, setBalances] = useState(defaultState)
	const [loading, setLoading] = useState(true)

	// TODO: cleanup
	const { account, library } = useWeb3React()
	const { block, yaxis } = useGlobal()

	const address = useMemo(() => yaxis?.contracts?.yaxis?.options?.address, [yaxis])
	const { balance: walletBalance, loading: loadingWalletBalance } = useTokenBalance(address)

	const stakingTokenAddress = useMemo(() => yaxis?.contracts?.xYaxStaking?.options?.address, [yaxis])
	const lpContract = useMemo(() => {
		return getContract(library as provider, stakingTokenAddress)
	}, [library, stakingTokenAddress])
	const { balance: sBalance, loading: sBalanceLoading } = useTokenBalance(lpContract.options.address)

	const priceMap = usePriceMap()

	const getData = useCallback(async () => {
		try {
			const rate = await yaxis.contracts.xYaxStaking.methods
				.getPricePerFullShare()
				.call()
			const data = {
				sYaxBalance: sBalance,
				stakedBalance: sBalance.div(1e18).multipliedBy(rate).div(1e18),
				walletBalance,
				rate: new BigNumber(rate),
				stakedBalanceUSD: new BigNumber(rate)
					.div(1e18)
					.multipliedBy(priceMap?.YAX)
					.times(sBalance)
					.div(1e18),
				yaxBalance: walletBalance.div(1e18),
			}
			setBalances(data)
			setLoading(false)
		} catch (err) { }
	}, [priceMap, sBalance, walletBalance, yaxis])


	useEffect(() => {
		setBalances(defaultState)
		if (account) setLoading(true)
	}, [
		account,
	])

	useEffect(() => {
		if (!sBalanceLoading && !loadingWalletBalance) {
			getData()
		}
	}, [
		block,
		getData,
		sBalanceLoading,
		loadingWalletBalance,
	])
	return { loading, balances }
}

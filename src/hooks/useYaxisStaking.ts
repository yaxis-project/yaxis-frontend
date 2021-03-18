import { useEffect, useState, useMemo, useCallback } from 'react'

import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { provider } from 'web3-core'
import useGlobal from './useGlobal'
import { getContract } from '../utils/erc20'
import useYax from './useYaxis'
import useTokenBalance from './useTokenBalance'
import { Currency } from '../utils/currencies'
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
export default function useYaxisStaking(currency: Currency) {
	// TODO: cleanup
	const { address, stakingTokenAddress } = currency
	const walletBalance = useTokenBalance(address)
	const { block } = useGlobal()
	const yaxis = useYax()
	const { account, library } = useWeb3React()
	const priceMap = usePriceMap()
	const lpContract = useMemo(() => {
		return getContract(library as provider, stakingTokenAddress)
	}, [library, stakingTokenAddress])
	const sBalance = useTokenBalance(lpContract.options.address)

	const [balances, setBalances] = useState(defaultState)

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
		} catch (err) {}
	}, [priceMap, sBalance, walletBalance, yaxis])

	const reset = useCallback(() => {
		setBalances(defaultState)
	}, [])

	useEffect(() => {
		if (yaxis && library && stakingTokenAddress) getData()
		else reset()
	}, [
		yaxis,
		block,
		account,
		library,
		sBalance,
		stakingTokenAddress,
		getData,
		reset,
	])

	return balances
}

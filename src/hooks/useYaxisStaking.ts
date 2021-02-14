import { useEffect, useState, useMemo } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import useBlock from './useBlock'
import { getContract } from '../utils/erc20'
import useYax from './useYaxis'
import useTokenBalance from './useTokenBalance'
import { Currency } from '../utils/currencies'
import usePriceMap from './usePriceMap'

/**
 * Returns details for the yaxis token staking data for the signed in user.
 */
export default function useYaxisStaking(currency: Currency) {
	const { address, stakingTokenAddress } = currency
	const walletBalance = useTokenBalance(address)
	const block = useBlock()
	const yaxis = useYax()
	const { ethereum } = useWallet()
	const priceMap = usePriceMap()
	const lpContract = useMemo(() => {
		return getContract(ethereum as provider, stakingTokenAddress)
	}, [ethereum, stakingTokenAddress])
	const sBalance = useTokenBalance(lpContract.options.address)

	const [balances, setBalances] = useState({
		sYaxBalance: new BigNumber(0),
		stakedBalance: new BigNumber(0),
		stakedBalanceUSD: new BigNumber(0),
		rate: new BigNumber(0),
		walletBalance,
	})

	const getData = async () => {
		try {
			const rate = await yaxis.contracts.xYaxStaking.methods
				.getPricePerFullShare()
				.call()
			const data = {
				...balances,
				walletBalance,
				sYaxBalance: sBalance,
				stakedBalance: sBalance.div(1e18).multipliedBy(rate).div(1e18),
				rate: new BigNumber(rate),
				stakedBalanceUSD: new BigNumber(rate)
					.div(1e18)
					.multipliedBy(priceMap?.YAX)
					.times(sBalance)
					.div(1e18),
			}
			setBalances(data)
		} catch (err) {}
	}

	useEffect(() => {
		if (yaxis && ethereum && stakingTokenAddress) getData()
	}, [yaxis, block, ethereum, sBalance])

	return balances
}

import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getBalance } from '../utils/erc20'
import useBlock from './useBlock'

/**
 * Fetches token amount for the given address and signed in wallet.
 * @param tokenAddress Token Address to fetch amount of tokens in the given wallet.
 */
export default function useTokenBalance(tokenAddress: string) {
	const [balance, setBalance] = useState(new BigNumber(0))
	const { account, library } = useWeb3React()
	const block = useBlock()

	const fetchBalance = useCallback(async () => {
		const balance = await getBalance(library, tokenAddress, account)
		setBalance(new BigNumber(balance))
	}, [account, library, tokenAddress])

	useEffect(() => {
		if (account && library && tokenAddress) {
			fetchBalance()
		}
	}, [account, library, setBalance, block, tokenAddress, fetchBalance])

	return balance
}

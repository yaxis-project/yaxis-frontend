import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { provider } from 'web3-core'

import { getBalance } from '../utils/erc20'
import useBlock from './useBlock'

const useTokenBalanceOf = (tokenAddress: string, account: string) => {
	const [balance, setBalance] = useState(new BigNumber(0))
	const { library } = useWeb3React()
	const block = useBlock()

	const fetchBalance = useCallback(async () => {
		if (account && library) {
			const balance = await getBalance(library, tokenAddress, account)
			setBalance(new BigNumber(balance))
		}
	}, [account, library, tokenAddress])

	useEffect(() => {
		fetchBalance()
	}, [block, fetchBalance])

	return balance
}

export default useTokenBalanceOf

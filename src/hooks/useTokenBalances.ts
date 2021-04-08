import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import useWeb3Provider from "./useWeb3Provider"
import { getBalances } from '../utils/erc20'
import useGlobal from './useGlobal'
import { getMutilcallContract } from '../yaxis/utils'

const useTokenBalances = (tokenAddresses: string[]) => {
	const [balances, setBalance] = useState<BigNumber[]>([
		...Array(tokenAddresses.length),
	])
	const { account, library } = useWeb3Provider()
	const { yaxis, block } = useGlobal()
	let mutilcallContract = getMutilcallContract(yaxis)

	const fetchBalances = useCallback(async () => {
		const balance = await getBalances(
			yaxis,
			mutilcallContract,
			tokenAddresses,
			account,
		)
		setBalance(balance)
	}, [account, tokenAddresses, yaxis, mutilcallContract, setBalance])

	useEffect(() => {
		if (account && library && yaxis && yaxis.web3) {
			fetchBalances()
		}
	}, [account, library, setBalance, yaxis, block, fetchBalances])

	return balances
}

export default useTokenBalances

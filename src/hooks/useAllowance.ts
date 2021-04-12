import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import useWeb3Provider from './useWeb3Provider'
import { Contract } from 'web3-eth-contract'
import { getAllowance } from '../utils/erc20'

const useAllowance = (lpContract: Contract, spender: string) => {
	const [allowance, setAllowance] = useState(new BigNumber(0))
	const { account } = useWeb3Provider()

	const fetchAllowance = useCallback(async () => {
		const allowance = await getAllowance(
			lpContract,
			spender,
			account,
		)
		setAllowance(new BigNumber(allowance))
	}, [account, spender, lpContract])

	useEffect(() => {
		if (account && lpContract && spender) {
			fetchAllowance()
		}
		let refreshInterval = setInterval(fetchAllowance, 1000)
		return () => clearInterval(refreshInterval)
	}, [account, lpContract, spender, fetchAllowance])

	return allowance
}

export default useAllowance

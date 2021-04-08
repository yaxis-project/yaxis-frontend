import { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import useWeb3Provider from './useWeb3Provider'
import { getEarned, getYaxisChefContract } from '../yaxis/utils'
import useGlobal from './useGlobal'

const useEarnings = (pid: number) => {
	const [balance, setBalance] = useState(new BigNumber(0))
	const { account } = useWeb3Provider()
	const { yaxis, block } = useGlobal()
	const yaxisChefContract = getYaxisChefContract(yaxis)

	const fetchBalance = useCallback(async () => {
		const balance = await getEarned(yaxisChefContract, pid, account)
		setBalance(new BigNumber(balance))
	}, [account, yaxisChefContract, pid])

	useEffect(() => {
		if (account && yaxisChefContract && yaxis) {
			fetchBalance()
		}
	}, [account, block, yaxisChefContract, setBalance, yaxis, fetchBalance])

	return balance
}

export default useEarnings

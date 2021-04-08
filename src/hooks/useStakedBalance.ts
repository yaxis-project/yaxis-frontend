import { useCallback, useEffect, useState, useMemo } from 'react'

import BigNumber from 'bignumber.js'
import useWeb3Provider from './useWeb3Provider'

import { getStaked, getYaxisChefContract } from '../yaxis/utils'
import useGlobal from './useGlobal'

const useStakedBalance = (pid: number) => {
	const [balance, setBalance] = useState(new BigNumber(0))
	const { account } = useWeb3Provider()
	const { yaxis, block } = useGlobal()
	const yaxisChefContract = useMemo(() => getYaxisChefContract(yaxis), [
		yaxis,
	])

	const fetchBalance = useCallback(async () => {
		const balance = await getStaked(yaxisChefContract, pid, account)
		setBalance(new BigNumber(balance))
	}, [account, pid, yaxisChefContract])

	useEffect(() => {
		if (account && yaxis) {
			fetchBalance()
		}
	}, [account, pid, setBalance, block, yaxis, fetchBalance])

	return balance
}

export default useStakedBalance

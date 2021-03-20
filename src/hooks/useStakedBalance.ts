import { useCallback, useEffect, useState, useMemo } from 'react'

import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'

import { getStaked, getYaxisChefContract } from '../yaxis/utils'
import useYaxis from './useYaxis'
import useBlock from './useBlock'

const useStakedBalance = (pid: number) => {
	const [balance, setBalance] = useState(new BigNumber(0))
	const { account } = useWeb3React()
	const yaxis = useYaxis()
	const yaxisChefContract = useMemo(() => getYaxisChefContract(yaxis), [
		yaxis,
	])
	const block = useBlock()

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

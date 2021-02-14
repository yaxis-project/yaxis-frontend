import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getStaked, getYaxisChefContract } from '../yaxis/utils'
import useYaxis from './useYaxis'
import useBlock from './useBlock'

const useStakedBalance = (pid: number) => {
	const [balance, setBalance] = useState(new BigNumber(0))
	const { account }: { account: string } = useWallet()
	const yaxis = useYaxis()
	const yaxisChefContract = getYaxisChefContract(yaxis)
	const block = useBlock()

	const fetchBalance = useCallback(async () => {
		const balance = await getStaked(yaxisChefContract, pid, account)
		setBalance(new BigNumber(balance))
	}, [account, pid, yaxis])

	useEffect(() => {
		if (account && yaxis) {
			fetchBalance()
		}
	}, [account, pid, setBalance, block, yaxis])

	return balance
}

export default useStakedBalance

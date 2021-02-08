import {useCallback, useEffect, useState} from 'react'
import {provider} from 'web3-core'

import BigNumber from 'bignumber.js'
import {useWallet} from 'use-wallet'

import {getEarned, getYaxisChefContract} from '../yaxis/utils'
import useGlobal from "./useGlobal";

const useEarnings = (pid: number) => {
	const [balance, setBalance] = useState(new BigNumber(0))
	const {account, ethereum,} = useWallet<provider>()
	const {yaxis, block} = useGlobal()
	const yaxisChefContract = getYaxisChefContract(yaxis)

	const fetchBalance = useCallback(async () => {
		const balance = await getEarned(yaxisChefContract, pid, account)
		setBalance(new BigNumber(balance))
	}, [account, yaxisChefContract, yaxis])

	useEffect(() => {
		if (account && yaxisChefContract && yaxis) {
			fetchBalance()
		}
	}, [account, block, yaxisChefContract, setBalance, yaxis])

	return balance
}

export default useEarnings

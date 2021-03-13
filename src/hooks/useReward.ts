import { useCallback } from 'react'

import useYaxis from './useYaxis'
import { useWeb3React } from '@web3-react/core'

import { harvest, getYaxisChefContract } from '../yaxis/utils'

const useReward = (pid: number) => {
	const { account } = useWeb3React()
	const yaxis = useYaxis()
	const yaxisChefContract = getYaxisChefContract(yaxis)

	const handleReward = useCallback(async () => {
		const txHash = await harvest(yaxisChefContract, pid, account)
		console.log(txHash)
		return txHash
	}, [account, pid, yaxis])

	return { onReward: handleReward }
}

export default useReward

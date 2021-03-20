import { useCallback, useMemo } from 'react'

import useYaxis from './useYaxis'
import { useWeb3React } from '@web3-react/core'

import { harvest, getYaxisChefContract } from '../yaxis/utils'

const useReward = (pid: number) => {
	const { account } = useWeb3React()
	const yaxis = useYaxis()
	const yaxisChefContract = useMemo(() => getYaxisChefContract(yaxis), [
		yaxis,
	])

	const handleReward = useCallback(async () => {
		const txHash = await harvest(yaxisChefContract, pid, account)
		console.log(txHash)
		return txHash
	}, [account, pid, yaxisChefContract])

	return { onReward: handleReward }
}

export default useReward

import { useCallback } from 'react'

import useYaxis from './useYaxis'
import { useWeb3React } from '@web3-react/core'

import { stake, getYaxisChefContract } from '../yaxis/utils'

const useStake = (pid: number) => {
	const { account } = useWeb3React()
	const yaxis = useYaxis()

	const handleStake = useCallback(
		async (amount: string) => {
			await stake(getYaxisChefContract(yaxis), pid, amount, account)
		},
		[account, pid, yaxis],
	)

	return { onStake: handleStake }
}

export default useStake

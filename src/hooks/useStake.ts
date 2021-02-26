import { useCallback } from 'react'

import useYaxis from './useYaxis'
import { useWallet } from 'use-wallet'

import { stake, getYaxisChefContract } from '../yaxis/utils'

const useStake = (pid: number) => {
	const { account } = useWallet()
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

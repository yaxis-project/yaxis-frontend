import { useCallback } from 'react'

import useYaxis from './useYaxis'
import { useWallet } from 'use-wallet'

import { leave, getXSushiStakingContract } from '../yaxis/utils'

const useLeave = () => {
	const { account } = useWallet()
	const yaxis = useYaxis()

	const handle = useCallback(
		async (amount: string) => {
			const txHash = await leave(
				getXSushiStakingContract(yaxis),
				amount,
				account,
			)
			console.log(txHash)
		},
		[account, yaxis],
	)

	return { onLeave: handle }
}

export default useLeave

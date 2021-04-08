import { useCallback } from 'react'

import useGlobal from './useGlobal'
import useWeb3Provider from './useWeb3Provider'

import { leave, getXSushiStakingContract } from '../yaxis/utils'

const useLeave = () => {
	const { account } = useWeb3Provider()
	const { yaxis } = useGlobal()

	const handle = useCallback(
		async (amount: string) => {
			await leave(getXSushiStakingContract(yaxis), amount, account)
		},
		[account, yaxis],
	)

	return { onLeave: handle }
}

export default useLeave

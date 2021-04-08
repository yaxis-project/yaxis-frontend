import { useCallback } from 'react'

import useGlobal from './useGlobal'
import { useWeb3React } from '@web3-react/core'

import { leave, getXSushiStakingContract } from '../yaxis/utils'

const useLeave = () => {
	const { account } = useWeb3React()
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

import { useCallback, useMemo } from 'react'

import useYaxis from './useYaxis'
import { useWeb3React } from '@web3-react/core'

import { unstake, getYaxisChefContract } from '../yaxis/utils'

const useUnstake = (pid: number) => {
	const { account } = useWeb3React()
	const yaxis = useYaxis()
	const yaxisChefContract = useMemo(() => getYaxisChefContract(yaxis), [
		yaxis,
	])

	const handleUnstake = useCallback(
		async (amount: string) => {
			const txHash = await unstake(
				yaxisChefContract,
				pid,
				amount,
				account,
			)
			console.log(txHash)
		},
		[account, pid, yaxisChefContract],
	)

	return { onUnstake: handleUnstake }
}

export default useUnstake

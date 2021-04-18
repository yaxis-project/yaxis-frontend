import { useCallback } from 'react'
import useGlobal from './useGlobal'
import useWeb3Provider from './useWeb3Provider'
import BigNumber from 'bignumber.js'

const useLeave = () => {
	const { account } = useWeb3Provider()
	const { yaxis } = useGlobal()

	const handle = useCallback(
		async (a: string) => {
			const rewardsYaxis = yaxis?.contracts?.rewards.Yaxis
			const amount = new BigNumber(a).toString()
			const txHash = await rewardsYaxis.methods
				.withdraw(amount)
				.send({ from: account })
			console.log(txHash)
		},
		[account, yaxis],
	)

	return { onLeave: handle }
}

export default useLeave

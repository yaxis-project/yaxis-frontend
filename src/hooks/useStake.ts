import { useCallback, useState } from 'react'
import { notification } from 'antd'
import useGlobal from './useGlobal'
import useWeb3Provider from './useWeb3Provider'

import { stake, getYaxisChefContract } from '../yaxis/utils'

const useStake = (pid: number, tokenName?: string) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const { account } = useWeb3Provider()
	const { yaxis } = useGlobal()

	const handleStake = useCallback(
		async (amount: string) => {
			try {
				setLoading(true)
				const tx = await stake(getYaxisChefContract(yaxis), pid, amount, account)
				setLoading(false)
				return tx
			} catch (e) {
				setError(e.message)
				notification.error({
					message: `Unable to stake ${tokenName}:`,
					description: e.message,
				})
				setLoading(false)
				return false
			}
		},
		[account, pid, yaxis, tokenName],
	)

	return { loading, error, onStake: handleStake }
}

export default useStake

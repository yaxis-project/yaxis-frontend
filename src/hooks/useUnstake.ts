import { useCallback, useMemo, useState } from 'react'
import { notification } from 'antd'
import useGlobal from './useGlobal'
import { useWeb3React } from '@web3-react/core'

import { unstake, getYaxisChefContract } from '../yaxis/utils'

const useUnstake = (pid: number, tokenName?: string) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const { account } = useWeb3React()
	const { yaxis } = useGlobal()
	const yaxisChefContract = useMemo(() => getYaxisChefContract(yaxis), [
		yaxis,
	])

	const handleUnstake = useCallback(
		async (amount: string) => {
			try {
				setLoading(true)
				const tx = await unstake(
					yaxisChefContract,
					pid,
					amount,
					account,
				)
				return tx
			} catch (e) {
				setError(e.message)
				notification.error({
					message: `Unable to unstake ${tokenName}:`,
					description: e.message,
				})
				setLoading(false)
				return false
			}
		},
		[account, pid, yaxisChefContract, tokenName],
	)

	return { loading, error, onUnstake: handleUnstake }
}

export default useUnstake

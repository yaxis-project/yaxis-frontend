import { useCallback, useMemo, useState } from 'react'
import { notification } from 'antd'
import useGlobal from './useGlobal'
import useWeb3Provider from './useWeb3Provider'

import { getYaxisChefContract } from '../yaxis/utils'

const useReward = (pid: number, tokenName?: string) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const { account } = useWeb3Provider()
	const { yaxis } = useGlobal()
	const yaxisChefContract = useMemo(() => getYaxisChefContract(yaxis), [
		yaxis,
	])

	const handleReward = useCallback(async (cb?) => {
		try {
			setLoading(true)
			const tx = await yaxisChefContract.methods
				.deposit(pid, '0')
				.send({ from: account })
				.on('transactionHash', (tx: any) => {
					cb && cb()
					console.log(tx)
					return tx.transactionHash
				})
			setLoading(false)
			return tx
		} catch (e) {
			setError(e.message)
			notification.error({
				message: `Unable to claim ${tokenName} reward:`,
				description: e.message,
			})
			setLoading(false)
			return false
		}
	}, [account, pid, yaxisChefContract, tokenName])

	return { loading, error, onReward: handleReward }
}

export default useReward

import { useCallback } from 'react'

import useYaxis from './useYaxis'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'

import { approve, getYaxisChefContract } from '../yaxis/utils'

const useApprove = (lpContract: Contract) => {
	const { account } = useWeb3React()
	const yaxis = useYaxis()
	const yaxisChefContract = getYaxisChefContract(yaxis)

	const handleApprove = useCallback(async () => {
		try {
			return await approve(lpContract, yaxisChefContract, account)
		} catch (e) {
			return false
		}
	}, [account, lpContract, yaxisChefContract])

	return { onApprove: handleApprove }
}

export default useApprove

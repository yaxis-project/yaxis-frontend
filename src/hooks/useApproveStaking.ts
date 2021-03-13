import { useCallback } from 'react'

import useYaxis from './useYaxis'
import { useWeb3React } from '@web3-react/core'
import {
	approve,
	getXSushiStakingContract,
	getYaxisContract,
} from '../yaxis/utils'

const useApproveStaking = () => {
	const { account } = useWeb3React()
	const yaxis = useYaxis()
	const lpContract = getYaxisContract(yaxis)
	const contract = getXSushiStakingContract(yaxis)

	const handleApprove = useCallback(async () => {
		try {
			return await approve(lpContract, contract, account)
		} catch (e) {
			return false
		}
	}, [account, lpContract, contract])

	return { onApprove: handleApprove }
}

export default useApproveStaking

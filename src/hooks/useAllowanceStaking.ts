import {useCallback, useEffect, useState} from 'react'

import BigNumber from 'bignumber.js'
import useYaxis from './useYaxis'
import {useWallet} from 'use-wallet'
import {provider} from 'web3-core'

import {getAllowance} from '../utils/erc20'
import {getYaxisContract, getXSushiStakingContract} from '../yaxis/utils'

const useAllowanceStaking = () => {
	const [allowance, setAllowance] = useState(new BigNumber(0))
	const {account} = useWallet<provider>()
	const yaxis = useYaxis()
	const lpContract = getYaxisContract(yaxis)
	const stakingContract = getXSushiStakingContract(yaxis)

	const fetchAllowance = useCallback(async () => {
    if (!lpContract) return;
		const allowance = await getAllowance(
			lpContract,
			stakingContract.options.address,
			account,
		)
		setAllowance(new BigNumber(allowance))
	}, [account, stakingContract, lpContract])

	useEffect(() => {
		if (account && stakingContract && lpContract) {
			fetchAllowance()
		}
		let refreshInterval = setInterval(fetchAllowance, 1000)
		return () => clearInterval(refreshInterval)
	}, [account, stakingContract, lpContract, fetchAllowance])

	return allowance
}

export default useAllowanceStaking

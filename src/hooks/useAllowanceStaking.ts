import { useCallback, useEffect, useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import useGlobal from './useGlobal'
import useWeb3Provider from './useWeb3Provider'
import { getAllowance } from '../utils/erc20'
import { getYaxisContract, getXSushiStakingContract } from '../yaxis/utils'

const useAllowanceStaking = () => {
	const [allowance, setAllowance] = useState(new BigNumber(0))
	const { account } = useWeb3Provider()
	const { yaxis, block } = useGlobal()
	const lpContract = useMemo(() => getYaxisContract(yaxis), [yaxis])
	const stakingContract = useMemo(() => getXSushiStakingContract(yaxis), [
		yaxis,
	])

	const fetchAllowance = useCallback(async () => {
		if (!account || !stakingContract || !lpContract) return
		const allowance = await getAllowance(
			lpContract,
			stakingContract.options.address,
			account,
		)
		setAllowance(new BigNumber(allowance))
	}, [account, stakingContract, lpContract])

	useEffect(() => {
		fetchAllowance()
	}, [fetchAllowance, block])

	return allowance
}

export default useAllowanceStaking

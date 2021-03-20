import { useState, useEffect, useCallback, useMemo } from 'react'
import { notification } from 'antd'
import useGlobal from './useGlobal'
import { useWeb3React } from '@web3-react/core'
import {
	approve,
	getXSushiStakingContract,
	getYaxisContract,
} from '../yaxis/utils'
import { ethers } from 'ethers'
import BN from 'bignumber.js'

const useApproveStaking = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const { account } = useWeb3React()
	const { yaxis, balance } = useGlobal()
	const lpContract = useMemo(() => getYaxisContract(yaxis), [yaxis])
	const contract = useMemo(() => getXSushiStakingContract(yaxis), [yaxis])

	useEffect(() => {
		const canAfford = async () => {
			const gas = await lpContract?.methods
				.approve(contract.options.address, ethers.constants.MaxUint256)
				.estimateGas({ from: account })
			if (new BN(gas).gt(balance))
				setError('Your Ethereum balance is too low')
		}
		canAfford()
	}, [account, lpContract, contract, balance])

	const handleApprove = useCallback(async () => {
		try {
			setLoading(true)
			notification.info({
				message: 'Please approve YAX staking amount.',
			})
			const tx = await approve(lpContract, contract, account)
			setLoading(false)
			return tx
		} catch (e) {
			setError(e.message)
			notification.error({
				message: `Unable to approve YAX for staking:`,
				description: e.message,
			})
			setLoading(false)
			return false
		}
	}, [account, lpContract, contract])

	return { onApprove: handleApprove, loading, error }
}

export default useApproveStaking

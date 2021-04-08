import { useState, useEffect, useCallback, useMemo } from 'react'
import { notification } from 'antd'
import useGlobal from './useGlobal'
import useWeb3Provider from './useWeb3Provider'
import { Contract } from 'web3-eth-contract'
import { ethers } from 'ethers'
import BN from 'bignumber.js'

const useApprove = (contract: Contract, address: string, token?: string) => {
	const initialized = useMemo(() => contract && address, [contract, address])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const { account } = useWeb3Provider()
	const { balance } = useGlobal()

	const approve = useMemo(
		() => initialized && contract?.methods?.approve(address, ethers.constants.MaxUint256),
		[initialized, contract, address],
	)

	useEffect(() => {
		const canAfford = async () => {
			const gas = await approve.estimateGas({ from: account })
			if (new BN(gas).gt(balance))
				setError('Your Ethereum balance is too low')
		}
		if (approve && account) canAfford()
	}, [account, balance, approve])

	const handleApprove = useCallback(async () => {
		try {
			setLoading(true)
			notification.info({
				message: `Please approve ${token} use.`,
			})
			if (!approve) throw new Error("Internal Error. Please reset and try again.")
			const tx = await approve.send({ from: account })
			setLoading(false)
			return tx
		} catch (e) {
			setError(e.message)
			notification.error({
				message: `Unable to approve ${token} use:`,
				description: e.message,
			})
			setLoading(false)
			return false
		}
	}, [approve, account, token])

	return { initialized, onApprove: handleApprove, loading, error }
}

export default useApprove

import { useCallback, useEffect, useState, useMemo } from 'react'
import { getXSushiStakingContract } from '../yaxis/utils'
import { useWeb3React } from '@web3-react/core'
import useGlobal from './useGlobal'

const useStaking = () => {
	const { account } = useWeb3React()
	const { yaxis } = useGlobal()
	const stakingContract = useMemo(() => getXSushiStakingContract(yaxis), [
		yaxis,
	])

	const [stakingData, setStakingData] = useState<any>({})
	const [isClaiming, setClaiming] = useState<boolean>(false)
	const [isExiting, setExiting] = useState<boolean>(false)

	const fetchStakingData = useCallback(async () => {
		try {
			const data: any = {}
			const [incentiveApy] = await Promise.all([
				stakingContract.methods.incentive_apy().call(),
			])
			data.incentiveApy = incentiveApy
			data.initialized = true
			setStakingData(data)
		} catch (e) { }
	}, [stakingContract, setStakingData])

	useEffect(() => {
		if (yaxis && yaxis.web3) {
			fetchStakingData()
		}
	}, [yaxis, fetchStakingData])

	const onClaimReward = useCallback(async () => {
		setClaiming(true)
		try {
			await stakingContract?.methods
				.leave('0')
				.send({ from: account })
				.on('transactionHash', (tx: any) => {
					console.log(tx)
					return tx.transactionHash
				})
		} catch (e) {
			console.error(e)
		}
		setClaiming(false)
	}, [account, stakingContract])

	const onExit = useCallback(async () => {
		setExiting(true)
		try {
			await stakingContract?.methods
				.exit()
				.send({ from: account })
				.on('transactionHash', (tx: any) => {
					console.log(tx)
					return tx.transactionHash
				})
		} catch (e) {
			console.error(e)
		}
		setExiting(false)
	}, [account, stakingContract])

	return {
		stakingData,
		isClaiming,
		onClaimReward,
		isExiting,
		onExit,
	}
}

export default useStaking

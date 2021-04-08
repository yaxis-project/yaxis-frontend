import { useCallback } from 'react'

import useGlobal from './useGlobal'
import useWeb3Provider from './useWeb3Provider'

import { enter, getXSushiStakingContract } from '../yaxis/utils'

/**
 * Hook to generate yaxis callback for YAX staking for amount, for the
 * given account. Note Amount is in units of Ether.
 */
const useEnter = () => {
	const { account } = useWeb3Provider()
	const { yaxis } = useGlobal()

	/**
	 * Return YAX staking for amount, for the
	 * given account. Note amount is in units of Ether.
	 * @param amount string Amount in Ether units of YAX to stake.
	 */
	const onEnter = useCallback(
		async (amount: string) => {
			const txHash = await enter(
				getXSushiStakingContract(yaxis),
				amount,
				account,
			)
			console.log(txHash)
		},
		[account, yaxis],
	)

	return { onEnter }
}

export default useEnter

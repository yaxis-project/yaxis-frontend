import { useCallback } from 'react'
import useGlobal from './useGlobal'
import useWeb3Provider from './useWeb3Provider'
import BigNumber from 'bignumber.js'

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
		async (a: string) => {
			const rewardsYaxis = yaxis?.contracts?.rewards.Yaxis
			const yaxisToken = yaxis?.contracts?.yaxis
			const amount = new BigNumber(a).times(10 ** 18)
			const txHash = await yaxisToken.methods
				.transferAndCall(
					rewardsYaxis.options.address,
					amount,
					rewardsYaxis.methods.stake(amount).encodeABI(),
				)
				.send({ from: account, amount })
			console.log(txHash)
		},
		[account, yaxis],
	)

	return { onEnter }
}

export default useEnter

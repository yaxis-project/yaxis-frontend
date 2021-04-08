import { useCallback } from 'react'
import useWeb3Provider from './useWeb3Provider'
import { Contract } from 'web3-eth-contract'
import { redeem } from '../yaxis/utils'

const useRedeem = (yaxisChefContract: Contract) => {
	const { account } = useWeb3Provider()

	const handleRedeem = useCallback(async () => {
		const txHash = await redeem(yaxisChefContract, account)
		console.log(txHash)
		return txHash
	}, [account, yaxisChefContract])

	return { onRedeem: handleRedeem }
}

export default useRedeem

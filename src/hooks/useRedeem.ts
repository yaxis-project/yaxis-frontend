import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import { redeem } from '../yaxis/utils'

const useRedeem = (yaxisChefContract: Contract) => {
  const { account } = useWallet()

  const handleRedeem = useCallback(async () => {
    const txHash = await redeem(yaxisChefContract, account)
    console.log(txHash)
    return txHash
  }, [account, yaxisChefContract])

  return { onRedeem: handleRedeem }
}

export default useRedeem

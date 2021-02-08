import { useCallback } from 'react'

import useYaxis from './useYaxis'
import { useWallet } from 'use-wallet'

import { stake, getYaxisChefContract } from '../yaxis/utils'

const useStake = (pid: number) => {
  const { account } = useWallet()
  const yaxis = useYaxis()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(
        getYaxisChefContract(yaxis),
        pid,
        amount,
        account,
      )
      console.log(txHash)
    },
    [account, pid, yaxis],
  )

  return { onStake: handleStake }
}

export default useStake

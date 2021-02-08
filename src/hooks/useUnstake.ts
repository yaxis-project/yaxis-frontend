import { useCallback } from 'react'

import useYaxis from './useYaxis'
import { useWallet } from 'use-wallet'

import { unstake, getYaxisChefContract } from '../yaxis/utils'

const useUnstake = (pid: number) => {
  const { account } = useWallet()
  const yaxis = useYaxis()
  const yaxisChefContract = getYaxisChefContract(yaxis)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(yaxisChefContract, pid, amount, account)
      console.log(txHash)
    },
    [account, pid, yaxis],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake

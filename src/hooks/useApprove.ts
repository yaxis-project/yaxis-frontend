import {useCallback} from 'react'

import useYaxis from './useYaxis'
import {useWallet} from 'use-wallet'
import {provider} from 'web3-core'
import {Contract} from 'web3-eth-contract'

import {approve, getYaxisChefContract} from '../yaxis/utils'

const useApprove = (lpContract: Contract) => {
  const {account} = useWallet<provider>()
  const yaxis = useYaxis()
  const yaxisChefContract = getYaxisChefContract(yaxis)

  const handleApprove = useCallback(async () => {
    try {
      return await approve(lpContract, yaxisChefContract, account)
    } catch (e) {
      return false
    }
  }, [account, lpContract, yaxisChefContract])

  return { onApprove: handleApprove }
}

export default useApprove

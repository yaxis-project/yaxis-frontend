import { useMemo } from 'react'
import { Currency } from '../utils/currencies'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getContract } from '../utils/erc20'
import useFarm from './useFarm'
import useStakedBalance from './useStakedBalance'

/**
 * Get staked LP data for the signed in user for the given token.
 */
export default function useLPContractData(
  farmSymbol: string,
  currency: Currency,
) {
  const { ethereum } = useWallet()
  const farmData = useFarm(farmSymbol) || {
    liquidId: 0,
    type: '',
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    name: '',
  }
  const stakedBalance = useStakedBalance(farmData.pid)
  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, farmData.lpTokenAddress)
  }, [ethereum, farmData.lpTokenAddress])

  return { farmData, currency, lpContract, stakedBalance }
}

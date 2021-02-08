import { useCallback, useEffect, useState, useMemo } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getBalance } from '../utils/erc20'
import useBlock from './useBlock'

/**
 * Fetches token amount for the given address and signed in wallet.
 * @param tokenAddress Token Address to fetch amount of tokens in the given wallet.
 */
export default function useTokenBalance(tokenAddress: string) {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {account, ethereum} = useWallet<provider>()
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getBalance(ethereum, tokenAddress, account)
    setBalance(new BigNumber(balance))
  }, [account, ethereum, tokenAddress])

  useEffect(() => {
    if (account && ethereum && tokenAddress) {
      fetchBalance()
    }
  }, [account, ethereum, setBalance, block, tokenAddress])

  return balance;
}

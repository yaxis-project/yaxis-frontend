import { useEffect, useState, useMemo, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import useWeb3Provider from './useWeb3Provider'
import useGlobal from './useGlobal'
import useTokenBalance from './useTokenBalance'

const defaultState = {
    rawWalletBalance: new BigNumber(0),
    walletBalance: new BigNumber(0),
    rawStakedBalance: new BigNumber(0),
    stakedBalance: new BigNumber(0),
}

/**
 * Returns details for the yaxis token staking data for the signed in user.
 */
export default function useRewardsContract(lpAddress: string, name: string) {
    const [balances, setBalances] = useState(defaultState)
    const [loading, setLoading] = useState(true)

    const { account } = useWeb3Provider()
    const { block, yaxis } = useGlobal()

    // const address = useMemo(() => yaxis?.contracts?.yaxis?.options?.address, [yaxis?.contracts])
    const { balance: rawWalletBalance, loading: loadingWalletBalance } = useTokenBalance(lpAddress)

    const rewardsContract = useMemo(() => yaxis?.contracts?.rewards[name]?.options?.address, [yaxis?.contracts, name])
    const { balance: rawStakedBalance } = useTokenBalance(rewardsContract)

    const getData = useCallback(async () => {
        try {
            const data = {
                rawWalletBalance,
                walletBalance: rawWalletBalance.dividedBy(10 ** 18),
                rawStakedBalance,
                stakedBalance: rawStakedBalance.dividedBy(10 ** 18),
            }
            setBalances(data)
            setLoading(false)
        } catch (err) { }
    }, [rawStakedBalance, rawWalletBalance])


    useEffect(() => {
        setBalances(defaultState)
        if (account) setLoading(true)
    }, [
        account,
    ])

    useEffect(() => {
        if (rewardsContract && !loadingWalletBalance) {
            getData()
        }
    }, [
        block,
        getData,
        rewardsContract,
        loadingWalletBalance,
    ])
    return { loading, balances }
}

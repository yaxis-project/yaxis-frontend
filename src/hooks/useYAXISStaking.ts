import { useEffect, useState, useMemo, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import useWeb3Provider from './useWeb3Provider'
import useGlobal from './useGlobal'
import useTokenBalance from './useTokenBalance'
import usePriceMap from './usePriceMap'

const defaultState = {
    sYaxisBalance: new BigNumber(0),
    stakedBalance: new BigNumber(0),
    stakedBalanceUSD: new BigNumber(0),
    walletBalance: new BigNumber(0),
    yaxisBalance: new BigNumber(0),
}

/**
 * Returns details for the yaxis token staking data for the signed in user.
 */
export default function useYaxisStaking() {
    const [balances, setBalances] = useState(defaultState)
    const [loading, setLoading] = useState(true)

    const { account } = useWeb3Provider()
    const { block, yaxis } = useGlobal()

    const address = useMemo(() => yaxis?.contracts?.yaxis?.options?.address, [yaxis])
    const { balance: walletBalance, loading: loadingWalletBalance } = useTokenBalance(address)

    const stakingAddress = useMemo(() => yaxis?.contracts?.rewards?.Yaxis?.options?.address, [yaxis])
    const { balance: sBalance, loading: sBalanceLoading } = useTokenBalance(stakingAddress)

    const priceMap = usePriceMap()

    const getData = useCallback(async () => {
        try {
            const data = {
                sYaxisBalance: sBalance,
                stakedBalance: sBalance.div(1e18),
                walletBalance,
                stakedBalanceUSD:
                    sBalance
                        .div(1e18)
                        .multipliedBy(priceMap?.YAXIS),
                yaxisBalance: walletBalance.div(1e18),
            }
            setBalances(data)
            setLoading(false)
        } catch (err) { }
    }, [priceMap, sBalance, walletBalance])


    useEffect(() => {
        setBalances(defaultState)
        if (account) setLoading(true)
    }, [
        account,
    ])

    useEffect(() => {
        if (!sBalanceLoading && !loadingWalletBalance) {
            getData()
        }
    }, [
        block,
        getData,
        sBalanceLoading,
        loadingWalletBalance,
    ])
    return { loading, balances }
}

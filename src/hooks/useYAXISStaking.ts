import { useEffect, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import useWeb3Provider from './useWeb3Provider'
import useGlobal from './useGlobal'
import useContractReadAccount from './useContractReadAccount'
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
    const { block } = useGlobal()

    const { data: walletBalance, loading: loadingWalletBalance } = useContractReadAccount({
        contractName: `yaxis`,
        method: 'balanceOf',
        args: [account],
    })

    const { data: sBalance, loading: sBalanceLoading } = useContractReadAccount({
        contractName: `rewards.Yaxis`,
        method: 'balanceOf',
        args: [account],
    })

    const priceMap = usePriceMap()

    const getData = useCallback(async () => {
        try {
            const data = {
                sYaxisBalance: new BigNumber(sBalance || 0),
                stakedBalance: new BigNumber(sBalance || 0).div(1e18),
                walletBalance: new BigNumber(walletBalance || 0),
                stakedBalanceUSD:
                    sBalance ? new BigNumber(sBalance)
                        .div(1e18)
                        .multipliedBy(priceMap?.YAXIS) : new BigNumber(0),
                yaxisBalance: walletBalance ? new BigNumber(walletBalance).div(1e18) : new BigNumber(0),
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

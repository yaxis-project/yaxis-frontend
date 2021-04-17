import { useState, useMemo, useEffect } from 'react'
import useWeb3Provider from './useWeb3Provider'
import { currentConfig } from '../yaxis/configs'
import useEarnings from './useEarnings'
import useYAXStaking from './useYAXStaking'
import useStakedBalance from './useStakedBalance'
import useTokenBalance from './useTokenBalance'
import useContractReadAccount from './useContractReadAccount'
import BigNumber from 'bignumber.js'

const defaultState = {
    mvEarnings: new BigNumber(0),
    earnings: new BigNumber(0),
    balances: {
        sYaxBalance: new BigNumber(0),
        stakedBalance: new BigNumber(0),
        stakedBalanceUSD: new BigNumber(0),
        rate: new BigNumber(0),
        walletBalance: new BigNumber(0),
        yaxBalance: new BigNumber(0),
    },
    yaxisBalance: new BigNumber(0),
    stakedUniLP: new BigNumber(0),
    uniLPBalance: new BigNumber(0),
    linkLPBalance: new BigNumber(0),
    mvltBalance: new BigNumber(0),
    stakedMvlt: new BigNumber(0),
}

const useSwapData = () => {
    const { chainId, account } = useWeb3Provider()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(defaultState)
    const [initialized, setInitialized] = useState(false)

    // Claim
    const config = useMemo(() => currentConfig(chainId), [chainId])
    const uniYaxEthLP = useMemo(
        () => config.pools.find((pool) => pool.name === 'Uniswap YAX/ETH'),
        [config],
    )
    const { balance: earnings, loading: loadingEarnings } = useEarnings(
        uniYaxEthLP.pid,
    )

    const {
        loading: mvEarningsLoading,
        data: mvEarnings,
    } = useContractReadAccount({
        contractName: `yaxisMetaVault`,
        method: 'pendingYax',
        args: [account],
    })

    // Swap

    const { balances, loading: stakingLoading } = useYAXStaking()

    // Stake

    const {
        loading: loadingStakedMvlt,
        data: stakedMvlt,
    } = useContractReadAccount({
        contractName: `yaxisMetaVault`,
        method: 'userInfo',
        args: [account],
        result: 'amount',
    })

    const {
        balance: mvltBalance,
        loading: loadingMvltBalance,
    } = useTokenBalance(config.contractAddresses.yAxisMetaVault)

    const linkYaxEthLP = useMemo(
        () => config.pools.find((pool) => pool.name === 'Linkswap YAX/ETH'),
        [config],
    )
    const {
        balance: linkLPBalance,
        loading: linkLPBalanceLoading,
    } = useTokenBalance(linkYaxEthLP?.lpAddress)

    const {
        balance: uniLPBalance,
        loading: uniLPBalanceLoading,
    } = useTokenBalance(uniYaxEthLP?.lpAddress)

    const {
        balance: stakedUniLP,
        loading: uniLPStakedLoading,
    } = useStakedBalance(uniYaxEthLP?.pid)

    const {
        balance: yaxisBalance,
        loading: loadingYaxisBalance,
    } = useTokenBalance(config.contractAddresses.yaxis)

    useEffect(() => {
        const data = () => {
            setData({
                earnings,
                mvEarnings,
                balances,
                yaxisBalance,
                stakedUniLP,
                uniLPBalance,
                linkLPBalance,
                mvltBalance,
                stakedMvlt: new BigNumber(stakedMvlt),
            })

            if (!initialized) setInitialized(true)
            setLoading(false)
        }

        if (
            !mvEarningsLoading &&
            !loadingEarnings &&
            !stakingLoading &&
            !loadingYaxisBalance &&
            !uniLPStakedLoading &&
            !uniLPBalanceLoading &&
            !(chainId === 1 && linkLPBalanceLoading) &&
            !loadingMvltBalance &&
            !loadingStakedMvlt
        ) {
            data()
        }
    }, [
        account,
        initialized,
        chainId,
        loadingEarnings,
        earnings,
        mvEarningsLoading,
        mvEarnings,
        stakingLoading,
        balances,
        loadingYaxisBalance,
        yaxisBalance,
        uniLPStakedLoading,
        stakedUniLP,
        uniLPBalanceLoading,
        uniLPBalance,
        linkLPBalanceLoading,
        linkLPBalance,
        loadingMvltBalance,
        mvltBalance,
        loadingStakedMvlt,
        stakedMvlt,
    ])

    return { initialized, data, loading }
}

export default useSwapData

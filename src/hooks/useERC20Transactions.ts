import { useState, useEffect, useCallback, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { currentConfig } from '../yaxis/configs'
import * as currencies from '../utils/currencies'
import useGlobal from '../hooks/useGlobal'
import BN from 'bignumber.js'

const mvCurrs = ['DAI', 'USDT', 'USDC', 'CRV3']

const defaultState = {
    metaVault: { USD: new BN(0), YAX: new BN(0) },
    staking: { YAX: new BN(0) },
}

const useERC20Transactions = () => {
    const { account, chainId } = useWeb3React()
    const { block } = useGlobal()
    const [state, setState] = useState(defaultState)
    const [loading, setLoading] = useState(true)
    const config = useMemo(() => currentConfig(chainId), [chainId])


    const getState = useCallback(async () => {
        if (account) {
            try {
                setLoading(true)

                // TODO: to USD
                // const prices = await (
                // 	await fetch(
                // 		`https://api.coingecko.com/api/v3/coins/yaxis/market_chart/range?vs_currency=usd&from=1392577232&to=1422577232`,
                // 	)
                // ).json()

                const erc20Txs = await (
                    await fetch(
                        `https://api${chainId === 42 ? '-kovan' : ''
                        }.etherscan.io/api?module=account&action=tokentx&address=${account}&startblock=0&endblock=999999999&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY
                        }`,
                    )
                ).json()

                const totals = erc20Txs.result.reduce(
                    (acc, curr) => {
                        // DEPOSIT MV
                        mvCurrs.forEach((c) => {
                            if (
                                curr.tokenSymbol === c &&
                                curr.from === account.toLowerCase() &&
                                curr.to ===
                                config.contractAddresses.stableSwap3PoolConverter.toLowerCase()
                            ) {
                                acc.metaVault.USD = acc.metaVault.USD.minus(
                                    new BN(curr.value).div(
                                        10 **
                                        currencies[curr.tokenSymbol]
                                            .decimals,
                                    ),
                                )
                            }
                        })

                        // WITHDRAW MV
                        mvCurrs.forEach((c) => {
                            if (
                                curr.tokenSymbol === c &&
                                curr.to === account.toLowerCase() &&
                                curr.from ===
                                config.contractAddresses.yAxisMetaVault.toLowerCase()
                            ) {
                                acc.metaVault.USD = acc.metaVault.USD.plus(
                                    new BN(curr.value).div(
                                        10 **
                                        currencies[curr.tokenSymbol]
                                            .decimals,
                                    ),
                                )
                            }
                        })

                        // MV REWARDS
                        if (
                            curr.tokenSymbol === 'YAX' &&
                            curr.to === account.toLowerCase() &&
                            curr.from ===
                            config.contractAddresses.yAxisMetaVault.toLowerCase()
                        ) {
                            acc.metaVault.YAX = acc.metaVault.YAX.plus(
                                new BN(curr.value).div(10 ** 18),
                            )
                        }

                        // DEPOSIT STAKING
                        if (
                            curr.tokenSymbol === 'YAX' &&
                            curr.from === account.toLowerCase() &&
                            curr.to ===
                            config.contractAddresses.xYaxStaking.toLowerCase()
                        ) {
                            acc.staking.YAX = acc.staking.YAX.minus(
                                new BN(curr.value).div(10 ** 18),
                            )
                        }

                        // WITHDRAW STAKING
                        if (
                            curr.tokenSymbol === 'YAX' &&
                            curr.to === account.toLowerCase() &&
                            curr.from ===
                            config.contractAddresses.xYaxStaking.toLowerCase()
                        ) {
                            acc.staking.YAX = acc.staking.YAX.plus(
                                new BN(curr.value).div(10 ** 18),
                            )
                        }

                        return acc
                    },
                    {
                        metaVault: { USD: new BN(0), YAX: new BN(0) },
                        staking: { YAX: new BN(0) },
                    },
                )
                setState(totals)
                setLoading(false)
            } catch (e) {
                // ignore
            }
        }
    }, [
        account,
        chainId,
        config.contractAddresses.stableSwap3PoolConverter,
        config.contractAddresses.xYaxStaking,
        config.contractAddresses.yAxisMetaVault,
    ])

    // useEffect(() => {
    //     if (account) setLoading(true)
    //     setState(defaultState)
    // }, [account])

    useEffect(() => {
        getState()
    }, [getState, block])

    return { loading, state }
}

export default useERC20Transactions

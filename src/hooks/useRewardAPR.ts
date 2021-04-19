import { useEffect, useMemo, useState } from 'react'
import useGlobal from './useGlobal'
import { RewardsContracts } from '../yaxis/type'
import { Contract } from 'web3-eth-contract'
import objectPath from 'object-path'
import BigNumber from 'bignumber.js'

interface Params {
    rewardsContract: keyof RewardsContracts
}

const useRewardAPY = ({ rewardsContract }: Params) => {
    const [data, setData] = useState(new BigNumber(0))
    const [loading, setLoading] = useState(true)

    const { yaxis } = useGlobal()

    const contract = useMemo(() => {
        const c = objectPath.get(
            yaxis?.contracts,
            `rewards.${rewardsContract}`,
        ) as Contract
        if (!c)
            console.log(
                `Unable to initialize contract: Rewards ${rewardsContract}`,
            )
        return c
    }, [yaxis, rewardsContract])

    const pool = useMemo(
        () => yaxis?.contracts.pools.find((p) => p.rewards === rewardsContract),
        [yaxis, rewardsContract],
    )

    useEffect(() => {
        const get = async () => {
            const calls = []
            calls.push(await contract.methods.totalSupply().call())
            calls.push(await contract.methods.duration().call())
            const [totalSupply, duration] = await Promise.all(calls)
            const balance = await yaxis?.contracts.yaxis.methods
                .balanceOf(contract.options.address)
                .call()
            const reserves = await pool?.lpContract.methods.getReserves().call()
            const tvl = pool
                ? new BigNumber(reserves['_reserve0']).plus(
                    new BigNumber(reserves['_reserve1']).multipliedBy(
                        new BigNumber(reserves['_reserve0']).dividedBy(
                            new BigNumber(reserves['_reserve1']),
                        ),
                    ),
                )
                : totalSupply
            const funding = pool ? new BigNumber(balance) : new BigNumber(balance).minus(tvl)
            if (funding.lt(0)) {
                setData(new BigNumber(0))
                setLoading(false)
                return
            }

            const period = new BigNumber(duration).dividedBy(86400)
            const rewardPerToken = funding.dividedBy(tvl)
            const apr = rewardPerToken
                .dividedBy(period)
                .multipliedBy(365)
                .multipliedBy(100)
            setData(apr)
            setLoading(false)
        }
        if (contract) get()
    }, [contract, yaxis?.contracts, pool])

    return { loading, data }
}

export default useRewardAPY

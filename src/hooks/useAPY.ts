import { useState, useEffect, useMemo } from 'react'
import useYAxisAPY from './useYAxisAPY'
import useContractRead from './useContractRead'
import useComputeTVL from './useComputeTVL'
import BigNumber from 'bignumber.js'
import { getCurveApyApi } from '../yaxis/utils'
import { RewardsContracts } from '../yaxis/type'

const defaultState = {
    lpApyPercent: new BigNumber(0),
    threeCrvApyPercent: new BigNumber(0),
    yaxisApyPercent: new BigNumber(0),
    yaxisAprPercent: new BigNumber(0),
    totalAPY: new BigNumber(0),
    totalAPR: new BigNumber(0),
}

export default function useAPY(
    rewardsContract: keyof RewardsContracts,
    strategyPercentage: number,
) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(defaultState)

    const {
        stakingTvl,
        liquidityTvl,
        metavaultTvl,
        yaxisPrice,
    } = useComputeTVL()

    const tvl = useMemo(() => {
        if (rewardsContract === 'Yaxis') return stakingTvl
        if (rewardsContract === 'YaxisEth') return liquidityTvl
        return metavaultTvl
    }, [stakingTvl, liquidityTvl, metavaultTvl, rewardsContract])

    /* Curve.fi gauges */
    const { yAxisAPY, isInitialized } = useYAxisAPY()

    /* 3POOL APY */
    const [loadingCurveAPY, setloadingCurveAPY] = useState(true)
    const [curveApy, setCurveApy] = useState(0)
    useEffect(() => {
        const fetchCurveApy = async () => {
            const value = await getCurveApyApi()
            setCurveApy(value)
            setloadingCurveAPY(false)
        }
        fetchCurveApy()
    }, [])

    /* YAXIS Rewards  */
    const {
        data: yaxisRewardPerBlock,
        loading: loadingYaxisRewardPerBlock,
    } = useContractRead({
        contractName: `rewards.${rewardsContract}`,
        method: 'rewardPerToken',
    })

    useEffect(() => {
        const getData = () => {
            const BLOCKS_PER_DAY = new BigNumber(6467)
            const BLOCKS_PER_YEAR = BLOCKS_PER_DAY.multipliedBy(365)

            const yaxisPerBlock = new BigNumber(yaxisRewardPerBlock).dividedBy(10 ** 18)

            const supply = tvl.dividedBy(yaxisPrice)
            const yaxisAprPercent = yaxisPerBlock
                .multipliedBy(BLOCKS_PER_YEAR)
                .multipliedBy(yaxisPrice)
                .dividedBy(supply)
                .multipliedBy(100)

            const yaxisApyPercent = yaxisAprPercent
                .div(100)
                .dividedBy(52)
                .plus(1)
                .pow(52)
                .minus(1)
                .multipliedBy(100)

            let lpApyPercent = new BigNumber(curveApy).times(100)
            if (strategyPercentage)
                lpApyPercent = lpApyPercent.multipliedBy(strategyPercentage)

            let threeCrvApyPercent = new BigNumber(
                (yAxisAPY && yAxisAPY['3crv']) || 0,
            )
            if (strategyPercentage)
                threeCrvApyPercent = threeCrvApyPercent.multipliedBy(
                    strategyPercentage,
                )

            const strategyAPR = lpApyPercent.plus(threeCrvApyPercent)

            const strategyAPY = strategyAPR
                .div(100)
                .div(12)
                .plus(1)
                .pow(12)
                .minus(1)
                .times(100)
                .decimalPlaces(18)

            const totalAPR = yaxisAprPercent.plus(strategyAPR)
            const totalAPY = yaxisApyPercent.plus(strategyAPY)

            setData({
                lpApyPercent,
                threeCrvApyPercent,
                yaxisAprPercent,
                yaxisApyPercent,
                totalAPY,
                totalAPR,
            })
            setLoading(false)
        }
        if (isInitialized && !loadingCurveAPY && !loadingYaxisRewardPerBlock)
            getData()
    }, [
        strategyPercentage,
        isInitialized,
        loadingCurveAPY,
        loadingYaxisRewardPerBlock,
        curveApy,
        yAxisAPY,
        yaxisRewardPerBlock,
        yaxisPrice,
        tvl,
    ])

    return {
        loading,
        data,
    }
}

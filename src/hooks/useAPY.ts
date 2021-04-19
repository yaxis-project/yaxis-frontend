import { useState, useEffect, useMemo } from 'react'
import useYAxisAPY from './useYAxisAPY'
import useRewardAPR from './useRewardAPR'
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
    strategyPercentage?: number,
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
        data: rewardsAPR,
        loading: loadingRewardPerToken,
    } = useRewardAPR(
        { rewardsContract },
    )


    useEffect(() => {
        const getData = () => {
            const yaxisApyPercent = rewardsAPR
                .div(100)
                .dividedBy(365)
                .plus(1)
                .pow(365)
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

            const totalAPR = rewardsAPR.plus(strategyAPR)
            const totalAPY = yaxisApyPercent.plus(strategyAPY)

            setData({
                lpApyPercent,
                threeCrvApyPercent,
                yaxisAprPercent: rewardsAPR,
                yaxisApyPercent,
                totalAPY,
                totalAPR,
            })
            setLoading(false)
        }
        if (isInitialized && !loadingCurveAPY && !loadingRewardPerToken)
            getData()
    }, [
        strategyPercentage,
        isInitialized,
        loadingCurveAPY,
        curveApy,
        yAxisAPY,
        yaxisPrice,
        tvl,
        loadingRewardPerToken,
        rewardsAPR
    ])

    return {
        loading,
        data,
    }
}

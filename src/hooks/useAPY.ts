import { useState, useEffect } from 'react'
import useYAxisAPY from './useYAxisAPY'
import useContractRead from './useContractRead'
import BigNumber from 'bignumber.js'
import { getCurveApyApi } from '../yaxis/utils'
import { RewardsContracts } from '../yaxis/type'

const defaultState = {
    lpApyPercent: new BigNumber(0),
    threeCrvApyPercent: new BigNumber(0),
    yaxisApyPercent: new BigNumber(0),
    totalAPY: new BigNumber(0),
    totalAPR: new BigNumber(0),
}

export default function useAPY(
    rewardsContract: keyof RewardsContracts,
    strategyPercentage: number,
) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(defaultState)

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
            const blocksPerDay = 6467
            const yaxisApyPercent = new BigNumber(blocksPerDay).multipliedBy(
                yaxisRewardPerBlock,
            )
            console.log('curveApy', curveApy)
            let lpApyPercent = new BigNumber(curveApy).times(100)
            if (strategyPercentage) lpApyPercent = lpApyPercent.multipliedBy(strategyPercentage)

            let threeCrvApyPercent = new BigNumber(
                (yAxisAPY && yAxisAPY['3crv']) || 0,
            )
            if (strategyPercentage) threeCrvApyPercent = threeCrvApyPercent.multipliedBy(strategyPercentage)

            const strategyAPR = lpApyPercent.plus(threeCrvApyPercent)

            const strategyAPY = strategyAPR
                .div(100)
                .div(365)
                .plus(1)
                .pow(365)
                .minus(1)
                .times(100)
                .decimalPlaces(18)

            const totalAPR = yaxisApyPercent.plus(strategyAPR)
            const totalAPY = yaxisApyPercent.plus(strategyAPY)

            setData({
                lpApyPercent,
                threeCrvApyPercent,
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
    ])

    return {
        loading,
        data,
    }
}

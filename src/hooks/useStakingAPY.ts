import { useState, useCallback, useEffect } from 'react'
import useYAxisAPY from './useYAxisAPY'
import useMetaVaultData from './useMetaVaultData'
// import useStaking from './useStaking'
import usePriceMap from './usePriceMap'
import useGlobal from './useGlobal'
import BigNumber from 'bignumber.js'
import { getTotalStaking } from '../yaxis/utils'

const defaultState = {
    yaxAPY: new BigNumber(0),
    metavaultAPY: new BigNumber(0),
    totalApy: new BigNumber(0),
    rate: 0,
}

const useStakingAPY = () => {
    const [data, setData] = useState(defaultState)
    const [loading, setLoading] = useState(true)

    const { yAxisAPY } = useYAxisAPY()
    const { metaVaultData } = useMetaVaultData('v1')
    // const { stakingData } = useStaking()
    const priceMap = usePriceMap()
    const { yaxis, block } = useGlobal()

    const fetchData = useCallback(async () => {
        const totalSupply = await getTotalStaking(yaxis)
        const pricePerFullShare = new BigNumber(
            await yaxis.contracts.xYaxStaking.methods
                .getPricePerFullShare()
                .call(),
        ).div(1e18)
        const threeCrvApyPercent = new BigNumber(
            (yAxisAPY && yAxisAPY['3crv']) || 0,
        )
        const totalValueLocked =
            new BigNumber(totalSupply)
                .div(1e18)
                .times(priceMap?.YAXIS)
                .toNumber() || 0
        const sumApy = new BigNumber(threeCrvApyPercent)
            .div(100)
            .multipliedBy(0.2)
        const annualProfits = sumApy
            .div(365)
            .plus(1)
            .pow(365)
            .minus(1)
            .times(metaVaultData?.tvl || 0)

        const rate = pricePerFullShare.toNumber()

        let metavaultAPY = new BigNumber(annualProfits)
            .dividedBy(totalValueLocked || 1)
            .multipliedBy(100)

        /* TODO: hook up new rewards APY */
        // let yaxAPY = stakingData?.incentiveApy
        //     ? new BigNumber(stakingData?.incentiveApy)
        //         .div(pricePerFullShare)
        //         .div(100)
        //     : new BigNumber(0)
        const yaxAPY = new BigNumber(0)
        const totalApy = yaxAPY.plus(metavaultAPY)
        setData({ yaxAPY, metavaultAPY, totalApy, rate })
        setLoading(false)
    }, [
        yaxis,
        yAxisAPY,
        metaVaultData?.tvl,
        priceMap?.YAXIS,
        // stakingData?.incentiveApy,
    ])

    useEffect(() => {
        if (yaxis) {
            fetchData()
        }
    }, [yaxis, fetchData, block])

    return { ...data, loading }
}

export default useStakingAPY

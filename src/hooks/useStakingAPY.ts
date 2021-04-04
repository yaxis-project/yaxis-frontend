import { useState, useMemo, useEffect } from 'react'
import useYAxisAPY from './useYAxisAPY'
import useMetaVaultData from './useMetaVaultData'
import useStaking from './useStaking'
import usePriceMap from './usePriceMap'
import useYaxis from './useYaxis'
import useBlock from './useBlock'
import BigNumber from 'bignumber.js'
import { getTotalStaking } from '../yaxis/utils'


const useStakingAPY = () => {
    const [loading, setLoading] = useState(true)

    const { yAxisAPY } = useYAxisAPY()

    const [totalSupply, setTotalStaking] = useState<BigNumber>(new BigNumber(0))
    const [pricePerFullShare, setPricePerFullShare] = useState<BigNumber>(
        new BigNumber(0),
    )
    const { stakingData } = useStaking()
    const yaxis = useYaxis()
    const block = useBlock()

    useEffect(() => {
        async function fetchTotalStakinga() {
            const totalStaking = await getTotalStaking(yaxis)
            setTotalStaking(totalStaking)
        }
        async function fetchPricePerFullShare() {
            try {
                const value = await yaxis.contracts.xYaxStaking.methods
                    .getPricePerFullShare()
                    .call()
                setPricePerFullShare(new BigNumber(value).div(1e18))
            } catch (e) { }
        }

        if (yaxis) {
            fetchTotalStakinga()
            fetchPricePerFullShare()
        }
    }, [yaxis, setTotalStaking, block])

    const { metaVaultData } = useMetaVaultData('v1')
    const threeCrvApyPercent = useMemo(
        () => new BigNumber((yAxisAPY && yAxisAPY['3crv']) || 0),
        [yAxisAPY],
    )
    const priceMap = usePriceMap()
    const totalValueLocked =
        new BigNumber(totalSupply)
            .div(1e18)
            .times(priceMap?.YAXIS)
            .toNumber() || 0
    const sumApy = new BigNumber(threeCrvApyPercent).div(100).multipliedBy(0.2)
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

    let yaxAPY = stakingData?.incentiveApy
        ? new BigNumber(stakingData?.incentiveApy)
            .div(pricePerFullShare)
            .div(100)
        : new BigNumber(0)
    const totalApy = yaxAPY.plus(metavaultAPY)


    return { yaxAPY, metavaultAPY, totalApy, rate }
}

export default useStakingAPY

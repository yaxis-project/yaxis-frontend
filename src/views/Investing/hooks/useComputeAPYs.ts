import { useEffect, useState } from 'react';
import { provider } from 'web3-core';
import useYaxis from '../../../hooks/useYaxis';
import usePriceMap from '../../../hooks/usePriceMap';
import { useWallet } from 'use-wallet';
import useStaking from '../../../hooks/useStaking';
import useYAxisAPY from '../../../hooks/useYAxisAPY';
import useMetaVaultData from '../../../hooks/useMetaVaultData';
import { getTotalStaking } from '../../../yaxis/utils';
import BigNumber from 'bignumber.js';

/**
 * Computes the total generated APY across all stablecoin yield farms.
 */
export default function useComputeAPYs() {
  const [totalApy, setTotalAPY] = useState<BigNumber>(new BigNumber(0));
  const yaxis = useYaxis();
  const priceMap = usePriceMap();
  const { account } = useWallet<provider>();
  const { stakingData } = useStaking();
  const { yAxisAPY } = useYAxisAPY();
  const { metaVaultData } = useMetaVaultData('v1')
   
  const setAPY = async () => {
    try {
      const totalSupply = await getTotalStaking(yaxis)
      const threeCrvApyPercent = new BigNumber((yAxisAPY && yAxisAPY['3crv']) || 0)
      const totalValueLocked = new BigNumber(totalSupply).div(1e18).times(priceMap?.YAX).toNumber() || 0
      const sumApy = new BigNumber(threeCrvApyPercent).div(100).multipliedBy(0.2)
      const annualProfits = sumApy
        .div(365)
        .plus(1)
        .pow(365)
        .minus(1)
        .times(metaVaultData?.tvl || 0);
      let metavaultAPY = new BigNumber(annualProfits).dividedBy(totalValueLocked || 1).multipliedBy(100)
      const value = await yaxis.contracts.xYaxStaking.methods.getPricePerFullShare().call();
      const pricePerFullShare = new BigNumber(value).div(1e18);
      const yaxAPY = new BigNumber(stakingData?.incentiveApy || 0)
          .div(pricePerFullShare)
          .div(100);
      setTotalAPY(yaxAPY.plus(metavaultAPY));
    } catch (e) {
    }
  }

  useEffect(() => {
    setAPY();
  }, [yaxis]);

  return totalApy;
}
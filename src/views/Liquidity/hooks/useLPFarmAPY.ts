import BigNumber from "bignumber.js";
import useFarms from "../../../hooks/useFarms";
import { useState, useEffect, useMemo } from "react";
import useLPContractData from "../../../hooks/useLPContractData";
import { UNI_ETH_YAX_LP } from "../../../utils/currencies";
import { getApy } from "../../../utils/number";
import { getYaxisPrice } from "../../../yaxis/utils";
import useRewardPerBlock from "../../../hooks/useRewardPerBlock";

/**
 * Returns farm APY for the Uniswap ETH-YAX Liquidity pool.
 */
export default function useLPFarmAPY() {
  const { farms, stakedValues } = useFarms();
  const yaxisPrice = getYaxisPrice(stakedValues, farms);
	const rewardPerBlock = useRewardPerBlock();
  const { farmData: { pid } } = useLPContractData('YAX', UNI_ETH_YAX_LP);
  
  return useMemo(() => {
    let stakedValue = stakedValues.find(value => value.pid == pid);
    let poolWeight = stakedValue?.poolWeight?.toNumber() ?? 0;
    let farmApy = getApy(stakedValue?.tvl, yaxisPrice.toNumber(), rewardPerBlock,poolWeight);
    return new BigNumber(farmApy||'0');
  }, [stakedValues, yaxisPrice, rewardPerBlock]);
}
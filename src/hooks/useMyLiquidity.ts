import { useState, useEffect } from "react"
import useFarm from "./useFarm"
import useTokenBalance from "./useTokenBalance"
import BigNumber from "bignumber.js";

/**
 * Liquidity Data object.
 */
export interface LiquidityData {
  tokenBalance: BigNumber;
  userPoolShare: BigNumber;
  totalSupply: BigNumber;
  userBalance: BigNumber; 
}

/**
 * Returns details about the logged in user's liquidity pool stats.
 * @param farmId FarmID passed to fetch contract data.
 * @returns {LiquidityData}
 * @see useFarm
 */
export default function useMyLiquidity(farmId: string): LiquidityData {
  const farm = useFarm(farmId);
  const [userPoolShare, setUserPoolShare] = useState<BigNumber>(new BigNumber(0));
  const [totalSupply, setTotalSupply] = useState<BigNumber>(new BigNumber(0));
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(new BigNumber(0));

  const userBalance = useTokenBalance(farm?.lpContract?.options?.address);

  useEffect(() => {
    if (!(farm && farm.lpContract)) return;
    const getSupplyValue = async () => {
      const { lpContract } = farm;
      const supplyValue: BigNumber = await lpContract.methods.totalSupply().call();
      setTokenBalance(userBalance);
      setTotalSupply(supplyValue);
      if (new BigNumber(supplyValue).gt(new BigNumber(0))) setUserPoolShare(userBalance.div(supplyValue));
    }
    getSupplyValue();
  }, [farm, farm?.lpContract, tokenBalance]);

  return { tokenBalance, totalSupply, userPoolShare, userBalance };
}
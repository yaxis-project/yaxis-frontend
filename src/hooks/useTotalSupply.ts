import {useCallback, useEffect, useState} from 'react'
import {provider} from 'web3-core'
import {useWallet} from 'use-wallet'
import BigNumber from "bignumber.js";
import useYaxis from "./useYaxis";
import {getYaxisChefContract, getYaxisSupply} from "../yaxis/utils";
import useBlock from "./useBlock";

const useTotalSupply = () => {
  const [totalSupply, setTotalSupply] = useState<BigNumber>(new BigNumber(0))
  const {account,} = useWallet<provider>()
  const yaxis = useYaxis()
  const yaxisChefContract = getYaxisChefContract(yaxis)
  const block = useBlock()

  const fetchTotalSupply = async () => {
    const supply = await getYaxisSupply(yaxis);
    setTotalSupply(supply)
  };


  useEffect(() => {
    if (yaxis) fetchTotalSupply();
  }, [yaxis, block, account, yaxisChefContract]);
  return totalSupply
}

export default useTotalSupply

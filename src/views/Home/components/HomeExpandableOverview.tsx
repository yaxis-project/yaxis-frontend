import React, { useContext, ReactElement } from 'react'
import { LanguageContext } from '../../../contexts/Language'
import useTVL from '../../../hooks/useComputeTVL'
import useTotalSupply from "../../../hooks/useTotalSupply";
import BigNumber from 'bignumber.js'
import Value from '../../../components/Value'
import phrases from './translations'
import {getBalanceNumber} from '../../../utils/formatBalance'
import info from "../../../assets/img/info.svg";
import { ExpandableSidePanel, ExpandableRow } from '../../../components/ExpandableSidePanel';
import { Tooltip } from 'antd';
import useMetaVaultData from '../../../hooks/useMetaVaultData';

interface TooltipRowProps {
  main: string;
  value: any;
}

const TooltipRow = ({ main, value}: TooltipRowProps) => <>
  <div>{main}</div>
  <div>{value}</div> 
</>

/**
 * Generates an expandable side panel that shows basic overview data for the home page.
 */
export default function HomeExpandableOverview() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;

  const { tvl, stakingTvl, metavaultTvl, liquidityTvl, yaxisPrice } = useTVL();
  const totalSupply = useTotalSupply()
  const { metaVaultData } = useMetaVaultData('v1');

  const hrPrice = yaxisPrice ? (new BigNumber(yaxisPrice)).toNumber() : 0;

  return (<>
    <ExpandableSidePanel header="yAxis Overview" key="1">
      <ExpandableRow main={
        <Tooltip
          title={<>
            <TooltipRow main="MetaVault 2.0" value={"$" + metavaultTvl.toFixed(2)} />
            <TooltipRow main="YAX Staking" value={"$" + stakingTvl.toFixed(2)} />
            <TooltipRow main="YAX + ETH LINKSWAP LP" value={"$" + liquidityTvl.toFixed(2)} />
          </>}
        >
          Total Value Locked <img style={{ position: 'relative', top: -1 }} src={info} height="15" alt="YAX Supply Rewards" />
        </Tooltip>
      }
        secondary={
          <Value value={tvl.toNumber()} numberPrefix="$" decimals={2} />
        }
      />
      <ExpandableRow main="Price of YAX"
        secondary={
          <Value value={hrPrice} numberPrefix="$" decimals={2} />
        }
      />

      <ExpandableRow main={
          <Tooltip
            title={<><TooltipRow main="New rewards per block" value={metaVaultData?.rewardPerBlock} /></>}
          >
            Yax Supply <img src={info} height="15" alt="YAX Supply Rewards" />
          </Tooltip>
        }
        secondary={
          <Value value={totalSupply ? getBalanceNumber(totalSupply) : ''} decimals={2} />
        }
      />
    </ExpandableSidePanel>
  </>)
}
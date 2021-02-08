import React, { useState, useContext, useMemo } from 'react'
import { Typography } from 'antd';
import { LanguageContext } from '../../../contexts/Language'
import { provider } from 'web3-core';
import { useWallet } from 'use-wallet';
import { YAX } from '../../../utils/currencies'
import Value from '../../../components/Value';
import useAccountReturns from '../../../hooks/useAccountReturns';
import useYaxisStaking from "../../../hooks/useYaxisStaking";
import phrases from './translations'
import { DetailOverviewCard, DetailOverviewCardRow } from '../../../components/DetailOverviewCard';
import useYAxisAPY from '../../../hooks/useYAxisAPY';
import BigNumber from 'bignumber.js';

const { Text, Title } = Typography;


export default function () {
  const [loading, setLoading] = useState(true);
  setTimeout(() => setLoading(false), 1000);
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;

  const t = (s: string) => (phrases[s][language]);

  const { yaxReturns, yaxReturnsUSD } = useAccountReturns();
  const { stakedBalance } = useYaxisStaking(YAX);
  const { yAxisAPY } = useYAxisAPY();
  const threeCrvApyPercent = useMemo(() => new BigNumber((yAxisAPY && yAxisAPY['3crv']) || 0), [yAxisAPY]);

  return <DetailOverviewCard title={t("Account Overview")}>
    <DetailOverviewCardRow>
      <Text>Returns</Text>
      <Value numberPrefix="$" value={yaxReturnsUSD} extra={`${yaxReturns} YAX`} decimals={2} />
    </DetailOverviewCardRow>
    <DetailOverviewCardRow>
      <Text>YAX Staked</Text>
      <Value value={stakedBalance.toFixed(3)} numberSuffix=" YAX" />
    </DetailOverviewCardRow>
    <DetailOverviewCardRow>
       <Text>Weekly Average APY</Text>
       <Value value={threeCrvApyPercent.toFixed(2)} numberSuffix="%" />
    </DetailOverviewCardRow>
  </DetailOverviewCard>
}
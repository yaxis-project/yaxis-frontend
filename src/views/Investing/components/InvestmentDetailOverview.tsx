import React, { useContext, } from 'react';
import { Typography } from 'antd';
import Value from '../../../components/Value';
import useAccountReturns from '../../../hooks/useAccountReturns';
import { LanguageContext } from '../../../contexts/Language';
import phrases from './translations';
import { DetailOverviewCard, DetailOverviewCardRow } from '../../../components/DetailOverviewCard';

import useComputeAPYs from '../hooks/useComputeAPYs';

const {  Text } = Typography;

const InvestmentDetailOverview: React.FC = () => {

  const languages = useContext(LanguageContext);
  const language = languages.state.selected;

  const t = (s: string) => (phrases[s][language]);

  const { yaxReturns, yaxReturnsUSD } = useAccountReturns();
  const totalAPY = useComputeAPYs();

  return (<DetailOverviewCard title={t("Account Overview")}>
    <DetailOverviewCardRow>
      <Text>Return</Text>
      <Value numberPrefix="$" value={yaxReturnsUSD} numberSuffix={`${yaxReturns} YAX`} decimals={2} />
    </DetailOverviewCardRow>
    <DetailOverviewCardRow>
      <Text>Total APY</Text>
      <Value value={totalAPY.toFixed(2)} numberSuffix={"%"} decimals={2} />
    </DetailOverviewCardRow>
  </DetailOverviewCard>)
}

export default InvestmentDetailOverview
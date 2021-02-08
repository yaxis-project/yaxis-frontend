import React, { useContext, useMemo } from 'react'
import { LanguageContext } from '../../../contexts/Language'
import {
  Typography, Divider
} from 'antd'
import phrases from './translations'
import { ExpandableSidePanel, ExpandableRow } from '../../../components/ExpandableSidePanel';
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import CountUp from 'react-countup'
import {currentConfig} from "../../../yaxis/configs"
import Value from '../../../components/Value';
import useComputeAnnualProfits from '../../../hooks/useComputeAnnualProfits';
import useComputeTVL from '../../../hooks/useComputeTVL';
import useMetaVault from '../../../hooks/useMetaVault';
const { Text, Title } = Typography;



export default function () {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);
  const { stakingTvl } = useComputeTVL();
  const annualProfits = useComputeAnnualProfits();
  const { strategy } = useMetaVault();

  return (<>
    <ExpandableSidePanel header={t("Vault Stats")} key="1">
      <ExpandableRow
        main={t("Current Strategy")}
        secondary={strategy}
      />
      <ExpandableRow main={t("Total Value Locked")} secondary={<CountUp
          start={0}
          end={stakingTvl.toNumber()}
          decimals={0}
          duration={1}
          prefix="$"
          separator=","
        />} />
      {/*<ExpandableRow main={t("Volume (24h)")} secondary="$[TODO]" />*/}
      <ExpandableRow
        main={t("Distributed Interest (annually)")}
        secondary={
          <Value value={annualProfits} numberPrefix="$" decimals={0} />
        }
      />
    </ExpandableSidePanel>
  </>)
}
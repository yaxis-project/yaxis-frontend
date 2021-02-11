import React, { useContext } from 'react'
import {
  Typography
} from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { DetailOverviewCard, DetailOverviewCardRow } from '../../../components/DetailOverviewCard'

const { Text, Title, Link } = Typography;


export default function () {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;

  const t = (s: string) => (phrases[s][language]);

  return <DetailOverviewCard title={t("Governance Vault")}>
    <DetailOverviewCardRow>
      <Text style={{ margin: 0, display: "block" }} type="secondary">{t("Voting Power from Savings Account")}</Text>
      <Title style={{ margin: 0, marginRight: 10 }} level={5}>8,293 YAX</Title>
      <Link style={{ margin: 0, marginBottom: 24 }}>{t("Go to Savings")} <ArrowRightOutlined /></Link>
    </DetailOverviewCardRow>
    <DetailOverviewCardRow>
      <Text style={{ margin: 0, display: "block" }} type="secondary">{t("Voting Share")}</Text>
      <Title style={{ margin: 0, marginRight: 10, display: "inline-block" }} level={5}>0.0294%</Title>
    </DetailOverviewCardRow>
  </DetailOverviewCard>
}
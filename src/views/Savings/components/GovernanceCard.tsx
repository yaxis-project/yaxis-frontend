import React, { useState, useContext } from 'react'
import {
  Row, Col, Typography, Card
} from 'antd';
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { DetailOverviewCard, DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import { ArrowRightOutlined } from '@ant-design/icons'
const { Text, Title, Link } = Typography;


export default function () {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  return <DetailOverviewCard title={t("Governance")}>
    <DetailOverviewCardRow>
      <Text style={{ margin: 0, display: "block" }}>
        {`You are currently using 0 out of 8,351.01 available YAX for voting.`}
      </Text>
      <Link>Vote in Governance <ArrowRightOutlined /></Link>
    </DetailOverviewCardRow>
  </DetailOverviewCard>
}
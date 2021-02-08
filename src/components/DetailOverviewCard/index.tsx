import React, { useState } from 'react'
import {
  Row, Col, Typography, Card
} from 'antd';
import './index.less';

const { Text, Title } = Typography;

const gridStyle = {
  width: '100%',
};

const gridStyleLast = {
  width: '100%',
  boxShadow: 'none'
};

interface DetailOverviewCardRowProps {
  children: React.ReactNode;
  inline?: React.ReactNode;
}

/**
 * Generates a generic row for a card styled component.
 * @param props DetailOverviewCardProps
 * @see DetailOverviewCard
 */
export function DetailOverviewCardRow(props: DetailOverviewCardRowProps) {
  const { children, inline } = props;
  return (<div className="card-row detail-overview-card-row" style={gridStyle} data-inline={!!inline}>
    {children}
  </div>);
}

interface DetailOverviewCardProps {
  children: React.ReactNode;
  title: React.ReactNode;
}

/**
 * Generates a generic card styled component.
 * @param props DetailOverviewCardProps
 * @see DetailOverviewCardRow
 */
export function DetailOverviewCard (props: DetailOverviewCardProps) {
  const { children, title } = props
  return (<Card className="detail-overview-card"
    style={{ padding: 0 }}
    title={<Title level={4}>{title}</Title>}
  >
    { children }
  </Card>);
}
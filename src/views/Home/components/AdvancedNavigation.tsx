import React from 'react'
import styled from 'styled-components';
import logo from '../../../assets/img/logo-ui.svg'
import logoEth from '../../../assets/img/currencies/eth.svg'
import { currentConfig } from "../../../yaxis/configs";

import {
  Row, Col, Typography, Collapse
} from 'antd';

const { Text,  Link } = Typography;

const { Panel } = Collapse;

interface AdvancedNavigationRowProps {
  contextType: string;
  value: string;
  to: string;
}

const StyledRiskBadge = styled.div`
  background: #BE3333;
  opacity: 0.6;
  color: white;
  display: inline-block;
  border-radius: 4px;
  padding: 4px;
  font-size: 10px;
  line-height: 10px;
  margin-left: 10px;
  height: 18px;
`

/**
 * Generates a row component styled with icons and a given linke.
 * @param props AdvancedNavigationRowProps
 */
function AdvancedNavigationRow (props: AdvancedNavigationRowProps) {
  const { contextType, value, to } = props;
  return (<Row className='lp-row'>
    <Col span={2}>
      <img
        src={logo}
        height="24"
        alt="logo"
      />
      <img
        src={logoEth}
        height="24"
        alt="logo"
      />
    </Col>
    <Col span={20}>
      <Row>
        <Text type="secondary">{ contextType }</Text>
        <StyledRiskBadge>HIGHER RISK</StyledRiskBadge>
      </Row>
      <Row>
        <Link href={to}>{ value }</Link>
      </Row>
    </Col>
  </Row>);
}

const StyledCollapse = styled(Collapse)`
  background-color: #ffffff;
  margin-top: 10px;
`

/**
 * Styled component to contain a collapsable navigation segment.
 * @see AdvancedNavigationRow
 */
export default function AdvancedNavigation () {

  // todo: read from config



  return currentConfig?.pools.length > 0
    ? (
        <StyledCollapse
          expandIconPosition='right'
          className='advanced-navigation'
        >
          <Panel
            header={'Advanced'}
            key="1"
            //style={{ padding: 12 }}
          >
            {currentConfig?.pools.map(pool => (
              <AdvancedNavigationRow
                key={pool.name}
                contextType='Provide Liquidity'
                value={pool.name}
                to='/liquidity'
              />
            ))}
            
          </Panel>
        </StyledCollapse>
    )
    : null
}
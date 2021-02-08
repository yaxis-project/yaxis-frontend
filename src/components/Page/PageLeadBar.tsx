import React from 'react'
import styled from 'styled-components'
import logo from '../../assets/img/logo-ui.svg'
import arrow from '../../assets/img/arrow-ui.svg'
import { NavLink } from 'react-router-dom'
import {
  Row, Col, Typography, Divider
} from 'antd';
const { Title, Text } = Typography;

const StyledMain = styled.div`
  padding: 40px;
  width: 100%;
  margin: auto;
  height: 165px;
  background: #EFF9FF;
`

interface PageLeadBarProps {
  loading: boolean;
  mainTitle: string;
  secondaryText: string;
  value: string;
  valueInfo:string;
}

/**
 * Generates a lead banner for page components.
 * @param props PageLeadBarProps
 */
const PageLeadBar = (props: PageLeadBarProps) => {
  const { mainTitle, secondaryText, value, valueInfo} = props;
  return (
      <StyledMain>
        <Row style={{ maxWidth: 1116, margin: 'auto', alignItems: 'center' }}>
          <Col style={{ marginRight: '80px' }}>
            <NavLink to="/">
              <img
                src={arrow}
                height="24"
                alt="logo"
              />
            </NavLink>
            
          </Col>
          <Col style={{ marginRight: '24px' }}>
            <img
              src={logo}
              height="51"
              alt="logo"
            />
          </Col>
          <Col style={{ marginRight: '43px' }}>
            <Title style={{ margin: 0, fontWeight: 700, fontSize: 32 }} level={5}>{mainTitle}</Title>
            <Text type="secondary">{secondaryText}</Text>
          </Col>
          <Divider type={'vertical'} style={{ height: '80px'}}/>
          <Col style={{ marginLeft: '40px' }}>
            <Title style={{ margin: 0, fontWeight: 700, fontSize: 32 }} level={5}>{value}</Title>
            <Text type="secondary">{valueInfo}</Text>
          </Col>
        </Row>
      </StyledMain>
    );
}

export default PageLeadBar;
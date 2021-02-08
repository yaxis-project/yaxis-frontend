import React from 'react'
import styled from 'styled-components'
import { Layout, Row, Col } from 'antd';
import Logo from '../Logo'

import AccountButton from './components/AccountButton'
import Nav from './components/Nav'

const { Header } = Layout;

const TopBar = ({ home }: any) => {
    return (<Background home={home}>
        <StyledTopBar>
            <Row gutter={4} style={{ width: '100%' }} align="middle">
            <Col style={{padding: '0px 13px 13px 2px'}}>
                <StyledLogoWrapper>
                <Logo />
                </StyledLogoWrapper>
            </Col>
            <Col flex="auto" style={{ color: "white" }}>
                <Nav/>
            </Col>
            <StyledAccountButtonWrapper>
                <AccountButton/>
            </StyledAccountButtonWrapper>
            </Row>
        </StyledTopBar>
    </Background>
  )
}

const Background = ({ home, children }: any) => {
    return home ? <BGHomeUnderlay>
        {children}
    </BGHomeUnderlay> : <BGUnderlay>
        {children}
    </BGUnderlay>
}

const BGUnderlay = styled(Header)`
  width: 100%;
  height: 80px;
  background: linear-gradient(180deg, #016EAC 20.17%, #52B2DC 100%);
`;


const BGHomeUnderlay = styled(Header)`
  width: 100%;
  height: 400px;
  background: linear-gradient(180deg, #016EAC 20.17%, #52B2DC 100%);
`;

const StyledLogoWrapper = styled.div`
  img{
    width: auto;
    height: auto;
  }
  @media (max-width: 400px) {
    width: auto;
  }
`;

const StyledTopBar = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 10px 0 0 0;
  max-width: ${(props) => props.theme.siteWidth}px;
  margin: 0 auto;
  @media (max-width: ${(props) => props.theme.siteWidth}px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`

const StyledAccountButtonWrapper = styled(Col)`
  text-align: right;
  @media (max-width: ${(props) => props.theme.siteWidth}px) {
    text-align: center;
  }
`

export default TopBar

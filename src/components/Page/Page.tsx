import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import TopBar from './../TopBar';
import Footer from './../Footer';
import PageLeadBar from './PageLeadBar';

const { Content } = Layout;

export const HomePage: React.FC = ({ children }) => (
    <StyledLayout>
        <TopBar home />
        <StyledContent>
            <StyledPage>
                <StyledMain>{children}</StyledMain>
            </StyledPage>
        </StyledContent>
        <Footer />
    </StyledLayout>
)

const StyledPage = styled.div`
    position: relative;
    top: -310px;
`

const StyledMain = styled.div`
  max-width: ${(props) => props.theme.siteWidth}px;
  margin: auto;
`

const StyledLayout = styled(Layout)`
  background: #FAFBFD;
`

const StyledContent = styled(Content)`
  //min-height: 450px;
  //margin-top: 25px;
`

interface PageProps {
  loading: boolean;
  mainTitle: string;
  secondaryText: string;
  value: string;
  valueInfo:string;
  children: React.ReactElement;
}

const Page = ({ children, ...props }: PageProps) => (
    <StyledLayout>
        <TopBar/>
        <PageLeadBar {...props} />
        <StyledContent style={{  }}>
            <StyledMain>{children}</StyledMain>
        </StyledContent>
        <Footer />
    </StyledLayout>
)

export default Page

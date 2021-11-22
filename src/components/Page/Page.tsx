import React from 'react'
import styled from 'styled-components'
import { Layout } from 'antd'
import Header from '../Header'
import Footer from '../Footer'
import PageLeadBar from './PageLeadBar'

const { Content } = Layout

interface PageProps {
	loading?: boolean
	mainTitle?: string
	secondaryText?: string
	secondaryTextLink?: string
	value?: string
	valueInfo?: string
	children: React.ReactElement
	background?: string
	backNavigate?: string
}

const Page: React.FC<PageProps> = ({ children, ...props }) => (
	<StyledLayout>
		<Header />
		<PageLeadBar {...props} />
		<StyledContent>
			<StyledMain>{children}</StyledMain>
		</StyledContent>
		<Footer />
	</StyledLayout>
)

export default Page

const StyledLayout = styled(Layout)`
	min-height: 100vh;
	background: ${(props) => props.theme.primary.background};
`

const StyledContent = styled(Content)`
	padding: 40px 100px 0 100px;
	@media only screen and (max-width: 725px) {
		padding: 0;
	}
`

const StyledMain = styled.div`
	max-width: ${(props) => props.theme.siteWidth}px;
	margin: auto;
`

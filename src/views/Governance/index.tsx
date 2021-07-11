import React, { useContext } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import {
	Row,
	// , Col
} from 'antd'
import { LanguageContext } from '../../contexts/Language'
import phrases from './translations'
import Tabs from '../../components/Tabs'
import Card from '../../components/Card'
// import GovernanceCard from './components/GovernanceCard'
// import GovernanceOverviewCard from './components/GovernanceOverviewCard'
import './index.less'

const { TabPane } = Tabs

const Savings: React.FC = () => {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	return (
		<div className="governance-view">
			<Page
				loading={false}
				mainTitle={phrases['Governance'][language]}
				secondaryText={phrases['Community Voting'][language]}
				// TODO: hook this up to veYAXIS
				value="-"
				valueInfo={phrases['Voting Power'][language]}
			>
				{/* <Col span={16}>
						<GovernanceCard />
					</Col>
					<Col span={8}>
						<GovernanceOverviewCard />
					</Col> */}
				<Row justify="center" style={{ marginTop: '5%' }}>
					<Card style={{ width: '50%' }}>
						<Tabs defaultActiveKey="1" centered>
							<TabPane tab="Off-chain" key="1">
								<Row
									style={{ paddingTop: '5%' }}
									justify="center"
								>
									<StyledLinkButton
										target="_blank"
										href="https://gov.yaxis.io/#/"
										rel="noopener noreferrer"
									>
										<span
											style={{
												position: 'relative',
												fontSize: '20px',
												top: '3px',
											}}
										>
											⚡️
										</span>
										<span style={{ color: 'black' }}>
											Snapshot
										</span>
									</StyledLinkButton>
								</Row>
							</TabPane>
							<TabPane tab="On-chain" key="2" disabled></TabPane>
						</Tabs>
					</Card>
				</Row>
			</Page>
		</div>
	)
}

export default Savings

const StyledLinkButton = styled.a`
	padding: 10px ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	font-size: 16px;
	width: 200px;
	border: 1px solid grey;
	border-radius: 18px;
	text-align: center;
	background: ${(props) => props.theme.colors.aliceBlue};

	&:hover {
		border: 1px solid ${(props) => props.theme.primary.hover};
	}
`

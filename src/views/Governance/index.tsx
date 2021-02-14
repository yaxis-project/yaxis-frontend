import React, { useContext } from 'react'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import { LanguageContext } from '../../contexts/Language'
import phrases from './translations'
import GovernanceCard from './components/GovernanceCard'
import GovernanceOverviewCard from './components/GovernanceOverviewCard'
import './index.less'

const Savings: React.FC = () => {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	return (
		<div className="governance-view">
			<Page
				loading={false}
				mainTitle={phrases['Governance'][language]}
				secondaryText={phrases['Community Voting'][language]}
				value="8,293 YAX"
				valueInfo={phrases['Voting Power'][language]}
			>
				<Row gutter={16}>
					<Col span={16}>
						<GovernanceCard />
					</Col>
					<Col span={8}>
						<GovernanceOverviewCard />
					</Col>
				</Row>
			</Page>
		</div>
	)
}

export default Savings

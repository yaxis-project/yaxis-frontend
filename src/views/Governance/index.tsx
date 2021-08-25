import React, { useContext } from 'react'
import Page from '../../components/Page/Page'
import { Row } from 'antd'
import { LanguageContext } from '../../contexts/Language'
import phrases from './translations'
import Tabs from '../../components/Tabs'
import Card from '../../components/Card'
import { Lock, Offchain, Onchain } from './components'
import { useLocation, useHistory, Redirect } from 'react-router-dom'
import { useVotingPower } from '../../state/wallet/hooks'

const { TabPane } = Tabs

const DEFAULT_TAB = '#lock'

const TABS = {
	'#lock': '#lock',
	'#offchain': '#offchain',
	'#onchain': '#onchain',
}

const Governance: React.FC = () => {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const history = useHistory()
	const location = useLocation()

	const votingPower = useVotingPower()

	if (location.hash && !TABS[location.hash]) return <Redirect to="/vault" />

	return (
		<Page
			loading={false}
			mainTitle={phrases['Governance'][language]}
			secondaryText={phrases['Community Voting'][language]}
			value={votingPower.toString()}
			valueInfo={phrases['Voting Power'][language]}
		>
			<Row justify="center" style={{ marginTop: '5%' }}>
				<Card style={{ width: '60%' }}>
					<Tabs
						activeKey={location.hash || DEFAULT_TAB}
						onTabClick={(key) =>
							history.push(`${location.pathname}${key}`)
						}
						centered
					>
						<TabPane tab="Boost" key="#lock">
							<Lock />
						</TabPane>
						<TabPane tab="Reward Distribution" key="#onchain">
							<Onchain />
						</TabPane>
						<TabPane tab="Snapshot" key="#offchain">
							<Offchain />
						</TabPane>
					</Tabs>
				</Card>
			</Row>
		</Page>
	)
}

export default Governance

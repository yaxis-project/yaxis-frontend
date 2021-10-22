import React from 'react'
import Page from '../../components/Page/Page'
import { Row } from 'antd'
import useTranslation from '../../hooks/useTranslation'
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
	const translate = useTranslation()

	const history = useHistory()
	const location = useLocation()

	const votingPower = useVotingPower()

	if (location.hash && !TABS[location.hash]) return <Redirect to="/vault" />

	return (
		<Page
			loading={false}
			mainTitle={translate('Governance')}
			secondaryText={translate('Community Voting')}
			value={votingPower.toString()}
			valueInfo={translate('Voting Power')}
		>
			<Row justify="center" style={{ marginTop: '5%' }}>
				<Card style={{ width: '60%' }}>
					<Tabs
						activeKey={location.hash || DEFAULT_TAB}
						onTabClick={(key) =>
							history.push(`${location.pathname}${key}`)
						}
						centered
						destroyInactiveTabPane
					>
						<TabPane tab={translate('Boost')} key="#lock">
							<Lock />
						</TabPane>
						<TabPane
							tab={translate('Reward Distribution')}
							key="#onchain"
						>
							<Onchain />
						</TabPane>
						<TabPane tab={translate('Snapshot')} key="#offchain">
							<Offchain />
						</TabPane>
					</Tabs>
				</Card>
			</Row>
		</Page>
	)
}

export default Governance

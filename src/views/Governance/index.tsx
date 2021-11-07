import React, { useMemo } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import useTranslation from '../../hooks/useTranslation'
import Tabs from '../../components/Tabs'
import Card from '../../components/Card'
import {
	Lock,
	Offchain,
	Onchain,
	CurrentDistribution,
	GaugesOverview,
	BoostCalculator,
	DAOResources,
	FutureRewards,
} from './components'
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

	const activeKey = useMemo(
		() => location.hash || DEFAULT_TAB,
		[location.hash],
	)

	if (location.hash && !TABS[location.hash]) return <Redirect to="/vault" />

	return (
		<Page
			loading={false}
			mainTitle={translate('Governance')}
			secondaryText={translate('Community Voting')}
			value={votingPower.toString()}
			valueInfo={translate('Voting Power')}
		>
			<Row gutter={16}>
				<Col xs={24} sm={24} md={24} lg={16}>
					<Card>
						<Tabs
							activeKey={activeKey}
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
							<TabPane
								tab={translate('Snapshot')}
								key="#offchain"
							>
								<Offchain />
							</TabPane>
						</Tabs>
					</Card>
				</Col>
				<StyledCol xs={24} sm={24} md={24} lg={8}>
					{activeKey === '#lock' && (
						<>
							<GaugesOverview />
							<BoostCalculator />
						</>
					)}
					{activeKey === '#onchain' && (
						<>
							<CurrentDistribution />
							<FutureRewards />
						</>
					)}
					{activeKey === '#offchain' && <DAOResources />}
				</StyledCol>
			</Row>
		</Page>
	)
}

export default Governance

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

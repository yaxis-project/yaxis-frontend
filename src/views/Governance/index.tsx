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
	GovernanceOverview,
	BoostCalculator,
	DAOResources,
	FutureRewards,
} from './components'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useVotingPower } from '../../state/wallet/hooks'
import FeeDistributor from './components/FeeDistributor'

const { TabPane } = Tabs

const DEFAULT_TAB = '#lock'

const TABS = {
	'#lock': '#lock',
	'#offchain': '#offchain',
	'#onchain': '#onchain',
}

const Governance: React.FC = () => {
	const translate = useTranslation()

	const navigate = useNavigate()
	const location = useLocation()

	const votingPower = useVotingPower()

	const activeKey = useMemo(
		() => location.hash || DEFAULT_TAB,
		[location.hash],
	)

	if (location.hash && !TABS[location.hash]) return <Navigate to="/vault" />

	return (
		<Page
			loading={false}
			mainTitle={translate('Governance')}
			secondaryText={translate('Community Voting')}
			value={
				(votingPower.totalSupply.isZero()
					? '0.00'
					: votingPower.balance
							.dividedBy(votingPower.totalSupply)
							.multipliedBy(100)
							.toFormat(2)) + '%'
			}
			valueInfo={translate('of total Voting Power')}
		>
			<Row gutter={16}>
				<Col xs={24} sm={24} md={24} lg={16}>
					<Card>
						<Tabs
							activeKey={activeKey}
							onTabClick={(key) =>
								navigate(`${location.pathname}${key}`)
							}
							centered
							destroyInactiveTabPane
						>
							<TabPane
								tab={translate('Lock & Boost')}
								key="#lock"
							>
								<Lock />
							</TabPane>
							<TabPane
								tab={translate('Distribute Rewards')}
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
							<FeeDistributor />
							<GovernanceOverview />
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

import './index.less'
import React from 'react'
import styled from 'styled-components'
import { HomePage } from '../../components/Page'
import YaxisPriceGraph from '../../components/YaxisPriceGraph'
import AccountOverviewCard from './components/AccountOverviewCard'
import HomeOverviewCard from './components/HomeOverviewCard'
import AdvancedNavigation from './components/AdvancedNavigation'
import HomeExpandableOverview from './components/HomeExpandableOverview'
import { Row, Col, Grid } from 'antd'
import useMetaVaultData from '../../hooks/useMetaVaultData'
import BigNumber from 'bignumber.js'
import useYaxisStaking from '../../hooks/useYAXISStaking'
import useGlobal from '../../hooks/useGlobal'
import { formatBN } from '../../yaxis/utils'

const { useBreakpoint } = Grid

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

const Home: React.FC = () => {
	const { lg } = useBreakpoint()
	return (
		<div className="home-view">
			<HomePage>
				<Row gutter={lg ? 16 : 0}>
					<Col md={24} lg={16} className={'home-left'}>
						<YaxisPriceGraph />
						<InvestmentAccountOverview />
						<SavingsAccountOverview />
						<AdvancedNavigation />
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<HomeOverviewCard />
						<HomeExpandableOverview />
					</StyledCol>
				</Row>
			</HomePage>
		</div>
	)
}

/**
 * Lead data for the user's account overview.
 */
const SavingsAccountOverview: React.FC = () => {
	const {
		balances: { stakedBalanceUSD },
	} = useYaxisStaking()
	const { lastUpdated } = useGlobal()

	return (
		<AccountOverviewCard
			loading={false}
			mainTitle={'Staking Account'}
			secondaryText={'YAXIS Staking'}
			value={'$' + formatBN(stakedBalanceUSD)}
			time={lastUpdated.fromNow()}
		/>
	)
}

/**
 * Lead data for the user's account overview.
 */
const InvestmentAccountOverview: React.FC = () => {
	const { lastUpdated } = useGlobal()
	const {
		metaVaultData: { totalBalance, mvltPrice },
	} = useMetaVaultData('v1')

	const totalInvestingBalance = new BigNumber(
		totalBalance || '0',
	).multipliedBy(mvltPrice || '0')

	return (
		<AccountOverviewCard
			loading={false}
			mainTitle={'MetaVault Account'}
			secondaryText={'Metavault 2.0'}
			value={'$' + formatBN(totalInvestingBalance)}
			time={lastUpdated.fromNow()}
		/>
	)
}

export default Home

import React from 'react'
import { HomePage } from '../../components/Page'
import YaxisPriceGraph from '../../components/YaxisPriceGraph'
import AccountOverviewCard from './components/AccountOverviewCard'
import HomeOverviewCard from './components/HomeOverviewCard'
import AdvancedNavigation from './components/AdvancedNavigation'
import HomeExpandableOverview from './components/HomeExpandableOverview'
import { Row, Col } from 'antd'
import useMetaVaultData from '../../hooks/useMetaVaultData'
import BigNumber from 'bignumber.js'
import useYaxisStaking from '../../hooks/useYaxisStaking'
import usePriceMap from '../../hooks/usePriceMap'
import { YAX } from '../../utils/currencies'
import useGlobal from '../../hooks/useGlobal'

const Home: React.FC = () => {
	return (
		<div className="home-view">
			<HomePage>
				<Row gutter={16}>
					<Col span={16} className={'home-left'}>
						<YaxisPriceGraph />
						<InvestmentAccountOverview />
						<SavingsAccountOverview />
						<AdvancedNavigation />
					</Col>
					<Col span={8}>
						<HomeOverviewCard />
						<HomeExpandableOverview />
					</Col>
				</Row>
			</HomePage>
		</div>
	)
}

/**
 * Lead data for the user's account overview.
 */
const SavingsAccountOverview: React.FC = () => {
	const { stakedBalanceUSD } = useYaxisStaking(YAX)
	const { YAX: YAXPrice } = usePriceMap()
	const { lastUpdated } = useGlobal()

	return (
		<AccountOverviewCard
			loading={false}
			mainTitle={'Staking Account'}
			secondaryText={'YAX Staking'}
			value={'$' + stakedBalanceUSD.toFixed(2)}
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
			mainTitle={'Vault Account'}
			secondaryText={'Metavault 2.0'}
			value={'$' + totalInvestingBalance.toFixed(2)}
			time={lastUpdated.fromNow()}
		/>
	)
}

export default Home

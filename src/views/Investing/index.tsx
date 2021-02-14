import React from 'react'
import Page from '../../components/Page/Page'
import YaxisPriceGraph from '../../components/YaxisPriceGraph'
import { Row, Col } from 'antd'
import InvestmentDetailOverview from './components/InvestmentDetailOverview'
import InvestmentAccountActionCard from './components/InvestmentAccountActionCard'
import VaultStatsCard from './components/VaultStatsCard'
import RecentTransactionsCard from './components/RecentTransactionsCard'
import useMetaVaultData from '../../hooks/useMetaVaultData'
import './index.less'
import BigNumber from 'bignumber.js'

const Investing: React.FC = () => {
	const {
		metaVaultData: { totalBalance, mvltPrice },
	} = useMetaVaultData('v1')

	const totalUSDBalance = new BigNumber(totalBalance || '0')
		.multipliedBy(mvltPrice || '0')
		.toFixed(2)

	return (
		<div className="investing-view">
			<Page
				loading={false}
				mainTitle="Vault Account"
				secondaryText="MetaVault 2.0"
				value={'$' + totalUSDBalance}
				valueInfo="Balance"
			>
				<Row gutter={16}>
					<Col span={16}>
						<YaxisPriceGraph />
						<InvestmentAccountActionCard />
					</Col>
					<Col span={8}>
						<InvestmentDetailOverview />
						<VaultStatsCard />
						<RecentTransactionsCard />
					</Col>
				</Row>
			</Page>
		</div>
	)
}

export default Investing

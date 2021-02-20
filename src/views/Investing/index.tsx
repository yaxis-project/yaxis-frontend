import React from 'react'
import styled from 'styled-components'
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

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

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
				mainTitle="MetaVault Account"
				secondaryText="MetaVault 2.0"
				value={'$' + totalUSDBalance}
				valueInfo="Balance"
			>
				<Row gutter={16}>
					<Col md={24} lg={16} >
						<YaxisPriceGraph />
						<InvestmentAccountActionCard />
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<InvestmentDetailOverview />
						<VaultStatsCard />
						<RecentTransactionsCard />
					</StyledCol>
				</Row>
			</Page>
		</div>
	)
}

export default Investing

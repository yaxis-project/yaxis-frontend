import React, { useMemo } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'
import YaxisPriceGraph from '../../components/Graph/YaxisPriceGraph'
import AccountOverviewCard from './components/AccountOverviewCard'
import HomeOverviewCard from './components/HomeOverviewCard'
import LPAccountOverview from './components/LPAccountOverview'
import HomeExpandableOverview from './components/HomeExpandableOverview'
import { Row, Col, Grid } from 'antd'
import { useStakedBalances, useVaultsBalances } from '../../state/wallet/hooks'
import { usePrices } from '../../state/prices/hooks'
import { formatBN } from '../../utils/number'
import useTranslation from '../../hooks/useTranslation'

const { useBreakpoint } = Grid

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

const Home: React.FC = () => {
	const { lg } = useBreakpoint()
	return (
		<div className={'home-view'}>
			<Page>
				<Row gutter={lg ? 16 : 0}>
					<Col md={24} lg={16} className={'home-left'}>
						<YaxisPriceGraph />
						<VaultAccountOverview />
						<LPAccountOverview />
						<GovernanceAccountOverview />
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<HomeOverviewCard />
						<HomeExpandableOverview />
					</StyledCol>
				</Row>
			</Page>
		</div>
	)
}

/**
 * Lead data for the user's account overview.
 */
const GovernanceAccountOverview: React.FC = () => {
	const translate = useTranslation()

	const { Yaxis } = useStakedBalances()

	const {
		prices: { yaxis },
	} = usePrices()

	const balanceUSD = useMemo(
		() => '$' + formatBN(Yaxis.amount.multipliedBy(yaxis)),
		[Yaxis, yaxis],
	)
	return (
		<AccountOverviewCard
			loading={false}
			mainTitle={translate('Governance Account')}
			secondaryText={translate('YAXIS Staking')}
			value={balanceUSD}
		/>
	)
}

/**
 * Lead data for the user's account overview.
 */
const VaultAccountOverview: React.FC = () => {
	const translate = useTranslation()

	const {
		total: { usd: balanceUSD },
	} = useVaultsBalances()

	return (
		<AccountOverviewCard
			loading={false}
			mainTitle={translate('Vault Account')}
			secondaryText={translate('Canonical Vaults')}
			value={'$' + formatBN(balanceUSD)}
		/>
	)
}

export default Home

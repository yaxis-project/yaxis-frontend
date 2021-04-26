import './index.less'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { HomePage } from '../../components/Page'
import YaxisPriceGraph from '../../components/YaxisPriceGraph'
import AccountOverviewCard from './components/AccountOverviewCard'
import HomeOverviewCard from './components/HomeOverviewCard'
import AdvancedNavigation from './components/AdvancedNavigation'
import HomeExpandableOverview from './components/HomeExpandableOverview'
import { Row, Col, Grid } from 'antd'
import {
	useStakedBalances,
	useAccountMetaVaultData,
} from '../../state/wallet/hooks'
import { useMetaVaultData } from '../../state/internal/hooks'
import { usePrices } from '../../state/prices/hooks'
import { formatBN } from '../../utils/number'

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
			mainTitle={'Staking Account'}
			secondaryText={'YAXIS Staking'}
			value={balanceUSD}
		/>
	)
}

/**
 * Lead data for the user's account overview.
 */
const InvestmentAccountOverview: React.FC = () => {
	const { MetaVault } = useStakedBalances()
	const { deposited } = useAccountMetaVaultData()
	const { mvltPrice } = useMetaVaultData()

	const balanceUSD = useMemo(() => {
		const totalMVLT = MetaVault.amount.plus(deposited)
		return '$' + formatBN(totalMVLT.multipliedBy(mvltPrice))
	}, [MetaVault, deposited, mvltPrice])

	return (
		<AccountOverviewCard
			loading={false}
			mainTitle={'MetaVault Account'}
			secondaryText={'Metavault 2.0'}
			value={balanceUSD}
		/>
	)
}

export default Home

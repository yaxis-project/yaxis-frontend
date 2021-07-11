import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import YaxisPriceGraph from '../../components/YaxisPriceGraph'
import { Row, Col } from 'antd'
import { LanguageContext } from '../../contexts/Language'
import phrases from './translations'
import StakingCard from './components/StakingCard'
import SavingsOverviewCard from './components/SavingsOverviewCard'
import VaultStatsCard from './components/VaultStatsCard'
import './index.less'
import { currentConfig } from '../../constants/configs'
import { etherscanUrl } from '../../utils'
import { formatBN } from '../../utils/number'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { NETWORK_NAMES } from '../../connectors'
import { useStakedBalances } from '../../state/wallet/hooks'
import { usePrices } from '../../state/prices/hooks'

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

const Rewards: React.FC = () => {
	const { Yaxis } = useStakedBalances()
	const {
		prices: { yaxis },
	} = usePrices()

	const balance = useMemo(
		() => Yaxis.amount.multipliedBy(yaxis),
		[Yaxis, yaxis],
	)

	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const { chainId } = useWeb3Provider()
	const networkName = useMemo(() => NETWORK_NAMES[chainId] || '', [chainId])
	const address = useMemo(
		() => currentConfig(chainId).rewards.Yaxis,
		[chainId],
	)

	return (
		<div className="savings-view">
			<Page
				loading={false}
				mainTitle={phrases['Staking Account'][language]}
				secondaryText={phrases['YAXIS Staking'][language]}
				secondaryTextLink={
					address &&
					etherscanUrl(`/address/${address}#code`, networkName)
				}
				value={'$' + formatBN(balance)}
				valueInfo={phrases['Balance'][language]}
			>
				<Row gutter={16}>
					<Col md={24} lg={16}>
						<YaxisPriceGraph />
						<StakingCard />
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<Row>
							<SavingsOverviewCard
								totalUSDBalance={balance}
								balanceLoading={false}
							/>
						</Row>
						<Row style={{ marginTop: 15 }}>
							<VaultStatsCard />
						</Row>
					</StyledCol>
				</Row>
			</Page>
		</div>
	)
}

export default Rewards

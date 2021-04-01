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
import useYaxisStaking from '../../hooks/useYAXISStaking'
import { currentConfig } from '../../yaxis/configs'
import { etherscanUrl } from '../../yaxis/utils'
import { useWeb3React } from '@web3-react/core'
import { NETWORK_NAMES } from '../../connectors'

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

const Staking: React.FC = () => {
	const {
		balances: { stakedBalanceUSD },
	} = useYaxisStaking()

	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const { chainId } = useWeb3React()
	const networkName = useMemo(() => NETWORK_NAMES[chainId] || '', [chainId])
	const address = currentConfig(chainId).contractAddresses['xYaxStaking']

	return (
		<div className="savings-view">
			<Page
				loading={false}
				mainTitle={phrases['Staking Account'][language]}
				secondaryText={phrases['YAX Staking'][language]}
				secondaryTextLink={
					address &&
					etherscanUrl(`/address/${address}#code`, networkName)
				}
				value={
					'$' +
					Number(stakedBalanceUSD).toLocaleString(
						undefined, // leave undefined to use the browser's locale,
						// or use a string like 'en-US' to override it.
						{ minimumFractionDigits: 2 },
					)
				}
				valueInfo={phrases['Balance'][language]}
			>
				<Row gutter={16}>
					<Col md={24} lg={16}>
						<YaxisPriceGraph />
						<StakingCard />
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<Row>
							<SavingsOverviewCard />
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

export default Staking

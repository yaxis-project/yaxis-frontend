import React, { useMemo } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import InvestmentDetailOverview from './components/InvestmentDetailOverview'
import VaultActionsCard from './components/VaultActionsCard'
import VaultStatsCard from './components/VaultStatsCard'
// import RecentTransactionsCard from './components/RecentTransactionsCard'
import './index.less'
import { currentConfig } from '../../constants/configs'
import { LPVaults } from '../../constants/type/ethereum'
import { Currencies } from '../../constants/currencies'
import { etherscanUrl } from '../../utils'
import { formatBN } from '../../utils/number'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { NETWORK_NAMES } from '../../connectors'
import { useVaultsBalances } from '../../state/wallet/hooks'
import { useYaxisManager } from '../../state/internal/hooks'
import useTranslation from '../../hooks/useTranslation'

const Vault: React.FC = () => {
	const translate = useTranslation()

	const { chainId } = useWeb3Provider()

	const {
		total: { usd: total },
	} = useVaultsBalances()

	const networkName = useMemo(() => NETWORK_NAMES[chainId] || '', [chainId])
	const address = currentConfig(chainId).internal.controller

	const fees = useYaxisManager()

	return (
		<div className="investing-view">
			<Page
				loading={false}
				mainTitle={translate('Vault Account')}
				secondaryText={translate('Canonical Vaults')}
				secondaryTextLink={
					address &&
					etherscanUrl(`/address/${address}#code`, networkName)
				}
				value={'$' + formatBN(total)}
				valueInfo={translate('Balance')}
			>
				<Row gutter={16}>
					<Col xs={24} sm={24} md={24} lg={16}>
						<VaultActionsCard
							type="overview"
							fees={fees}
							currencies={LPVaults.map(
								([lpToken]) =>
									Currencies[lpToken.toUpperCase()],
							)}
						/>
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<InvestmentDetailOverview
							totalUSDBalance={total.toString()}
							balanceLoading={false}
						/>
						<VaultStatsCard />
						{/* TODO: Rework and re-enable */}
						{/* <RecentTransactionsCard /> */}
					</StyledCol>
				</Row>
			</Page>
		</div>
	)
}

export default Vault

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

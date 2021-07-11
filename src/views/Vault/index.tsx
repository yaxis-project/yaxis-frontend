import React, { useMemo } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import InvestmentDetailOverview from './components/InvestmentDetailOverview'
import InvestmentAccountActionCard from './components/InvestmentAccountActionCard'
import VaultStatsCard from './components/VaultStatsCard'
import Stake from './components/Stake'
import RecentTransactionsCard from './components/RecentTransactionsCard'
import './index.less'
import { currentConfig } from '../../constants/configs'
import { etherscanUrl } from '../../utils'
import { formatBN } from '../../utils/number'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { NETWORK_NAMES } from '../../connectors'
import {
	useStakedBalances,
	useAccountMetaVaultData,
} from '../../state/wallet/hooks'
import { useMetaVaultData } from '../../state/internal/hooks'

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

const MetaVault: React.FC = () => {
	const { chainId } = useWeb3Provider()

	const { MetaVault } = useStakedBalances()
	const { deposited } = useAccountMetaVaultData()
	const { mvltPrice } = useMetaVaultData()

	const balanceUSD = useMemo(() => {
		const totalMVLT = MetaVault.amount.plus(deposited)
		return totalMVLT.multipliedBy(mvltPrice)
	}, [MetaVault, deposited, mvltPrice])

	const networkName = useMemo(() => NETWORK_NAMES[chainId] || '', [chainId])
	const address = currentConfig(chainId).internal.yAxisMetaVault

	return (
		<div className="investing-view">
			<Page
				loading={false}
				mainTitle="Vault Account"
				secondaryText="Canonical Vaults"
				// TODO: update URL
				secondaryTextLink={
					address &&
					etherscanUrl(`/address/${address}#code`, networkName)
				}
				value={'$' + formatBN(balanceUSD)}
				valueInfo="Balance"
			>
				<Row gutter={16}>
					<Col xs={24} sm={24} md={24} lg={16}>
						<InvestmentAccountActionCard />
						<Stake />
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<InvestmentDetailOverview
							totalUSDBalance={balanceUSD.toString()}
							balanceLoading={false}
						/>
						<VaultStatsCard />
						<RecentTransactionsCard />
					</StyledCol>
				</Row>
			</Page>
		</div>
	)
}

export default MetaVault

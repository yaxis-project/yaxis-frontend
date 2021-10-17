import React, { useMemo } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import { currentConfig } from '../../constants/configs'
import { etherscanUrl } from '../../utils'
import { formatBN } from '../../utils/number'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { NETWORK_NAMES } from '../../connectors'
import AccountOverview from './components/AccountOverview'
import VaultStatsCard from './components/VaultStatsCard'
import UsersVaultDetails from './components/UsersVaultDetails'
import { useVaultsBalances } from '../../state/wallet/hooks'
import { TVaults } from '../../constants/type'

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

interface Props {
	vault: TVaults
}

const VaultDetails: React.FC<Props> = ({ vault }) => {
	const { chainId } = useWeb3Provider()

	const balances = useVaultsBalances()

	const networkName = useMemo(() => NETWORK_NAMES[chainId] || '', [chainId])
	const address = currentConfig(chainId).vaults[vault].vault

	return (
		<Page
			loading={false}
			mainTitle={`${vault[0].toUpperCase()}${vault.slice(1)} Vault`}
			secondaryText={
				vault[0].toUpperCase() + vault.slice(1) + ' Vault Contract'
			}
			// TODO: update URL
			secondaryTextLink={
				address && etherscanUrl(`/address/${address}#code`, networkName)
			}
			value={'$' + formatBN(balances[vault].usd)}
			valueInfo="Balance"
		>
			<Row gutter={16} style={{ padding: '35px 0' }}>
				<Col xs={24} sm={24} md={24} lg={16}>
					<UsersVaultDetails />
				</Col>
				<StyledCol xs={24} sm={24} md={24} lg={8}>
					<AccountOverview
						totalUSDBalance={balances[vault].usd.toString()}
						balanceLoading={false}
						vault={vault}
					/>
					<VaultStatsCard />
				</StyledCol>
			</Row>
		</Page>
	)
}

export default VaultDetails

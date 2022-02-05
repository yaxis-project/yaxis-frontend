import React, { useMemo } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import Card from '../../components/Card'
import Typography from '../../components/Typography'
import { NavLink } from 'react-router-dom'
import { Row, Col } from 'antd'
import { currentConfig } from '../../constants/configs'
import { etherscanUrl } from '../../utils'
import { formatBN } from '../../utils/number'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { NETWORK_NAMES } from '../../connectors'
import AccountOverview from './components/AccountOverview'
import VaultStatsCard from './components/VaultStatsCard'
// import UsersVaultDetails from './components/UsersVaultDetails'
import CurvePool from './components/CurvePool'
// import { Converter } from './components/Converter'
import { useVaultsBalances } from '../../state/wallet/hooks'
import { useYaxisManager } from '../../state/internal/hooks'
import { TVaults } from '../../constants/type'
import { LPVaults } from '../../constants/type'

import { Currencies } from '../../constants/currencies'
import VaultActionsCard from '../Vault/components/VaultActionsCard'

const { Text } = Typography

interface Props {
	vault: TVaults
}

const VaultDetails: React.FC<Props> = ({ vault }) => {
	const { chainId } = useWeb3Provider()

	const { loading, ...balances } = useVaultsBalances()

	const networkName = useMemo(() => NETWORK_NAMES[chainId] || '', [chainId])
	const address = currentConfig(chainId).vaults[vault].vault

	const fees = useYaxisManager()

	return (
		<Page
			loading={loading}
			mainTitle={`${vault.toUpperCase()} Vault`}
			secondaryText={'Vault Contract'}
			secondaryTextLink={
				address && etherscanUrl(`/address/${address}#code`, networkName)
			}
			value={'$' + formatBN(balances.balances[vault].usd)}
			valueInfo="Balance"
			backNavigate="/vault"
		>
			<>
				{vault === 'yaxis' && (<Row gutter={16}>
					<Col span={24}>
						<Card style={{ marginBottom: "10px", background: 'rgb(253,94,97)' }}>
							<Row justify="center">
								<Text style={{ fontSize: "20px" }}>
									<a href="https://yaxis.discourse.group/t/fine-tune-yaxis-tokenomics/302/30">YIP-14 </a>
									passed with 97% approval, deprecating the YAXIS vault.
								</Text>
							</Row>
							<Row justify="center">

								<Text style={{ fontSize: "20px" }}>
									<NavLink to={"/governance"}>
										Lock YAXIS into Governance
									</NavLink>
									{" "} to recieve further emissions.
								</Text>
							</Row>
						</Card>
					</Col>
				</Row>)}
				<Row gutter={16}>
					<Col xs={24} sm={24} md={24} lg={16}>
						<CurvePool vault={vault} />
						<VaultActionsCard
							type="details"
							fees={fees}
							currencies={[
								Currencies[
								LPVaults.find(
									([, name]) => name === vault,
								)[0].toUpperCase()
								],
							]}
						/>
						{/* <UsersVaultDetails vault={vault} /> */}
						{/* <Converter vault={vault} /> */}
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<AccountOverview
							totalUSDBalance={balances.balances[
								vault
							].usd.toString()}
							balanceLoading={false}
							vault={vault}
						/>
						<VaultStatsCard vault={vault} />
					</StyledCol>
				</Row>
			</>
		</Page>
	)
}

export default VaultDetails

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`
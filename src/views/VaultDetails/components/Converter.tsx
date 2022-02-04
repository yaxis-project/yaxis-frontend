import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import Typography from '../../../components/Typography'
import * as Helpers from './helpers'
import { TVaults } from '../../../constants/type'
import { useMemo } from 'react'
import { currentConfig } from '../../../constants/configs'
import useWeb3Provider from '../../../hooks/useWeb3Provider'

type Props = {
	vault: TVaults
}

const { Title, Text } = Typography

const Converter: React.FC<Props> = ({ vault }) => {
	const { chainId } = useWeb3Provider()

	const vaultData = useMemo(
		() => currentConfig(chainId).vaults[vault],
		[chainId, vault],
	)

	return (
		<DetailOverviewCard
			title={
				<>
					<Title style={{ fontSize: 22 }}>
						Curve pool ({vaultData.token.toUpperCase()})
					</Title>
					<Text style={{ fontSize: 14 }}>
						This Vault accepts {vaultData.token.toUpperCase()}{' '}
						deposits...
					</Text>
				</>
			}
		>
			<Helpers.Stable3PoolTabs vault={vault} />
		</DetailOverviewCard>
	)
}

export { Converter }

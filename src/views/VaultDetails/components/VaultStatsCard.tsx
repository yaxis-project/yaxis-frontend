import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'
import { useTVL, useVaultStrategies } from '../../../state/internal/hooks'
import Value from '../../../components/Value'
import useTranslation from '../../../hooks/useTranslation'
import { TVaults } from '../../../constants/type'

interface UserVaultDetailsProps {
	vault: TVaults
}

const VaultStatsCard: React.FC<UserVaultDetailsProps> = ({ vault }) => {
	const t = useTranslation()

	const { vaultTvl } = useTVL()
	const strategies = useVaultStrategies()

	return (
		<>
			<ExpandableSidePanel header={t('Vault Stats')} key="1">
				<CardRow
					main="Current Strategy"
					secondary={strategies[vault] || t('None')}
				/>
				<CardRow
					main={t('Total Value Locked')}
					secondary={
						<Value
							value={vaultTvl[vault]?.toNumber()}
							numberPrefix="$"
							decimals={2}
						/>
					}
					last
				/>
				{/* <CardRow
					main="Rewards Per Block"
					secondary={
						<Value
							value={rewardsPerBlock.toNumber()}
							numberSuffix=" YAXIS"
							decimals={3}
						/>
					}
				/> */}
			</ExpandableSidePanel>
		</>
	)
}

export default VaultStatsCard

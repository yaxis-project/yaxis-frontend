import { useMemo } from 'react'
import Card from '../../../components/Card'
import { useTVL, useVaultStrategies } from '../../../state/internal/hooks'
import Value from '../../../components/Value'
import CardRow from '../../../components/CardRow'
import useTranslation from '../../../hooks/useTranslation'
import { TVaults } from '../../../constants/type'

interface UserVaultDetailsProps {
	vault: TVaults
}

const VaultStatsCard: React.FC<UserVaultDetailsProps> = ({ vault }) => {
	const t = useTranslation()

	const { vaultTvl } = useTVL()
	const strategies = useVaultStrategies()

	const strategy = useMemo(() => {
		const names = strategies[vault]
		if (!names || !names.length) return t('None')
		return names.map((strategy, i) => (
			<div key={`${strategy}-${i}`}>{strategy}</div>
		))
	}, [strategies, t, vault])

	return (
		<Card title={t('Vault Stats')} icon="vault">
			<CardRow main={t('Current Strategies')} secondary={strategy} />
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
		</Card>
	)
}

export default VaultStatsCard

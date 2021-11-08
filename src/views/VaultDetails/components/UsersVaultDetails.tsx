import { CardRow } from '../../../components/ExpandableSidePanel'
import { useTVL } from '../../../state/internal/hooks'
import Value from '../../../components/Value'
import { useAPY } from '../../../state/internal/hooks'
import useTranslation from '../../../hooks/useTranslation'
// import { useMetaVaultData / from '../../../state/internal/hooks'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { Row, Col } from 'antd'

/**
 * Generates investing vault stats card for the current signed in user.
 */
export default function VaultStatsCard() {
	const t = useTranslation()

	// const { metavaultTvl } = useTVL()
	const { rewardsPerBlock } = useAPY('MetaVault')

	// const { strategy } = useMetaVaultData()
	return (
		<DetailOverviewCard title={t('Vault Overview')}>
			<Row justify="space-around">
				<Col>
					<CardRow
						main={t('APR')}
						secondary={
							<Value
								value={
									0
									// metavaultTvl.toNumber()
								}
								numberSuffix="%"
								decimals={2}
							/>
						}
						last
					/>
				</Col>
				<Col>
					<CardRow
						main={t('APY')}
						secondary={
							<Value
								value={
									0
									// metavaultTvl.toNumber()
								}
								numberSuffix="%"
								decimals={2}
							/>
						}
						last
					/>
				</Col>
			</Row>
		</DetailOverviewCard>
	)
}

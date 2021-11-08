import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'
import { useTVL } from '../../../state/internal/hooks'
import Value from '../../../components/Value'
import useTranslation from '../../../hooks/useTranslation'

export default function VaultStatsCard() {
	const translate = useTranslation()

	const { vaultsTvl } = useTVL()

	return (
		<>
			<ExpandableSidePanel
				header={translate('Global Vault Stats')}
				key="1"
			>
				<CardRow
					main={translate('Total Value Locked')}
					secondary={
						<Value
							value={vaultsTvl.toNumber()}
							numberPrefix="$"
							decimals={2}
						/>
					}
					last
				/>
			</ExpandableSidePanel>
		</>
	)
}

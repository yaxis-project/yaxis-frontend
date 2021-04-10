import React from 'react'

import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'
import useTVL from '../../../hooks/useComputeTVL'
import Value from '../../../components/Value'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import useMetaVault from '../../../hooks/useMetaVault'

/**
 * Generates investing vault stats card for the current signed in user.
 */
export default function VaultStatsCard() {
	const { metavaultTvl } = useTVL()
	const { metaVaultData } = useMetaVaultData('v1')
	const { strategy } = useMetaVault()
	return (
		<>
			<ExpandableSidePanel header="Vault Stats" key="1">
				<CardRow main="Current Strategy" secondary={strategy} />
				<CardRow
					main="Total Value Locked"
					secondary={
						<Value
							value={metavaultTvl.toNumber()}
							numberPrefix="$"
							decimals={2}
						/>
					}
				/>
				<CardRow
					main="Rewards Per Block"
					secondary={
						<Value
							value={metaVaultData?.rewardPerBlock}
							numberSuffix=" YAXIS"
							decimals={3}
						/>
					}
				/>
			</ExpandableSidePanel>
		</>
	)
}

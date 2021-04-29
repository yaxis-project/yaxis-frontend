import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'
import useTVL from '../../../hooks/useComputeTVL'
import Value from '../../../components/Value'
import useAPY from '../../../hooks/useAPY'
import useMetaVault from '../../../hooks/useMetaVault'

/**
 * Generates investing vault stats card for the current signed in user.
 */
export default function VaultStatsCard() {
	const { metavaultTvl } = useTVL()
	const {
		data: { rewardsPerBlock },
	} = useAPY('MetaVault')

	const { strategy } = useMetaVault()
	return (
		<>
			<ExpandableSidePanel header="Vault Stats" key="1">
				<CardRow
					main="Current Strategy"
					secondary={
						strategy ? (
							<>
								<div>{strategy}</div>
								<div>YearnV2: DAI</div>
							</>
						) : (
							<div></div>
						)
					}
				/>
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
							value={rewardsPerBlock.toNumber()}
							numberSuffix=" YAXIS"
							decimals={3}
						/>
					}
				/>
			</ExpandableSidePanel>
		</>
	)
}

import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'
import { useTVL } from '../../../state/internal/hooks'
import Value from '../../../components/Value'
import { useAPY } from '../../../state/internal/hooks'
// import { useMetaVaultData / from '../../../state/internal/hooks'
import useTranslation from '../../../hooks/useTranslation'

/**
 * Generates investing vault stats card for the current signed in user.
 */
export default function VaultStatsCard() {
	const translate = useTranslation()

	const { metavaultTvl } = useTVL()
	const { rewardsPerBlock } = useAPY('MetaVault')

	// const { strategy } = useMetaVaultData()
	return (
		<>
			<ExpandableSidePanel
				header={translate('Global Vault Stats')}
				key="1"
			>
				{/* <CardRow
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
				/> */}
				<CardRow
					main={translate('Total Value Locked')}
					secondary={
						<Value
							value={
								0
								// metavaultTvl.toNumber()
								// TODO
							}
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

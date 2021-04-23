import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'
import useTVL from '../../../hooks/useComputeTVL'
import Value from '../../../components/Value'
import useContractRead from '../../../hooks/useContractRead'
import useMetaVault from '../../../hooks/useMetaVault'
import BigNumber from 'bignumber.js'

/**
 * Generates investing vault stats card for the current signed in user.
 */
export default function VaultStatsCard() {
	const { metavaultTvl } = useTVL()
	const {
		data: yaxisRewardPerBlock,
		loading: loadingYaxisRewardPerBlock,
	} = useContractRead({
		contractName: `rewards.MetaVault`,
		method: 'rewardPerToken',
	})

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
							value={
								loadingYaxisRewardPerBlock
									? 0
									: new BigNumber(yaxisRewardPerBlock)
											.dividedBy(10 ** 18)
											.toNumber()
							}
							numberSuffix=" YAXIS"
							decimals={3}
						/>
					}
				/>
			</ExpandableSidePanel>
		</>
	)
}

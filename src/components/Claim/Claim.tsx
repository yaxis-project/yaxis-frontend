import { useMemo } from 'react'
import { Row, Col } from 'antd'
import { CardRow } from '../../components/ExpandableSidePanel'
import Value from '../../components/Value'
import Button from '../../components/Button'
import useContractWrite from '../../hooks/useContractWrite'
import { useSingleCallResultByName } from '../../state/onchain/hooks'
import { getBalanceNumber } from '../../utils/formatBalance'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import BigNumber from 'bignumber.js'
import { currentConfig } from '../../constants/configs'
import { TVaults, TRewardsContracts } from '../../constants/type'
import useTranslation from '../../hooks/useTranslation'

type Props = { vault?: TVaults; rewardsContract?: TRewardsContracts }

const Claim: React.FC<Props> = ({ vault, rewardsContract }) => {
	const translate = useTranslation()

	const { account, chainId } = useWeb3Provider()

	const vaults = useMemo(() => currentConfig(chainId).vaults, [chainId])

	if (!vault && !rewardsContract)
		throw new Error(
			translate('Claim button must have either a vault or rewards type.'),
		)

	const { call: handleClaim, loading: loadingClaim } = useContractWrite({
		contractName: vault ? `vaults.${vault}` : `rewards.${rewardsContract}`,
		method: vault ? 'claim_rewards' : 'getReward',
		description: translate(`claim YAXIS`),
	})

	const { loading: loadingClaimable, result: claimable } =
		useSingleCallResultByName(
			vault ? `vaults.${vault}` : `rewards.${rewardsContract}`,
			vault ? 'claimable_reward' : 'earned',
			vault ? [account, vaults.stables.vault] : [account],
		)

	return (
		<CardRow
			main={translate('Rewards')}
			secondary={
				<Value
					value={getBalanceNumber(
						new BigNumber(claimable?.toString() || 0),
					)}
					numberSuffix=" YAXIS"
					decimals={2}
				/>
			}
			rightContent={
				<Row justify="center">
					<Col xs={14} sm={14} md={14}>
						<Button
							disabled={
								loadingClaimable ||
								new BigNumber(
									claimable?.toString() || 0,
								).isZero()
							}
							onClick={() => handleClaim()}
							loading={loadingClaim}
							height={'40px'}
						>
							{translate('Claim')}
						</Button>
					</Col>
				</Row>
			}
		/>
	)
}

export default Claim

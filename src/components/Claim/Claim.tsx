import { Row, Col } from 'antd'
import CardRow from '../../components/CardRow'
import Value from '../../components/Value'
import Button from '../../components/Button'
import useContractWrite from '../../hooks/useContractWrite'
import { useSingleCallResultByName } from '../../state/onchain/hooks'
import { getBalanceNumber } from '../../utils/formatBalance'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import BigNumber from 'bignumber.js'
import { TVaults, TRewardsContracts } from '../../constants/type'
import useTranslation from '../../hooks/useTranslation'
import { useContracts } from '../../contexts/Contracts'
import { useChainInfo } from '../../state/user'

type Props = {
	vault?: TVaults
	rewardsContract?: TRewardsContracts
	last?: boolean
}

const Claim: React.FC<Props> = ({ vault, rewardsContract, last }) => {
	const translate = useTranslation()

	const { account } = useWeb3Provider()
	const { blockchain } = useChainInfo()

	if (!vault && !rewardsContract)
		throw new Error(
			translate('Claim button must have either a vault or rewards type.'),
		)

	const { contracts } = useContracts()

	const { call: handleRewardsClaim, loading: loadingRewardsClaim } =
		useContractWrite({
			contractName: rewardsContract ? `rewards.${rewardsContract}` : '',
			method: blockchain === 'ethereum' ? 'getReward' : 'claim',
			description: translate(`claim YAXIS`),
		})

	const { call: handleGaugeClaim, loading: loadingGaugeClaim } =
		useContractWrite({
			contractName: `internal.minter`,
			method: 'mint(address)',
			description: translate(`claim YAXIS`),
		})

	const { loading: loadingClaimable, result: claimable } =
		useSingleCallResultByName(
			vault ? `vaults.${vault}.gauge` : `rewards.${rewardsContract}`,
			vault
				? 'claimable_tokens'
				: blockchain === 'ethereum'
				? 'earned'
				: 'pending(address)',
			[account],
		)

	return (
		<CardRow
			main={'Pending Rewards'}
			secondary={
				<Value
					value={getBalanceNumber(
						new BigNumber(claimable?.[0]?.toString() || 0),
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
							onClick={() => {
								if (rewardsContract) handleRewardsClaim()
								if (vault)
									handleGaugeClaim({
										args: [
											contracts?.vaults[vault].gauge
												.address,
										],
									})
							}}
							loading={loadingRewardsClaim || loadingGaugeClaim}
							height={'40px'}
						>
							{translate('Claim')}
						</Button>
					</Col>
				</Row>
			}
			last={last}
		/>
	)
}

export default Claim

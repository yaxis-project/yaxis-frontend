import { useMemo } from 'react'
import { Row, Col } from 'antd'
import CardRow from '../CardRow'
import Value from '../Value'
import Button from '../Button'
import { useContracts } from '../../contexts/Contracts'
import useContractWrite from '../../hooks/useContractWrite'
import { useSingleCallResultByName } from '../../state/onchain/hooks'
import { getBalanceNumber } from '../../utils/formatBalance'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import BigNumber from 'bignumber.js'
import useTranslation from '../../hooks/useTranslation'

const ClaimFees: React.FC = () => {
	const translate = useTranslation()

	const { account } = useWeb3Provider()

	const { loading: loadingContracts } = useContracts()

	const { call: handleClaimFees, loading: loadingClaimFees } =
		useContractWrite({
			contractName: `rewards.FeeDistributor`,
			method: 'claimRewards',
			description: `claim YAXIS rewards`,
		})

	const { loading: loadingRewardAmount, result: rewardAmount } =
		useSingleCallResultByName(`rewards.FeeDistributor`, 'getRewardAmount', ["0x0ada190c81b814548ddc2f6adc4a689ce7c1fe73", account])


	const rewardsClaimable = useMemo(
		() =>
			new BigNumber(rewardAmount?.[0]?.toString()),
		[rewardAmount],
	)

	return (
		<CardRow
			main={'Pending Rewards'}
			secondary={
				<Value
					value={getBalanceNumber(rewardsClaimable, 0)}
					numberSuffix=" YAXIS"
					decimals={2}
				/>
			}
			rightContent={
				<Row justify="center">
					<Col xs={14} sm={14} md={14}>
						<Button
							disabled={
								loadingContracts ||
								loadingRewardAmount ||
								new BigNumber(rewardsClaimable?.toString() || 0)
									.isZero()
							}
							onClick={() => {
								if (rewardsClaimable.gt(0)) {
									handleClaimFees({
										args: ["0x0ada190c81b814548ddc2f6adc4a689ce7c1fe73"],
									})
								}
							}}
							loading={
								loadingClaimFees 
							}
							height={'40px'}
						>
							{translate('Claim All')}
						</Button>
					</Col>
				</Row>
			}
		/>
	)
}

export default ClaimFees

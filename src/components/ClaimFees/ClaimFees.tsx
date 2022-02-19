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

	const { contracts, loading: loadingContracts } = useContracts()

	const yaxis = useMemo(
		() => contracts?.currencies?.ERC677.yaxis.contract.address,
		[contracts],
	)

	const { call: handleClaimFees, loading: loadingClaimFees } =
		useContractWrite({
			contractName: `internal.feeDistributor`,
			method: 'claimRewards',
			description: `claim YAXIS rewards`,
		})

	const { loading: loadingRewardAmount, result: rewardAmount } =
		useSingleCallResultByName(
			`internal.feeDistributor`,
			'getRewardAmount',
			[yaxis, account],
		)

	const rewardsClaimable = useMemo(
		() =>
			new BigNumber(rewardAmount?.[0]?.toString() || 0).dividedBy(
				10 ** 18,
			),
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
								rewardsClaimable.isZero()
							}
							onClick={() => {
								if (rewardsClaimable.gt(0)) {
									handleClaimFees({
										args: [yaxis],
									})
								}
							}}
							loading={loadingClaimFees}
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

export default ClaimFees

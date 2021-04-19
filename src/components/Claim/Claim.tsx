import { useState } from 'react'
import { Col } from 'antd'
import { CardRow } from '../../components/ExpandableSidePanel'
import Value from '../../components/Value'
import Button from '../../components/Button'
import RewardAPYTooltip from '../../components/Tooltip/Tooltips/RewardAPYTooltip'
import useContractWrite from '../../hooks/useContractWrite'
import useContractReadAccount from '../../hooks/useContractReadAccount'
import { getBalanceNumber } from '../../utils/formatBalance'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import BigNumber from 'bignumber.js'
import { RewardsContracts } from '../../yaxis/type'

type Props = { rewardsContract: keyof RewardsContracts }

const Claim: React.FC<Props> = ({ rewardsContract }) => {
	const { account } = useWeb3Provider()
	const { call: handleClaim, loading: loadingClaim } = useContractWrite({
		contractName: `rewards.${rewardsContract}`,
		method: 'getReward',
		description: `claim YAXIS`,
	})
	const {
		loading: loadingClaimable,
		data: claimable,
	} = useContractReadAccount({
		contractName: `rewards.${rewardsContract}`,
		method: 'earned',
		args: [account],
	})

	const [claimVisible, setClaimVisible] = useState(false)
	return (
		<CardRow
			main="Rewards"
			secondary={
				<Value
					value={getBalanceNumber(new BigNumber(claimable))}
					numberSuffix=" YAXIS"
					decimals={2}
				/>
			}
			rightContent={
				<Col xs={12} sm={12} md={12}>
					<RewardAPYTooltip visible={claimVisible} title="">
						<Button
							disabled={
								loadingClaimable ||
								new BigNumber(claimable).isZero()
							}
							onClick={() =>
								handleClaim({ cb: () => setClaimVisible(true) })
							}
							loading={loadingClaim}
							height={'40px'}
						>
							Claim
						</Button>
					</RewardAPYTooltip>
				</Col>
			}
		/>
	)
}

export default Claim

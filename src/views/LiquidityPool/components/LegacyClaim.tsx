import { useState } from 'react'
import { Col } from 'antd'
import { CardRow } from '../../../components/ExpandableSidePanel'
import Value from '../../../components/Value'
import Button from '../../../components/Button'
import RewardAPYTooltip from '../../../components/Tooltip/Tooltips/RewardAPYTooltip'
import Tooltip from '../../../components/Tooltip'
import useEarnings from '../../../hooks/useEarnings'
import useReward from '../../../hooks/useReward'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { StakePool } from '../../../yaxis/type'

interface LegacyClaimProps {
	pool: StakePool
}

const LegacyClaim: React.FC<LegacyClaimProps> = ({ pool }) => {
	const { balance: earnings } = useEarnings(pool.pid)
	const { loading, error, onReward } = useReward(pool.pid)
	const [claimVisible, setClaimVisible] = useState(false)
	return (
		<CardRow
			main="Return"
			secondary={
				<Value
					value={getBalanceNumber(earnings)}
					numberSuffix=" YAX"
					decimals={2}
				/>
			}
			rightContent={
				<Col xs={12} sm={12} md={12}>
					<Tooltip title={error}>
						<RewardAPYTooltip visible={claimVisible} title="">
							<Button
								disabled={!earnings.toNumber()}
								onClick={() => onReward(setClaimVisible(true))}
								loading={loading}
								height={'40px'}
							>
								Claim
							</Button>
						</RewardAPYTooltip>
					</Tooltip>
				</Col>
			}
		/>
	)
}

export default LegacyClaim

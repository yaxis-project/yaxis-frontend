import { useState } from 'react'
import { Col } from 'antd'
import CardRow from '../../../components/CardRow'
import Value from '../../../components/Value'
import Button from '../../../components/Button'
import RewardAPYTooltip from '../../../components/Tooltip/Tooltips/RewardAPYTooltip'
// import Tooltip from '../../../components/Tooltip'
import { useLegacyReturns } from '../../../state/wallet/hooks'
import useContractWrite from '../../../hooks/useContractWrite'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { LiquidityPool } from '../../../constants/type'
import useTranslation from '../../../hooks/useTranslation'

interface LegacyClaimProps {
	pool: LiquidityPool
}

const LegacyClaim: React.FC<LegacyClaimProps> = ({ pool }) => {
	const translate = useTranslation()

	const [claimVisible, setClaimVisible] = useState(false)
	const {
		lp: { pendingYax: earnings },
	} = useLegacyReturns(pool.pid)
	const { call: onReward, loading } = useContractWrite({
		contractName: 'internal.yaxisChef',
		method: 'deposit',
		description: `claim ${pool.name}`,
	})

	return (
		<CardRow
			main={translate('Returns')}
			secondary={
				<Value
					value={getBalanceNumber(earnings)}
					numberSuffix=" YAX"
					decimals={2}
				/>
			}
			rightContent={
				<Col xs={12} sm={12} md={12}>
					{/* <Tooltip title={error}> */}
					<RewardAPYTooltip visible={claimVisible} title="">
						<Button
							disabled={!earnings.toNumber()}
							onClick={() =>
								onReward({
									args: [pool?.pid, '0'],
									cb: () => setClaimVisible(true),
								})
							}
							loading={loading}
							height={'40px'}
							style={{ width: '100%' }}
						>
							Claim
						</Button>
					</RewardAPYTooltip>
					{/* </Tooltip> */}
				</Col>
			}
		/>
	)
}

export default LegacyClaim

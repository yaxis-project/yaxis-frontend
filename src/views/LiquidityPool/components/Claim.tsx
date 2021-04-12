import { useState } from 'react'
import { Col } from 'antd'
import { CardRow } from '../../../components/ExpandableSidePanel'
import Value from '../../../components/Value'
import Button from '../../../components/Button'
import RewardAPYTooltip from '../../../components/Tooltip/Tooltips/RewardAPYTooltip'
// import Tooltip from '../../../components/Tooltip'
import useContractWrite from '../../../hooks/useContractWrite'
import useContractReadAccount from '../../../hooks/useContractReadAccount'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { StakePool } from '../../../yaxis/type'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import BigNumber from 'bignumber.js'

interface ClaimProps {
	pool: StakePool
}

const Claim: React.FC<ClaimProps> = ({ pool }) => {
	const { account } = useWeb3Provider()
	const { call: handleClaim, loading: loadingClaim } = useContractWrite({
		contractName: `rewards.${pool.rewards}`,
		method: 'stake',
		description: `claim ${pool.name}`,
	})
	const {
		loading: loadingClaimable,
		data: claimable,
	} = useContractReadAccount({
		contractName: `rewards.${pool.rewards}`,
		method: 'rewards',
		args: [account],
	})
	const [claimVisible, setClaimVisible] = useState(false)
	return (
		<CardRow
			main="Return"
			secondary={
				<Value
					value={getBalanceNumber(new BigNumber(claimable))}
					numberSuffix=" YAXIS"
					decimals={2}
				/>
			}
			rightContent={
				<Col xs={12} sm={12} md={12}>
					{/* <Tooltip title={error}> */}
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
					{/* </Tooltip> */}
				</Col>
			}
		/>
	)
}

export default Claim

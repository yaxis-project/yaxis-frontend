import React from 'react'
import { Contract } from 'web3-eth-contract'
import { Row, Col, Card } from 'antd'
import Button from '../../../components/Button'
import Tooltip from '../../../components/Tooltip'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useModal from '../../../hooks/useModal'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useUnstake from '../../../hooks/useUnstake'
import { getBalanceNumber } from '../../../utils/formatBalance'
import WithdrawModal from './WithdrawModal'
import BigNumber from 'bignumber.js'

interface StakeProps {
	lpContract: Contract
	pid: number
	tokenName: string
}

const LegacyStake: React.FC<StakeProps> = ({ lpContract, pid, tokenName }) => {
	const { balance: stakedBalance } = useStakedBalance(pid)

	const {
		onUnstake,
		loading: unstakeLoading,
		error: unstakeError,
	} = useUnstake(pid, tokenName)

	const [onPresentWithdraw] = useModal(
		<WithdrawModal
			max={stakedBalance}
			onConfirm={onUnstake}
			tokenName={tokenName}
		/>,
	)

	if (stakedBalance.eq(0)) return null

	return (
		<Card title={<strong>Staking</strong>}>
			<Row style={{ margin: '16px 0' }} justify="center" gutter={18}>
				<Col>
					<Value value={getBalanceNumber(stakedBalance)} />
				</Col>
				<Col>
					<Label text={`${tokenName} Tokens Staked`} />
				</Col>
			</Row>

			<Row justify="center">
				<Col span={12}>
					<Tooltip title={unstakeError}>
						<Button
							disabled={stakedBalance.eq(new BigNumber(0))}
							onClick={onPresentWithdraw}
							loading={unstakeLoading}
						>
							Unstake
						</Button>
					</Tooltip>
				</Col>
			</Row>
		</Card>
	)
}

export default LegacyStake

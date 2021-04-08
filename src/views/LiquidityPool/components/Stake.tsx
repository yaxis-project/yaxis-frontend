import React from 'react'
import styled from 'styled-components'
import { Contract } from 'web3-eth-contract'
import { Row, Col, Card, Divider } from 'antd'
import Button from '../../../components/Button'
import Tooltip from '../../../components/Tooltip'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useModal from '../../../hooks/useModal'
import useStake from '../../../hooks/useStake'
import useGlobal from '../../../hooks/useGlobal'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'
import { getBalanceNumber } from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import BigNumber from 'bignumber.js'
import { getYaxisChefContract } from '../../../yaxis/utils'

interface StakeProps {
	lpContract: Contract
	pid: number
	tokenName: string
}

const Stake: React.FC<StakeProps> = ({ lpContract, pid, tokenName }) => {
	const { account } = useWeb3Provider()

	const allowance = useAllowance(lpContract)
	const { yaxis } = useGlobal()

	const {
		onApprove,
		loading: approveLoading,
		error: approveError,
	} = useApprove(
		lpContract,
		getYaxisChefContract(yaxis)?.options?.address,
		tokenName,
	)

	const { balance: tokenBalance } = useTokenBalance(
		lpContract.options.address,
	)
	const stakedBalance = useStakedBalance(pid)

	const { onStake, error: stakeError, loading: stakeLoading } = useStake(
		pid,
		tokenName,
	)
	const {
		onUnstake,
		loading: unstakeLoading,
		error: unstakeError,
	} = useUnstake(pid, tokenName)

	const [onPresentDeposit] = useModal(
		<DepositModal
			max={tokenBalance}
			onConfirm={onStake}
			tokenName={tokenName}
		/>,
	)

	const [onPresentWithdraw] = useModal(
		<WithdrawModal
			max={stakedBalance}
			onConfirm={onUnstake}
			tokenName={tokenName}
		/>,
	)

	return (
		<Card className="liquidity-card" title={<strong>Staking</strong>}>
			<Row>
				<CardContents>
					<Value value={getBalanceNumber(stakedBalance)} />
					<Label text={`${tokenName} Tokens Staked`} />
					<Divider />
					{!allowance.toNumber() ? (
						<Col span={12}>
							<Tooltip title={approveError}>
								<Button
									disabled={!account}
									onClick={onApprove}
									loading={approveLoading}
								>
									Approve {tokenName}
								</Button>
							</Tooltip>
						</Col>
					) : (
						<Row
							gutter={18}
							style={{
								width: '100%',
								justifyContent: 'space-between',
								padding: 0,
							}}
						>
							<Col span={12}>
								<Tooltip title={stakeError}>
									<Button
										disabled={tokenBalance.eq(
											new BigNumber(0),
										)}
										onClick={onPresentDeposit}
										loading={stakeLoading}
									>
										Stake
									</Button>
								</Tooltip>
							</Col>
							<Col span={12}>
								<Tooltip title={unstakeError}>
									<Button
										disabled={stakedBalance.eq(
											new BigNumber(0),
										)}
										onClick={onPresentWithdraw}
										loading={unstakeLoading}
									>
										Unstake
									</Button>
								</Tooltip>
							</Col>
						</Row>
					)}
				</CardContents>
			</Row>
		</Card>
	)
}

const CardContents = styled.div`
	align-items: center;
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
`

export default Stake

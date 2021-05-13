import React from 'react'
import styled from 'styled-components'
import { Row, Col, Card } from 'antd'
import Button from '../../../components/Button'
import Value from '../../../components/Value'
import useModal from '../../../hooks/useModal'
import { useLegacyReturns } from '../../../state/wallet/hooks'
import useContractWrite from '../../../hooks/useContractWrite'
import { getBalanceNumber } from '../../../utils/formatBalance'
import WithdrawModal from './WithdrawModal'
import BigNumber from 'bignumber.js'

interface StakeProps {
	pid: number
	tokenName: string
}

const LegacyStake: React.FC<StakeProps> = ({ pid, tokenName }) => {
	const {
		lp: { staked: stakedBalance },
	} = useLegacyReturns(pid)

	const { call: onUnstake, loading: unstakeLoading } = useContractWrite({
		contractName: 'internal.yaxisChef',
		method: 'unstake',
		description: `unstake ${tokenName}`,
	})

	const [onPresentWithdraw] = useModal(
		<WithdrawModal
			max={stakedBalance}
			onConfirm={(amount: string) =>
				onUnstake({
					args: [
						pid,
						new BigNumber(amount)
							.times(new BigNumber(10).pow(18))
							.toString(),
					],
				})
			}
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
					<Label>{tokenName} Tokens Staked</Label>
				</Col>
			</Row>

			<Row justify="center">
				<Col span={12}>
					<Button
						disabled={stakedBalance.eq(new BigNumber(0))}
						onClick={onPresentWithdraw}
						loading={unstakeLoading}
					>
						Unstake
					</Button>
				</Col>
			</Row>
		</Card>
	)
}

export default LegacyStake

const Label = styled.div`
	color: ${(props) => props.theme.color.grey[400]};
`

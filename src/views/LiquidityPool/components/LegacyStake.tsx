import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Row, Col, Card } from 'antd'
import Button from '../../../components/Button'
import Value from '../../../components/Value'
import { useLegacyReturns } from '../../../state/wallet/hooks'
import useContractWrite from '../../../hooks/useContractWrite'
import { getBalanceNumber } from '../../../utils/formatBalance'
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
		method: 'withdraw',
		description: `unstake ${tokenName}`,
	})

	const withdrawAll = useCallback(
		() =>
			onUnstake({
				args: [
					pid,
					new BigNumber(stakedBalance)
						.times(new BigNumber(10).pow(18))
						.toString(),
				],
			}),
		[stakedBalance, onUnstake, pid],
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
						onClick={withdrawAll}
						loading={unstakeLoading}
					>
						Unstake All
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

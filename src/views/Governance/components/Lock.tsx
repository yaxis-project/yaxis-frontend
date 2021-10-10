import React, { useState } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import { useHasLock } from '../../../state/wallet/hooks'
import { useContracts } from '../../../contexts/Contracts'
import useContractWrite from '../../../hooks/useContractWrite'
import { useAllTokenBalances } from '../../../state/wallet/hooks'
import { AutoStakeCover } from '../../../components/ApprovalCover/AutoStakeCover'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import useTranslation from '../../../hooks/useTranslation'

const { Text } = Typography

const CreateLock: React.FC = () => {
	const translate = useTranslation()

	const { call, loading } = useContractWrite({
		contractName: 'internal.votingEscrow',
		method: 'create_lock',
		description: `create lock`,
	})

	const [balances] = useAllTokenBalances()

	const [amount, setAmount] = useState('0')
	const [length, setLength] = useState(Math.floor(Date.now() / 1000) + 602400)

	return (
		<Row>
			<StyledRow justify="center">
				<Col>
					<Row style={{ marginBottom: '10px' }}>
						<StyledText>
							{translate('You have')}{' '}
							<span style={{ fontWeight: 600 }}>
								{balances?.yaxis?.amount
									? balances?.yaxis?.amount.toNumber()
									: '-'}{' '}
								YAXIS
							</span>
						</StyledText>
					</Row>
					<Row gutter={10} style={{ marginBottom: '10px' }}>
						<Col>
							<StyledText>{translate('Lock up')}</StyledText>
						</Col>
						<Col>
							<Input
								onChange={(e) => {
									setAmount(e.target.value)
								}}
								value={amount}
								min={'0'}
								placeholder="0"
								disabled={
									balances?.yaxis?.amount
										? balances?.yaxis?.amount.isZero()
										: true
								}
								suffix={'YAXIS'}
								onClickMax={() =>
									setAmount(
										balances?.yaxis?.amount.toString(),
									)
								}
							/>
						</Col>
					</Row>
					<Row style={{ marginBottom: '14px' }}>
						<StyledText>
							{translate('It will unlock')}{' '}
							{moment(length * 1000).fromNow()}. {translate('On')}{' '}
							{moment(length * 1000).format(
								'MMM Do YYYY, h:mm:ss a',
							)}
							.
						</StyledText>
					</Row>
					<Row
						justify="space-around"
						style={{ marginBottom: '10px' }}
					>
						<Button
							block={false}
							loading={loading}
							onClick={() => setLength(length + 602400)}
						>
							<Row align="middle">
								<span style={{ fontSize: '30px' }}>+</span>
								<span
									style={{
										marginTop: '4px',
										paddingLeft: '3px',
									}}
								>
									{translate('1 week')}
								</span>
							</Row>{' '}
						</Button>
						<Button
							block={false}
							loading={loading}
							onClick={() => setLength(length + 31324800)}
						>
							<Row align="middle">
								<span style={{ fontSize: '30px' }}>+</span>
								<span
									style={{
										marginTop: '4px',
										paddingLeft: '3px',
									}}
								>
									{translate('1 year')}
								</span>
							</Row>{' '}
						</Button>
					</Row>
				</Col>
			</StyledRow>
			<Button
				loading={loading}
				onClick={() =>
					call({
						args: [
							new BigNumber(amount)
								.multipliedBy(10 ** 18)
								.toString(),
							length,
						],
					})
				}
			>
				{translate('Create Lock')}
			</Button>
		</Row>
	)
}

const Lock: React.FC = () => {
	const translate = useTranslation()

	const { contracts } = useContracts()

	const hasLock = useHasLock()

	return (
		<StyledRow gutter={[0, 20]}>
			<Row>
				<StyledText>
					{translate(
						'Lock up your YAXIS token to increase your Vault rewards and get voting power toward governance decisions.',
					)}
				</StyledText>
			</Row>
			<StyledText>
				{translate(
					'These decay over time. Extend the lock up time to get the most benefits.',
				)}
			</StyledText>
			{hasLock ? (
				<StyledRow justify="center">
					<StyledText>YAXIS: 100</StyledText>
					<Input></Input>
					<Button>{translate('Lock')}</Button>
				</StyledRow>
			) : (
				<AutoStakeCover
					contractName={`currencies.ERC677.yaxis.contract`}
					approvee={contracts?.internal.votingEscrow.address}
					hidden={false}
					noWrapper
				>
					<CreateLock />
				</AutoStakeCover>
			)}
		</StyledRow>
	)
}

export { Lock }

const StyledRow = styled(Row)`
	padding: 30px;
	width: 100%;
`

const StyledText = styled(Text)`
	font-size: 20px;
`

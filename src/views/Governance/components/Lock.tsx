import React, { useState } from 'react'
import styled from 'styled-components'
import { Row, Col, DatePicker } from 'antd'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import { useLock } from '../../../state/wallet/hooks'
import { useContracts } from '../../../contexts/Contracts'
import useContractWrite from '../../../hooks/useContractWrite'
import { useAllTokenBalances } from '../../../state/wallet/hooks'
import ApprovalCover from '../../../components/ApprovalCover'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import useTranslation from '../../../hooks/useTranslation'

const { Text } = Typography

const CreateLock: React.FC = () => {
	const translate = useTranslation()

	const { call, loading: loadingCreateLock } = useContractWrite({
		contractName: 'internal.votingEscrow',
		method: 'create_lock',
		description: `create lock`,
	})

	const [balances, loadingBalances] = useAllTokenBalances()

	const [amount, setAmount] = useState('0')
	const [length, setLength] = useState(Math.floor(Date.now() / 1000) + 602400)

	return (
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
								setAmount(balances?.yaxis?.amount.toString())
							}
						/>
					</Col>
				</Row>
				<Row style={{ marginBottom: '14px' }}>
					<StyledText>
						{translate('It will unlock')}{' '}
						{moment(length * 1000).fromNow()}. {translate('On')}{' '}
						{moment(length * 1000).format('MMM Do YYYY, h:mm:ss a')}
						.
					</StyledText>
				</Row>
				<Row justify="space-around" style={{ marginBottom: '10px' }}>
					<Button
						block={false}
						loading={loadingCreateLock}
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
						</Row>
					</Button>
					<Button
						block={false}
						loading={loadingCreateLock}
						onClick={() => setLength(length + 602400)}
					>
						<Row align="middle">
							<span style={{ fontSize: '30px' }}>-</span>
							<span
								style={{
									marginTop: '4px',
									paddingLeft: '3px',
								}}
							>
								{translate('1 week')}
							</span>
						</Row>
					</Button>
					<Button
						block={false}
						loading={loadingCreateLock}
						onClick={() => setLength(length + 31324800)}
					>
						<Row align="middle">
							<span style={{ fontSize: '30px' }}>-</span>
							<span
								style={{
									marginTop: '4px',
									paddingLeft: '3px',
								}}
							>
								{translate('1 year')}
							</span>
						</Row>
					</Button>
					<Button
						block={false}
						loading={loadingCreateLock}
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
						</Row>
					</Button>
				</Row>
			</Col>
			<Button
				style={{ marginTop: '14px' }}
				disabled={loadingBalances || balances?.yaxis?.amount?.isZero()}
				loading={loadingCreateLock}
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
		</StyledRow>
	)
}

interface ExtendLockProps {
	data: ReturnType<typeof useLock>
}

const ExtendLock: React.FC<ExtendLockProps> = ({ data: { end, locked } }) => {
	const translate = useTranslation()

	const { call: callIncreaseTime, loading: loadingIncreaseTime } =
		useContractWrite({
			contractName: 'internal.votingEscrow',
			method: 'increase_unlock_time',
			description: `create lock`,
		})

	const { call: callIncreaseAmount, loading: loadingIncreaseAmount } =
		useContractWrite({
			contractName: 'internal.votingEscrow',
			method: 'increase_amount',
			description: `create lock`,
		})

	const { call: callWithdraw, loading: loadingWithdraw } = useContractWrite({
		contractName: 'internal.votingEscrow',
		method: 'withdraw',
		description: `create lock`,
	})

	const [balances, loadingBalances] = useAllTokenBalances()

	const [amount, setAmount] = useState('0')
	const [length, setLength] = useState(Math.floor(Date.now() / 1000) + 602400)

	return (
		<StyledRow justify="center">
			<Col>
				<Row style={{ marginBottom: '10px' }}>
					<StyledText>
						{translate('You have')}{' '}
						<span style={{ fontWeight: 600 }}>
							{locked.toString()} YAXIS
						</span>
					</StyledText>
				</Row>
				<Row style={{ marginBottom: '10px' }}>
					<StyledText>
						Unlocks in {moment(end.toNumber() * 1000).fromNow()}
					</StyledText>
				</Row>
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
								setAmount(balances?.yaxis?.amount.toString())
							}
						/>
					</Col>
				</Row>
				<Row style={{ marginBottom: '14px' }}>
					<StyledText>
						{translate('It will unlock')}{' '}
						{moment(length * 1000).fromNow()}. {translate('On')}{' '}
						{moment(length * 1000).format('MMM Do YYYY, h:mm:ss a')}
						.
					</StyledText>
				</Row>
				{/* <DatePicker
					onChange={() => {}}
					dateRender={() => <div>hi</div>}
					picker="week"
				/> */}
				<Row justify="space-around" style={{ marginBottom: '10px' }}>
					<Button
						block={false}
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
						</Row>
					</Button>
					<Button
						block={false}
						onClick={() => setLength(length + 602400)}
					>
						<Row align="middle">
							<span style={{ fontSize: '30px' }}>-</span>
							<span
								style={{
									marginTop: '4px',
									paddingLeft: '3px',
								}}
							>
								{translate('1 week')}
							</span>
						</Row>
					</Button>
					<Button
						block={false}
						onClick={() => setLength(length + 31324800)}
					>
						<Row align="middle">
							<span style={{ fontSize: '30px' }}>-</span>
							<span
								style={{
									marginTop: '4px',
									paddingLeft: '3px',
								}}
							>
								{translate('1 year')}
							</span>
						</Row>
					</Button>
					<Button
						block={false}
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
						</Row>
					</Button>
				</Row>
			</Col>
			<Button
				style={{ marginTop: '14px' }}
				disabled={loadingBalances || balances?.yaxis?.amount?.isZero()}
				onClick={
					() => {}
					// call({
					// 	args: [
					// 		new BigNumber(amount)
					// 			.multipliedBy(10 ** 18)
					// 			.toString(),
					// 		length,
					// 	],
					// })
				}
			>
				{translate('Create Lock')}
			</Button>
		</StyledRow>
	)
}

const Lock: React.FC = () => {
	const translate = useTranslation()

	const { contracts } = useContracts()

	const lock = useLock()

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
			{lock.hasLock ? (
				<StyledRow justify="center">
					<ExtendLock data={lock} />
				</StyledRow>
			) : (
				<ApprovalCover
					contractName={`currencies.ERC677.yaxis.contract`}
					approvee={contracts?.internal.votingEscrow.address}
					hidden={false}
				>
					<CreateLock />
				</ApprovalCover>
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

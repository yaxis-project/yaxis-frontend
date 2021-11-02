import React, { useState } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'
import Divider from '../../../components/Divider'
import Input from '../../../components/Input'
import Slider from '../../../components/Slider'
import { useLock } from '../../../state/wallet/hooks'
import { useContracts } from '../../../contexts/Contracts'
import useContractWrite from '../../../hooks/useContractWrite'
import { useAllTokenBalances } from '../../../state/wallet/hooks'
import ApprovalCover from '../../../components/ApprovalCover'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import useTranslation from '../../../hooks/useTranslation'

const { Text } = Typography

const WEEK_TIME = 602400

const CreateLock: React.FC = () => {
	const translate = useTranslation()

	const { call, loading: loadingCreateLock } = useContractWrite({
		contractName: 'internal.votingEscrow',
		method: 'create_lock',
		description: `create lock`,
	})

	const [balances, loadingBalances] = useAllTokenBalances()

	const [amount, setAmount] = useState('0')
	const [length, setLength] = useState(WEEK_TIME)
	return (
		<>
			<Row style={{ width: '100%' }}>
				<Col span={8}>
					<Text>Create Lock</Text>
				</Col>
				<Col span={16}>
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
					<Row
						gutter={10}
						style={{ marginBottom: '10px' }}
						align="middle"
					>
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
					<Row
						justify="space-around"
						style={{ marginBottom: '10px' }}
					>
						<Slider
							style={{ width: '100%' }}
							value={length / WEEK_TIME}
							min={1}
							max={52}
							tipFormatter={(value) =>
								value > 1 ? `${value} weeks` : `${value} week`
							}
							onChange={(value) => {
								setLength(WEEK_TIME * value)
							}}
						/>
					</Row>
					<Row justify="center">
						<StyledSmallText>
							{translate('It will unlock')}{' '}
							{moment(Date.now() + length * 1000).fromNow()}.
						</StyledSmallText>
					</Row>
					<Row style={{ marginBottom: '14px' }} justify="center">
						<StyledSmallText>
							{translate('On')}{' '}
							{moment(Date.now() + length * 1000).format(
								'MMM Do YYYY, h:mm:ss a',
							)}
						</StyledSmallText>
					</Row>
				</Col>
			</Row>

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
							Math.floor(Date.now() / 1000) + length,
						],
					})
				}
			>
				{translate('Create Lock')}
			</Button>
		</>
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
	const [length, setLength] = useState(0)

	return (
		<>
			<Row style={{ width: '100%' }}>
				<Col span={8}>
					<Text>Current Lock</Text>
				</Col>
				<Col span={16}>
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
				</Col>
			</Row>
			<Divider />
			<Row style={{ width: '100%' }}>
				<Col span={8}>
					<Text>Extend Lock</Text>
				</Col>
				<Col span={16}>
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
					<Row
						gutter={10}
						style={{ marginBottom: '10px' }}
						align="middle"
					>
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

					<Row
						justify="space-around"
						style={{ marginBottom: '10px' }}
					>
						<Slider
							style={{ width: '100%' }}
							value={length / WEEK_TIME}
							min={0}
							max={52}
							tipFormatter={(value) =>
								value > 1 || value === 0
									? `${value} weeks`
									: `${value} week`
							}
							onChange={(value) => {
								setLength(WEEK_TIME * value)
							}}
						/>
					</Row>
					<Row justify="center">
						<StyledSmallText>
							{translate('It will unlock')}{' '}
							{moment((end.toNumber() + length) * 1000).fromNow()}
							.
						</StyledSmallText>
					</Row>
					<Row style={{ marginBottom: '14px' }} justify="center">
						<StyledSmallText>
							{translate('On')}{' '}
							{moment((end.toNumber() + length) * 1000).format(
								'MMM Do YYYY, h:mm:ss a',
							)}
						</StyledSmallText>
					</Row>
				</Col>
			</Row>
			<Button
				style={{ marginTop: '14px' }}
				disabled={loadingBalances || (!length && !Number(amount))}
				loading={loadingIncreaseTime || loadingIncreaseAmount}
				onClick={() => {
					if (length)
						callIncreaseTime({
							args: [end.toNumber() + length],
						})
					if (amount)
						callIncreaseAmount({
							args: [
								new BigNumber(amount)
									.multipliedBy(10 ** 18)
									.toString(),
							],
						})
				}}
			>
				{translate('Extend Lock')}
			</Button>
		</>
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
			<Divider />
			{lock.hasLock ? (
				<ExtendLock data={lock} />
			) : (
				<Row style={{ width: '100%' }}>
					<ApprovalCover
						contractName={`currencies.ERC677.yaxis.contract`}
						approvee={contracts?.internal.votingEscrow.address}
						hidden={false}
					>
						<CreateLock />
					</ApprovalCover>
				</Row>
			)}
		</StyledRow>
	)
}

export { Lock }

const StyledRow = styled(Row)`
	padding: 20px;
	width: 100%;
`

const StyledText = styled(Text)`
	font-size: 20px;
`

const StyledSmallText = styled(Text)`
	font-size: 16px;
`

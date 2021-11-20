import React, { useState, useMemo } from 'react'
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

const WEEK_TIME = 60 * 60 * 24 * 7
const MAX_TIME = 1 * 365 * 24 * 60 * 60

const CreateLock: React.FC = () => {
	const translate = useTranslation()

	const nextWeekStart =
		(Math.floor(Date.now() / (WEEK_TIME * 1000)) + 1) * (WEEK_TIME * 1000)

	const { call, loading: loadingCreateLock } = useContractWrite({
		contractName: 'internal.votingEscrow',
		method: 'create_lock',
		description: `create lock`,
	})

	const [balances, loadingBalances] = useAllTokenBalances()

	const [amount, setAmount] = useState('0')
	const [length, setLength] = useState(WEEK_TIME)

	return (
		<StyledDiv>
			<Row style={{ marginBottom: '20px' }}>
				<Col span={8}>
					<StyledText>{translate('Amount')}</StyledText>
				</Col>
				<Col span={16}>
					<Row>
						<StyledSmallText>
							{translate('Wallet Balance')}
							{': '}
							<span style={{ fontWeight: 600 }}>
								{balances?.yaxis?.amount
									? balances?.yaxis?.amount.toNumber()
									: '-'}{' '}
								YAXIS
							</span>
						</StyledSmallText>
					</Row>
					<Row>
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
					</Row>
				</Col>
			</Row>

			<Row style={{ marginBottom: '20px' }}>
				<Col span={8}>
					<StyledText>{translate('Duration')}</StyledText>
				</Col>
				<Col span={16}>
					<Row style={{ marginBottom: '5px' }}>
						<Slider
							tooltipPlacement="left"
							style={{ width: '100%' }}
							value={length / WEEK_TIME}
							min={1}
							max={51}
							tipFormatter={(value) =>
								value > 1
									? `+ ${value} weeks`
									: `+ ${value} week`
							}
							onChange={(value) => {
								setLength(WEEK_TIME * value)
							}}
						/>
					</Row>
					<Row justify="center">
						<StyledSmallText>
							{translate('Unlocks')}{' '}
							{moment(nextWeekStart + length * 1000).fromNow()}{' '}
							{translate('at')}{' '}
							{moment(nextWeekStart + length * 1000).format(
								'MMM Do YYYY, h:mm a',
							)}
							.
						</StyledSmallText>
					</Row>
				</Col>
			</Row>

			<Row style={{ padding: '5px 0' }} justify="center">
				{/* TODO */}
				<StyledText>Resulting in {0}% of total Voting Power</StyledText>
			</Row>

			<Button
				style={{ width: '100%', marginTop: '14px' }}
				disabled={
					loadingBalances ||
					balances?.yaxis?.amount?.isZero() ||
					new BigNumber(amount).isZero() ||
					new BigNumber(amount).isNaN()
				}
				loading={loadingCreateLock}
				onClick={() =>
					call({
						args: [
							new BigNumber(amount)
								.multipliedBy(10 ** 18)
								.toString(),
							Math.floor(nextWeekStart / 1000) + length,
						],
					})
				}
			>
				{translate('Lock')}
			</Button>
		</StyledDiv>
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
		description: `withdraw from lock`,
	})

	const [balances, loadingBalances] = useAllTokenBalances()

	const [amount, setAmount] = useState('0')
	const [length, setLength] = useState(0)

	const maxLock = useMemo(() => {
		return (
			Math.floor((Date.now() / 1000 + MAX_TIME) / WEEK_TIME) -
			Math.floor(end.toNumber() / WEEK_TIME)
		)
	}, [end])

	return (
		<>
			<StyledRow2>
				<Col span={8}>
					<StyledText>Current Lock</StyledText>
				</Col>
				<Col span={16}>
					<Row style={{ marginBottom: '10px' }}>
						<StyledText>
							<span style={{ fontWeight: 600 }}>
								{locked.toString()} YAXIS
							</span>{' '}
							locked.
						</StyledText>
					</Row>
					<Row style={{ marginBottom: '10px' }}>
						{moment(end.toNumber() * 1000).isAfter(moment()) ? (
							<StyledText>
								{translate('Unlocks')} {translate('at')}{' '}
								{moment(end.toNumber() * 1000).format(
									'h:mm a on MMM Do YYYY',
								)}
								.
							</StyledText>
						) : (
							<Button
								style={{ width: '100%', marginTop: '14px' }}
								loading={loadingWithdraw}
								onClick={() => {
									callWithdraw()
								}}
							>
								{translate('Withdraw')}
							</Button>
						)}
					</Row>
				</Col>
			</StyledRow2>

			<Divider />

			<StyledDiv>
				<Row>
					<Col span={24}>
						<StyledText>Add to Lock</StyledText>
					</Col>
				</Row>

				<StyledRow>
					<StyledText>
						{translate(
							'Voting power diminishes with time. Extend the lock up time or amount to get the most benefits.',
						)}
					</StyledText>
				</StyledRow>

				<Row style={{ marginBottom: '20px' }}>
					<Col span={8}>
						<StyledText>{translate('Amount')}</StyledText>
					</Col>
					<Col span={16}>
						<Row>
							<StyledSmallText>
								{translate('Wallet Balance')}
								{': '}
								<span style={{ fontWeight: 600 }}>
									{balances?.yaxis?.amount
										? balances?.yaxis?.amount.toNumber()
										: '-'}{' '}
									YAXIS
								</span>
							</StyledSmallText>
						</Row>
						<Row>
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
						</Row>
					</Col>
				</Row>

				<Row style={{ marginBottom: '20px' }}>
					<Col span={8}>
						<StyledText>{translate('Duration')}</StyledText>
					</Col>
					<Col span={16}>
						<Row style={{ marginBottom: '5px' }}>
							<Slider
								tooltipPlacement="left"
								style={{ width: '100%' }}
								value={length / WEEK_TIME}
								min={0}
								max={maxLock}
								tipFormatter={(value) =>
									value > 1
										? `+ ${value} weeks`
										: `+ ${value} week`
								}
								onChange={(value) => {
									setLength(WEEK_TIME * value)
								}}
							/>
						</Row>
						<Row justify="center">
							<StyledSmallText>
								{translate('Unlocks')}{' '}
								{moment(
									(end.toNumber() + length) * 1000,
								).fromNow()}{' '}
								{translate('at')}{' '}
								{moment(
									(end.toNumber() + length) * 1000,
								).format('MMM Do YYYY, h:mm a')}
								.
							</StyledSmallText>
						</Row>
					</Col>
				</Row>

				<Row style={{ padding: '5px 0' }} justify="center">
					{/* TODO */}
					<StyledText>
						Resulting in {0}% of total Voting Power
					</StyledText>
				</Row>

				<Button
					style={{ width: '100%', marginTop: '14px' }}
					disabled={loadingBalances || (!length && !Number(amount))}
					loading={loadingIncreaseTime || loadingIncreaseAmount}
					onClick={() => {
						if (length)
							callIncreaseTime({
								args: [end.toNumber() + length],
							})
						if (new BigNumber(amount).gt(0))
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
			</StyledDiv>
		</>
	)
}

const Lock: React.FC = () => {
	const translate = useTranslation()

	const { contracts } = useContracts()

	const lock = useLock()

	if (lock.hasLock) return <ExtendLock data={lock} />

	return (
		<>
			<Row style={{ margin: '20px' }}>
				<StyledText>Lock up your YAXIS governance token to:</StyledText>
				<StyledSecondaryText>
					Boost your Vault YAXIS rewards by up to 2.5x.
				</StyledSecondaryText>
				<StyledSecondaryText>
					Vote for how emissions get distributed between the Vaults.
				</StyledSecondaryText>
			</Row>

			<Divider />

			<ApprovalCover
				contractName={`currencies.ERC677.yaxis.contract`}
				approvee={contracts?.internal.votingEscrow.address}
				hidden={false}
			>
				<CreateLock />
			</ApprovalCover>
		</>
	)
}

export { Lock }

const StyledRow = styled(Row)`
	padding: 30px;
	width: 100%;
`

const StyledRow2 = styled(Row)`
	padding: 30px 30px 0 30px;
	width: 100%;
`

const StyledDiv = styled.div`
	padding: 0 30px 30px 30px;
	width: 100%;
`

const StyledText = styled(Text)`
	font-size: 20px;
`

const StyledSecondaryText = styled(Text)`
	padding-top: 10px;
	font-size: 18px;
	margin-left: 10%;
`

const StyledSmallText = styled(Text)`
	font-size: 16px;
`

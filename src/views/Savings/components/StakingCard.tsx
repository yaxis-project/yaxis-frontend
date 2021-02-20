import React, { useContext, useState, useMemo } from 'react'
import { Currency, YAX } from '../../../utils/currencies'
import useEnter from '../../../hooks/useEnter'
import useLeave from '../../../hooks/useLeave'
import useYaxisStaking from '../../../hooks/useYaxisStaking'
import Value from '../../../components/Value'

import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'

import {
	Row,
	Col,
	Typography,
	Card,
	Button,
	Input,
	Form,
	notification,
} from 'antd'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '../../../utils/formatBalance'
import useApproveStaking from '../../../hooks/useApproveStaking'
import useAllowanceStaking from '../../../hooks/useAllowanceStaking'

const { Text } = Typography

/**
 * Construct a simple colomn with secondary text for use in a row.
 * @param props any
 */
const TableHeader = (props: any) => (
	<Col span={props.span}>
		<Text style={{ float: props.float || 'none' }} type="secondary">
			{props.value}
		</Text>
	</Col>
)

interface StakingRowProps {
	currency: Currency
	gutter: number
}

/**
 * Generate a staking information row for the given currency.
 * @param props StakingRowProps
 */
const StakingRow = (props: StakingRowProps) => {
	const { currency, gutter } = props
	const { stakedBalance, walletBalance } = useYaxisStaking(currency)
	return (
		<>
			<Row gutter={gutter}>
				<Col span={6}>
					<Value
						value={getBalanceNumber(walletBalance)}
						decimals={2}
						numberSuffix=" YAX"
					/>
				</Col>
				<Col span={12}>
					<Value
						value={getBalanceNumber(stakedBalance)}
						decimals={2}
						numberSuffix=" YAX"
					/>
				</Col>
			</Row>
		</>
	)
}

/**
 * Generate the main YAX staking card for the vault.
 */
export default function StakingCard() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	const t = (s: string) => phrases[s][language]
	const { onEnter } = useEnter()
	const { onLeave } = useLeave()
	const { stakedBalance, walletBalance, rate, sYaxBalance } = useYaxisStaking(
		YAX,
	)

	const { onApprove } = useApproveStaking()
	const allowance = useAllowanceStaking()

	const approveYAX = async () => {
		try {
			notification.info({
				message: t('Please approve YAX staking amount.'),
			})
			const txHash = await onApprove()
			if (!txHash) throw new Error('Approval transaction failed.')
		} catch (err) {
			notification.info({
				message: t(
					'An error occurred during YAX staking approval. Please try again.',
				),
			})
		}
	}

	/**
	 * Computes
	 */
	const stakeYAX = async () => {
		try {
			notification.info({
				message: t('Please approve staking transaction.'),
			})
			await onEnter(depositAmount)
		} catch (err) { }
	}

	const unstakeYAX = async () => {
		try {
			notification.info({
				message: t('Please approve YAX unstaking transaction.'),
			})
			const sYax = new BigNumber(withdrawAmount).times(1e18).div(rate)
			onLeave(sYax.toString())
		} catch {
			notification.info({
				message: t(
					'An error occurred during YAX unstaking. Please try again.',
				),
			})
		}
	}

	const [depositAmount, setDeposit] = useState<string>('0')
	const updateDeposit = (value: string) =>
		setDeposit(value == '' ? '0' : value)
	const errorDeposit = useMemo(
		() => new BigNumber(depositAmount).gt(walletBalance.div(1e18)),
		[walletBalance, depositAmount],
	)
	const depositDisabled = useMemo(
		() => new BigNumber(depositAmount).eq(new BigNumber(0)) || errorDeposit,
		[depositAmount, errorDeposit],
	)

	const [withdrawAmount, setWithdraw] = useState<string>('0')
	const updateWithdraw = (value: string) =>
		setWithdraw(value == '' ? '0' : value)
	const errorWithdraw = useMemo(
		() => new BigNumber(withdrawAmount).gt(stakedBalance),
		[stakedBalance, withdrawAmount],
	)
	const withdrawDisabled = useMemo(
		() =>
			new BigNumber(withdrawAmount).eq(new BigNumber(0)) || errorWithdraw,
		[withdrawAmount, errorWithdraw],
	)

	return (
		<Card className="staking-card" title={<strong>{t('Staking')}</strong>}>
			<Row gutter={24}>
				<TableHeader value={t('Wallet Balance')} span={12} />
				<TableHeader value={t('Account Balance')} span={12} />
			</Row>

			<Row gutter={24}>
				<Col span={12} className={'balance'}>
					<img src={YAX.icon} height="24" alt="logo" />
					<Value
						value={getBalanceNumber(walletBalance)}
						decimals={2}
						numberSuffix=" YAX"
					/>
				</Col>
				<Col span={12} className={'balance'}>
					<img src={YAX.icon} height="24" alt="logo" />
					<Value
						value={stakedBalance.toNumber()}
						decimals={2}
						numberSuffix=" YAX"
					/>
				</Col>
			</Row>

			<Row gutter={24}>
				<Col span={12}>
					<Form.Item validateStatus={errorDeposit && 'error'}>
						<Input
							onChange={(e) => updateDeposit(e.target.value)}
							placeholder="0"
							suffix={YAX.name}
						/>
					</Form.Item>
					{!allowance.toNumber() ? (
						<Button
							className="staking-btn"
							onClick={approveYAX}
							block
							type="primary"
						>
							{t('Approve')}
						</Button>
					) : (
							<Button
								className="staking-btn"
								disabled={depositDisabled}
								onClick={stakeYAX}
								block
								type="primary"
							>
								{t('Deposit')}
							</Button>
						)}
				</Col>
				<Col span={12}>
					<Form.Item validateStatus={errorWithdraw && 'error'}>
						<Input
							onChange={(e) => updateWithdraw(e.target.value)}
							placeholder="0"
							suffix={YAX.name}
						/>
					</Form.Item>
					<Button
						className="staking-btn"
						disabled={withdrawDisabled}
						onClick={unstakeYAX}
						block
						type="primary"
					>
						{phrases['Withdraw'][language]}
					</Button>
				</Col>
			</Row>
		</Card>
	)
}

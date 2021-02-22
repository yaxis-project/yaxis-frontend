import React, { useContext, useState, useMemo } from 'react'
import { YAX } from '../../../utils/currencies'
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

/**
 * Generate the main YAX staking card for the vault.
 */
export default function StakingCard() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	const t = (s: string) => phrases[s][language]
	const { onEnter } = useEnter()
	const { onLeave } = useLeave()
	const { stakedBalance, walletBalance, rate, yaxBalance, sYaxBalance } = useYaxisStaking(
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
			const yax = depositAmount
			setDeposit('0')
			await onEnter(yax)
		} catch (err) { }
	}

	const unstakeYAX = async () => {
		try {
			notification.info({
				message: t('Please approve YAX unstaking transaction.'),
			})
			const sYax = new BigNumber(withdrawAmount).times(1e18).div(rate)
			setWithdraw('0')
			onLeave(sYax.toString())
		} catch {
			notification.info({
				message: t(
					'An error occurred during YAX unstaking. Please try again.',
				),
			})
		}
	}

	const [depositAmount, setDeposit] = useState<string>('')
	const updateDeposit = (value: string) => setDeposit(value.replace(/\D/g, ''))

	const errorDeposit = useMemo(
		() => new BigNumber(depositAmount).gt(walletBalance.div(1e18)),
		[walletBalance, depositAmount],
	)
	const depositDisabled = useMemo(
		() => depositAmount === '' || new BigNumber(depositAmount).eq(new BigNumber(0)) || errorDeposit,
		[depositAmount, errorDeposit],
	)
	const maxDeposit = () => setDeposit(yaxBalance.toString() || '0')


	const [withdrawAmount, setWithdraw] = useState<string>('')
	const updateWithdraw = (value: string) =>
		setWithdraw(value.replace(/\D/g, ''))
	const errorWithdraw = useMemo(
		() => new BigNumber(withdrawAmount).gt(stakedBalance),
		[stakedBalance, withdrawAmount],
	)
	const withdrawDisabled = useMemo(
		() =>
			withdrawAmount === '' || new BigNumber(withdrawAmount).eq(new BigNumber(0)) || errorWithdraw,
		[withdrawAmount, errorWithdraw],
	)

	const maxWithdraw = () => setWithdraw(stakedBalance.toString() || '0')

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
						numberSuffix=" sYAX"
					/>
				</Col>
			</Row>

			<Row gutter={24}>
				<Col span={12}>
					<Form.Item validateStatus={errorDeposit && 'error'}>
						<Input
							onChange={(e) => updateDeposit(e.target.value)}
							value={depositAmount}
							min={"0"}
							placeholder="0"
							suffix={
								<>
									<Text type="secondary">
										{YAX.name}
									</Text>
								&nbsp;
								<Button
										block
										size="small"
										onClick={maxDeposit}
									>
										MAX
								</Button>
								</>
							}
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
							value={withdrawAmount}
							min={"0"}
							placeholder="0"
							suffix={
								<>
									<Text type="secondary">
										sYAX
									</Text>
							&nbsp;
							<Button
										block
										size="small"
										onClick={maxWithdraw}
									>
										MAX
							</Button>
								</>
							}
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

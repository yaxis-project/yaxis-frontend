import { useContext, useState, useMemo, useCallback } from 'react'
import { YAXIS } from '../../../utils/currencies'
import useEnter from '../../../hooks/useEnter'
import useLeave from '../../../hooks/useLeave'
import useYaxisStaking from '../../../hooks/useYAXISStaking'
import Value from '../../../components/Value'
import { useWeb3React } from '@web3-react/core'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import Button from '../../../components/Button'
import Tooltip from '../../../components/Tooltip'
import Input from '../../../components/Input'
import { Row, Col, Typography, Card, Form, notification } from 'antd'
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
	const { account } = useWeb3React()
	const languages = useContext(LanguageContext)
	const t = useCallback(
		(s: string) => phrases[s][languages?.state?.selected],
		[languages],
	)
	const { onEnter } = useEnter()
	const { onLeave } = useLeave()
	const {
		balances: { stakedBalance, walletBalance, rate, yaxBalance },
	} = useYaxisStaking()

	const [loading, setLoading] = useState(false)
	const [depositAmount, setDeposit] = useState<string>('')

	const { error: approveError, onApprove } = useApproveStaking()
	const allowance = useAllowanceStaking()

	const approveYAX = useCallback(async () => {
		setLoading(true)
		await onApprove()
		setLoading(false)
	}, [onApprove])

	/**
	 * Computes
	 */
	const stakeYAX = useCallback(async () => {
		try {
			setLoading(true)
			notification.info({
				message: t('Please approve staking transaction.'),
			})
			const yax = depositAmount
			await onEnter(yax)
			setDeposit('0')
			setLoading(false)
		} catch (err) {
			notification.info({
				message: `An error occured duirng YAXIS staking:`,
				description: err.message,
			})
			setLoading(false)
		}
	}, [depositAmount, onEnter, t])

	const unstakeYAX = async () => {
		try {
			setLoading(true)
			notification.info({
				message: t('Please approve YAXIS unstaking transaction.'),
			})
			const sYax = new BigNumber(withdrawAmount).times(1e18).div(rate)
			await onLeave(sYax.toString())
			setWithdraw('0')
			setLoading(false)
		} catch (err) {
			notification.info({
				message: `An error occured duirng YAXIS unstaking:`,
				description: err.message,
			})
			setLoading(false)
		}
	}

	const updateDeposit = (value: string) =>
		!isNaN(Number(value)) && setDeposit(value)

	const errorDeposit = useMemo(
		() => new BigNumber(depositAmount).gt(walletBalance.div(1e18)),
		[walletBalance, depositAmount],
	)
	const depositDisabled = useMemo(
		() =>
			depositAmount === '' ||
			new BigNumber(depositAmount).eq(new BigNumber(0)) ||
			errorDeposit,
		[depositAmount, errorDeposit],
	)
	const maxDeposit = () => setDeposit(yaxBalance.toString() || '0')

	const [withdrawAmount, setWithdraw] = useState<string>('')
	const updateWithdraw = (value: string) =>
		!isNaN(Number(value)) && setWithdraw(value)
	const errorWithdraw = useMemo(
		() => new BigNumber(withdrawAmount).gt(stakedBalance),
		[stakedBalance, withdrawAmount],
	)
	const withdrawDisabled = useMemo(
		() =>
			withdrawAmount === '' ||
			new BigNumber(withdrawAmount).eq(new BigNumber(0)) ||
			errorWithdraw,
		[withdrawAmount, errorWithdraw],
	)

	const maxWithdraw = () => setWithdraw(stakedBalance.toString() || '0')

	return (
		<Card className="staking-card" title={<strong>{t('Staking')}</strong>}>
			<Row gutter={24}>
				<TableHeader value={t('Available Balance')} span={12} />
				<TableHeader value={t('Staked Balance')} span={12} />
			</Row>

			<Row gutter={24}>
				<Col span={12} className={'balance'}>
					<img src={YAXIS.icon} height="24" alt="logo" />
					<Value
						value={getBalanceNumber(walletBalance)}
						decimals={2}
						numberSuffix=" YAXIS"
					/>
				</Col>
				<Col span={12} className={'balance'}>
					<img src={YAXIS.icon} height="24" alt="logo" />
					<Value
						value={stakedBalance.toNumber()}
						decimals={2}
						numberSuffix=" YAXIS"
					/>
				</Col>
			</Row>

			<Row gutter={24}>
				<Col span={12}>
					<Form.Item validateStatus={errorDeposit && 'error'}>
						<Input
							onChange={(e) => updateDeposit(e.target.value)}
							value={depositAmount}
							min={'0'}
							placeholder="0"
							disabled={loading || walletBalance.isZero()}
							suffix={YAXIS.name}
							onClickMax={maxDeposit}
						/>
					</Form.Item>
					{!allowance.toNumber() ? (
						<Tooltip title={approveError}>
							<Button
								disabled={!account}
								onClick={approveYAX}
								loading={loading}
							>
								{t('Approve')}
							</Button>
						</Tooltip>
					) : (
						<Button
							disabled={depositDisabled}
							onClick={stakeYAX}
							loading={loading}
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
							min={'0'}
							placeholder="0"
							disabled={loading || stakedBalance.isZero()}
							suffix="YAXIS"
							onClickMax={maxWithdraw}
						/>
					</Form.Item>
					<Button
						disabled={withdrawDisabled}
						onClick={unstakeYAX}
						loading={loading}
					>
						{t('Withdraw')}
					</Button>
				</Col>
			</Row>
		</Card>
	)
}

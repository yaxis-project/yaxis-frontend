import { useContext, useState, useMemo, useCallback } from 'react'
import { MVLT } from '../../../utils/currencies'
import useContractWrite from '../../../hooks/useContractWrite'
import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useGlobal from '../../../hooks/useGlobal'
import useRewardsContract from '../../../hooks/useRewardsContract'
import Value from '../../../components/Value'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import { Row, Col, Typography, Card, Form } from 'antd'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '../../../utils/formatBalance'
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

function Stake({ mvlt }) {
	const languages = useContext(LanguageContext)
	const t = useCallback(
		(s: string) => phrases[s][languages?.state?.selected],
		[languages],
	)
	const { call: handleStake, loading: loadingStake } = useContractWrite({
		contractName: `rewards.MetaVault`,
		method: 'stake',
		description: `stake MVLT`,
	})
	const { call: handleUnstake, loading: loadingUnstake } = useContractWrite({
		contractName: `rewards.MetaVault`,
		method: 'unstake',
		description: `unstake MVLT`,
	})
	const {
		balances: {
			rawWalletBalance,
			walletBalance,
			stakedBalance,
			rawStakedBalance,
		},
	} = useRewardsContract(mvlt, 'MetaVault')

	const [depositAmount, setDeposit] = useState<string>('')
	const updateDeposit = (value: string) =>
		!isNaN(Number(value)) && setDeposit(value)
	const errorDeposit = useMemo(
		() => new BigNumber(depositAmount).gt(rawWalletBalance.div(1e18)),
		[rawWalletBalance, depositAmount],
	)
	const depositDisabled = useMemo(
		() =>
			depositAmount === '' ||
			new BigNumber(depositAmount).isZero() ||
			errorDeposit,
		[depositAmount, errorDeposit],
	)
	const onMaxDeposit = () => setDeposit(walletBalance.toString() || '0')

	const [withdrawAmount, setWithdraw] = useState<string>('')
	const updateWithdraw = (value: string) =>
		!isNaN(Number(value)) && setWithdraw(value)
	const errorWithdraw = useMemo(
		() => new BigNumber(withdrawAmount).gt(rawStakedBalance),
		[rawStakedBalance, withdrawAmount],
	)
	const withdrawDisabled = useMemo(
		() =>
			withdrawAmount === '' ||
			new BigNumber(withdrawAmount).isZero() ||
			errorWithdraw,
		[withdrawAmount, errorWithdraw],
	)

	const onMaxWithdraw = () => setWithdraw(stakedBalance.toString() || '0')

	return (
		<>
			<Row gutter={24}>
				<TableHeader value={t('Available Balance')} span={12} />
				<TableHeader value={t('Staked Balance')} span={12} />
			</Row>

			<Row gutter={24}>
				<Col span={12} className={'balance'}>
					<img src={MVLT.icon} height="24" alt="logo" />
					<Value
						value={getBalanceNumber(rawWalletBalance)}
						decimals={2}
						numberSuffix={` ${MVLT.name}`}
					/>
				</Col>
				<Col span={12} className={'balance'}>
					<img src={MVLT.icon} height="24" alt="logo" />
					<Value
						value={getBalanceNumber(rawStakedBalance)}
						decimals={2}
						numberSuffix={` ${MVLT.name}`}
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
							disabled={loadingStake || walletBalance.isZero()}
							onClickMax={onMaxDeposit}
						/>
					</Form.Item>
					<Button
						disabled={depositDisabled}
						onClick={async () =>
							await handleStake({
								amount: new BigNumber(
									depositAmount,
								).multipliedBy(10 ** MVLT.decimals),
								args: [
									new BigNumber(depositAmount).multipliedBy(
										10 ** MVLT.decimals,
									),
								],
								cb: () => setDeposit('0'),
							})
						}
						loading={loadingStake}
					>
						{t('Deposit')}
					</Button>
				</Col>
				<Col span={12}>
					<Form.Item validateStatus={errorWithdraw && 'error'}>
						<Input
							onChange={(e) => updateWithdraw(e.target.value)}
							value={withdrawAmount}
							min={'0'}
							placeholder="0"
							disabled={loadingUnstake || stakedBalance.isZero()}
							onClickMax={onMaxWithdraw}
						/>
					</Form.Item>
					<Button
						disabled={withdrawDisabled}
						onClick={async () =>
							await handleUnstake({
								amount: new BigNumber(
									withdrawAmount,
								).multipliedBy(10 ** MVLT.decimals),
								args: [
									new BigNumber(withdrawAmount).multipliedBy(
										10 ** MVLT.decimals,
									),
								],
								cb: () => setWithdraw('0'),
							})
						}
						loading={loadingUnstake}
					>
						{t('Withdraw')}
					</Button>
				</Col>
			</Row>
		</>
	)
}

export default function ApprovalWrapper() {
	const languages = useContext(LanguageContext)
	const t = useCallback(
		(s: string) => phrases[s][languages?.state?.selected],
		[languages],
	)

	const { yaxis } = useGlobal()

	const allowance = useAllowance(
		yaxis?.contracts.yaxisMetaVault,
		yaxis?.contracts?.rewards.MetaVault.options.address,
	)

	const { onApprove, loading } = useApprove(
		yaxis?.contracts.yaxisMetaVault,
		yaxis?.contracts?.rewards.MetaVault.options.address,
		'MVLT',
	)

	return (
		<Card className="staking-card" title={<strong>{t('Staking')}</strong>}>
			{allowance.isEqualTo(0) ? (
				<>
					<Row justify="center" style={{ paddingBottom: '20px' }}>
						<Col>
							To start staking, first approve the Rewards contract
							to use your MVLT.
						</Col>
					</Row>
					<Row justify="center">
						<Col span={4}>
							<Button onClick={onApprove} loading={loading}>
								{t('Approve')}
							</Button>
						</Col>
					</Row>
				</>
			) : (
				<Stake
					mvlt={yaxis?.contracts?.yaxisMetaVault.options.address}
				/>
			)}
		</Card>
	)
}

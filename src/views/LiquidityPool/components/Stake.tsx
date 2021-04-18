import { useContext, useState, useMemo, useCallback } from 'react'
import * as currencies from '../../../utils/currencies'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
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
import { Row, Col, Typography, Card, Form, Result } from 'antd'
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

function Stake({ pool }) {
	const currency = useMemo(
		() => currencies[`${pool.type.toUpperCase()}_LP`],
		[pool.type],
	)
	const languages = useContext(LanguageContext)
	const t = useCallback(
		(s: string) => phrases[s][languages?.state?.selected],
		[languages],
	)
	const { call: handleStake, loading: loadingStake } = useContractWrite({
		contractName: `rewards.${pool.rewards}`,
		method: 'stake',
		description: `stake ${pool.name}`,
	})
	const { call: handleUnstake, loading: loadingUnstake } = useContractWrite({
		contractName: `rewards.${pool.rewards}`,
		method: 'unstake',
		description: `unstake ${pool.name}`,
	})
	const {
		balances: {
			rawWalletBalance,
			walletBalance,
			stakedBalance,
			rawStakedBalance,
		},
	} = useRewardsContract(pool.lpAddress, pool.rewards)

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
					<img src={currency.icon} height="24" alt="logo" />
					<Value
						value={getBalanceNumber(rawWalletBalance)}
						decimals={2}
						numberSuffix={` ${pool.symbol}`}
					/>
				</Col>
				<Col span={12} className={'balance'}>
					<img src={currency.icon} height="24" alt="logo" />
					<Value
						value={getBalanceNumber(rawStakedBalance)}
						decimals={2}
						numberSuffix={` ${pool.symbol}`}
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
								amount: new BigNumber(depositAmount)
									.multipliedBy(10 ** currency.decimals)
									.toString(),
								args: [
									new BigNumber(depositAmount)
										.multipliedBy(10 ** currency.decimals)
										.toString(),
								],
								cb: () => setDeposit('0'),
							})
						}
						loading={loadingStake}
					>
						{t('Stake')}
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
								amount: new BigNumber(withdrawAmount)
									.multipliedBy(10 ** currency.decimals)
									.toString(),
								args: [
									new BigNumber(withdrawAmount)
										.multipliedBy(10 ** currency.decimals)
										.toString(),
								],
								cb: () => setWithdraw('0'),
							})
						}
						loading={loadingUnstake}
					>
						{t('Unstake')}
					</Button>
				</Col>
			</Row>
		</>
	)
}

export default function ApprovalWrapper({ pool }) {
	const { account } = useWeb3Provider()

	const languages = useContext(LanguageContext)
	const t = useCallback(
		(s: string) => phrases[s][languages?.state?.selected],
		[languages],
	)

	const { yaxis } = useGlobal()
	const LPContract = useMemo(
		() =>
			yaxis?.contracts.pools.find((p) => pool.lpAddress === p.lpAddress)
				?.lpContract,
		[yaxis?.contracts, pool.lpAddress],
	)
	const allowance = useAllowance(
		LPContract,
		yaxis?.contracts?.rewards[pool.rewards].options.address,
	)

	const { onApprove, loading } = useApprove(
		LPContract,
		yaxis?.contracts?.rewards[pool.rewards].options.address,
		pool.name,
	)

	const body = useMemo(() => {
		if (!account)
			return (
				<Row justify="center">
					<Result
						status="warning"
						title="Connect a wallet to start earning rewards."
					/>
				</Row>
			)
		if (allowance.isEqualTo(0))
			return (
				<>
					<Row justify="center" style={{ paddingBottom: '20px' }}>
						<Col>
							To start staking, first approve the Rewards contract
							to use your LP token
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
			)
		return <Stake pool={pool} />
	}, [account, allowance, loading, onApprove, pool, t])

	return (
		<Card className="staking-card" title={<strong>{t('Staking')}</strong>}>
			{body}
		</Card>
	)
}

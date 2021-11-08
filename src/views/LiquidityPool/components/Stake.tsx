import { useState, useMemo } from 'react'
import * as currencies from '../../../constants/currencies'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import useContractWrite from '../../../hooks/useContractWrite'
import { useContracts } from '../../../contexts/Contracts'
import { useAccountLP } from '../../../state/wallet/hooks'
import Value from '../../../components/Value'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import { Row, Col, Form, Result } from 'antd'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { useApprovals } from '../../../state/wallet/hooks'
import { ethers } from 'ethers'
import useTranslation from '../../../hooks/useTranslation'
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
	const translate = useTranslation()

	const currency = useMemo(
		() => currencies[`${pool.type.toUpperCase()}_LP`],
		[pool.type],
	)

	const { call: handleStake, loading: loadingStake } = useContractWrite({
		contractName: `rewards.${pool.rewards}`,
		method: 'stake',
		description: `stake ${pool.name}`,
	})
	const { call: handleUnstake, loading: loadingUnstake } = useContractWrite({
		contractName: `rewards.${pool.rewards}`,
		method: 'withdraw',
		description: `unstake ${pool.name}`,
	})

	const { walletBalance, stakedBalance } = useAccountLP(pool)

	const [depositAmount, setDeposit] = useState<string>('')
	const updateDeposit = (value: string) =>
		!isNaN(Number(value)) && setDeposit(value)
	const errorDeposit = useMemo(
		() => new BigNumber(depositAmount).gt(walletBalance?.value.div(1e18)),
		[walletBalance, depositAmount],
	)
	const depositDisabled = useMemo(
		() =>
			depositAmount === '' ||
			new BigNumber(depositAmount).isZero() ||
			errorDeposit,
		[depositAmount, errorDeposit],
	)
	const onMaxDeposit = () =>
		setDeposit(walletBalance?.amount.toString() || '0')

	const [withdrawAmount, setWithdraw] = useState<string>('')
	const updateWithdraw = (value: string) =>
		!isNaN(Number(value)) && setWithdraw(value)
	const errorWithdraw = useMemo(
		() => new BigNumber(withdrawAmount).gt(stakedBalance?.amount),
		[stakedBalance?.amount, withdrawAmount],
	)
	const withdrawDisabled = useMemo(
		() =>
			withdrawAmount === '' ||
			new BigNumber(withdrawAmount).isZero() ||
			errorWithdraw,
		[withdrawAmount, errorWithdraw],
	)

	const onMaxWithdraw = () =>
		setWithdraw(stakedBalance?.amount.toString() || '0')

	return (
		<>
			<Row gutter={24}>
				<TableHeader value={translate('Available Balance')} span={12} />
				<TableHeader value={translate('Staked Balance')} span={12} />
			</Row>

			<Row gutter={24}>
				<Col span={12} className={'balance'}>
					<img src={currency.icon} height="24" alt="logo" />
					<Value
						value={getBalanceNumber(walletBalance?.value)}
						decimals={2}
						numberSuffix={` ${pool.symbol}`}
					/>
				</Col>
				<Col span={12} className={'balance'}>
					<img src={currency.icon} height="24" alt="logo" />
					<Value
						value={getBalanceNumber(stakedBalance?.value)}
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
							disabled={
								loadingStake || walletBalance?.value.isZero()
							}
							onClickMax={onMaxDeposit}
						/>
					</Form.Item>
					<Button
						disabled={depositDisabled}
						onClick={async () =>
							await handleStake({
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
						{translate('Stake')}
					</Button>
				</Col>
				<Col span={12}>
					<Form.Item validateStatus={errorWithdraw && 'error'}>
						<Input
							onChange={(e) => updateWithdraw(e.target.value)}
							value={withdrawAmount}
							min={'0'}
							placeholder="0"
							disabled={
								loadingUnstake || stakedBalance?.value.isZero()
							}
							onClickMax={onMaxWithdraw}
						/>
					</Form.Item>
					<Button
						disabled={withdrawDisabled}
						onClick={async () =>
							await handleUnstake({
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
						{translate('Unstake')}
					</Button>
				</Col>
			</Row>
		</>
	)
}

export default function ApprovalWrapper({ pool }) {
	const translate = useTranslation()

	const { account } = useWeb3Provider()

	const { contracts } = useContracts()

	const {
		uniYaxisEth: { staking },
	} = useApprovals()

	const { call: onApprove, loading } = useContractWrite({
		contractName: `pools.${pool.name}.lpContract`,
		method: 'approve',
		description: `approve stake ${pool.name}`,
	})

	const body = useMemo(() => {
		if (!account)
			return (
				<Row justify="center">
					<Result
						status="warning"
						title={translate(
							'Connect a wallet to start earning rewards.',
						)}
					/>
				</Row>
			)
		if (staking.isEqualTo(0))
			return (
				<>
					<Row justify="center" style={{ padding: '20px 0' }}>
						<Col>
							<Text>
								{translate(
									'To start staking, first approve the Rewards contract to use your LP token',
								)}
								.
							</Text>
						</Col>
					</Row>
					<Row justify="center" style={{ paddingBottom: '20px' }}>
						<Col span={4}>
							<Button
								style={{ width: '100%' }}
								onClick={() =>
									onApprove({
										args: [
											contracts?.rewards[pool.rewards]
												.address,
											ethers.constants.MaxUint256,
										],
									})
								}
								loading={loading}
							>
								{translate('Approve')}
							</Button>
						</Col>
					</Row>
				</>
			)
		return <Stake pool={pool} />
	}, [account, staking, loading, onApprove, pool, translate, contracts])

	return (
		<Card
			className="staking-card"
			title={
				<Text>
					<strong>{translate('Staking')}</strong>
				</Text>
			}
		>
			{body}
		</Card>
	)
}

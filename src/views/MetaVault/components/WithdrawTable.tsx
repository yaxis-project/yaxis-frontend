import { useState, useContext, useMemo } from 'react'
import {
	Row,
	Col,
	Typography,
	Divider,
	notification,
	Form,
	Tooltip,
} from 'antd'
import { USD, CRV3 } from '../../../utils/currencies'
import logo from '../../../assets/img/logo-ui.svg'
import { find } from 'lodash'
import { numberToDecimal } from '../../../yaxis/utils'
import { LanguageContext } from '../../../contexts/Language'
import useMetaVault from '../../../hooks/useMetaVault'
import phrases from './translations'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import BigNumber from 'bignumber.js'
import useTransactionAdder from '../../../hooks/useTransactionAdder'
import { Transaction } from '../../../contexts/Transactions/types'
import Value from '../../../components/Value'
import Button from '../../../components/Button'
import { ArrowDownOutlined } from '@ant-design/icons'
import info from '../../../assets/img/info.svg'
import usePriceMap from '../../../hooks/usePriceMap'
import Input from '../../../components/Input'
import Stable3PoolWithdraw from './Stable3PoolWithdraw'
import styled from 'styled-components'
const { Title, Text } = Typography

/**
 * Generates the withdraw component, allowing a user to select investment currency to withdraw from.
 */
export default function WithdrawTable() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	const t = (s: string) => phrases[s][language]

	const {
		metaVaultData: { totalBalance, mvltPrice },
		currenciesData,
	} = useMetaVaultData('v1')

	const [withdrawValueUSD, setWithdrawValueUSD] = useState('')

	const totalAvailableInUSD = useMemo(
		() => new BigNumber(totalBalance || '0').multipliedBy(mvltPrice || '0'),
		[totalBalance, mvltPrice],
	)

	const withdrawValueShares = useMemo(
		() => new BigNumber(withdrawValueUSD).div(mvltPrice),
		[withdrawValueUSD, mvltPrice],
	)

	const updateWithdraw = (value: string) => setWithdrawValueUSD(value)
	const withdrawalError = new BigNumber(withdrawValueUSD).gt(
		totalAvailableInUSD,
	)
	const withdrawDisabled =
		withdrawValueUSD === '' ||
		new BigNumber(withdrawValueUSD).isLessThanOrEqualTo(new BigNumber(0)) ||
		withdrawalError

	const [submitting, setSubmitting] = useState(false)

	const { onAddTransaction } = useTransactionAdder()
	const { onWithdraw } = useMetaVault()

	const handleSubmit = async () => {
		const sharesAmount = numberToDecimal(withdrawValueShares, 18)
		notification.info({
			message: t('Please confirm withdraw transaction.'),
		})
		const selectedCurrency = find(
			currenciesData,
			(c) => c.tokenId === CRV3.tokenId,
		)
		try {
			setSubmitting(true)
			const receipt = await onWithdraw(
				sharesAmount,
				selectedCurrency.address,
			)
			if (receipt) {
				setWithdrawValueUSD('')
				onAddTransaction({
					hash: receipt.transactionHash,
					description: 'Withdraw|$' + withdrawValueUSD,
				} as Transaction)
			}
			setSubmitting(false)
		} catch (error) {
			notification.info({
				message: t('Error while withdrawing:'),
				description: error.message,
			})
			setSubmitting(false)
		}
	}

	const prices = usePriceMap()

	const withdrawTokenAmount = useMemo(() => {
		const price = prices[CRV3.priceMapKey]
		if (price) return new BigNumber(totalAvailableInUSD || 0).div(price)
		return new BigNumber(0)
	}, [totalAvailableInUSD, prices])

	return (
		<>
			<WithdrawRow>
				<Col xs={24} sm={8}>
					<Title level={5}>{phrases['From'][language]}</Title>
				</Col>
				<Col xs={24} sm={16}>
					<Row align="middle" gutter={14}>
						<Col>
							<img src={logo} height="36" alt="logo" />
						</Col>
						<Col>
							<Text>
								{phrases['Investment Account'][language]}
							</Text>
						</Col>
					</Row>
					<Row style={{ padding: '6px 0' }}>
						<Text type="secondary">
							{phrases['Available'][language]}:
							<Tooltip
								title={
									<>
										{new BigNumber(
											totalBalance || 0,
										).toFixed(2) + ' MVLT'}
									</>
								}
							>
								{' $' + totalAvailableInUSD.toFixed(2)}{' '}
								<img
									src={info}
									style={{ position: 'relative', top: -2 }}
									height="15"
									alt="Withdraw Token Breakdown"
								/>
							</Tooltip>
						</Text>
					</Row>
					<Form.Item validateStatus={withdrawalError && 'error'}>
						<Input
							onChange={(e) =>
								!isNaN(Number(e.target.value)) &&
								updateWithdraw(e.target.value)
							}
							value={withdrawValueUSD}
							min={'0'}
							placeholder="0"
							disabled={
								submitting || totalAvailableInUSD.isZero()
							}
							suffix={USD.name}
							onClickMax={() =>
								updateWithdraw(totalAvailableInUSD.toString())
							}
						/>
					</Form.Item>
				</Col>
			</WithdrawRow>

			<DividerGroup>
				<Divider />
				<DividerArrow />
			</DividerGroup>

			<WithdrawRow>
				<Col xs={24} sm={8}>
					<Title level={5}>{phrases['To Wallet'][language]}</Title>
				</Col>
				<Col xs={24} sm={16}>
					<Row align="middle">
						<Col span={3}>
							<Row>
								<img src={CRV3.icon} height="36" alt="logo" />
							</Row>
						</Col>
						<Col span={14}>
							<Row>
								<Text type="secondary">
									{t("You'll receive an estimate of")}
								</Text>
							</Row>
							<Row>
								<Value
									value={withdrawTokenAmount
										.times(0.999)
										.toFixed(2)}
									numberSuffix={` 3CRV`}
									extra={
										'$' +
										new BigNumber(withdrawValueUSD || 0)
											.times(0.999)
											.toFixed(2)
									}
								/>
							</Row>
						</Col>
					</Row>
					<Row style={{ margin: '10px 0' }}>
						<Button
							disabled={withdrawDisabled}
							loading={submitting}
							onClick={handleSubmit}
						>
							{t('Withdraw')}
						</Button>
					</Row>
					<Text type="secondary">{t('Withdraw Fee')}: 0.1%</Text>
				</Col>
			</WithdrawRow>

			<DividerGroup>
				<Divider />
				<DividerArrow />
			</DividerGroup>

			<WithdrawRow>
				<Col xs={24} sm={8}>
					<Title level={5}>{t('Convert')}</Title>
				</Col>
				<Col xs={24} sm={16}>
					<Stable3PoolWithdraw />
				</Col>
			</WithdrawRow>
		</>
	)
}

const WithdrawRow = styled(Row)`
	margin: 28px 22px;
	position: relative;
`

const DividerGroup = styled.div`
	position: relative;
`
const DividerArrow = styled(ArrowDownOutlined)`
	position: absolute;
	font-size: 24px;
	top: 0;
	transform: translateY(-45%);
	left: 50%;
	background: white;
	border: 8px solid white;
	svg {
		opacity: 0.3;
	}
`

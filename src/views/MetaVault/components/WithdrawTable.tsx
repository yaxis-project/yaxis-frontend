import React, { useState, useContext, useMemo } from 'react'
import {
	Button,
	Row,
	Col,
	Typography,
	Divider,
	Input,
	Select,
	notification,
	Form,
	Tooltip,
} from 'antd'
import { Currency, USD, DAI, CRV3, USDT, USDC } from '../../../utils/currencies'
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
import { ArrowDownOutlined } from '@ant-design/icons'
import info from '../../../assets/img/info.svg'
import usePriceMap from '../../../hooks/usePriceMap'

const { Option } = Select

const { Title, Text } = Typography

interface WithdrawalSelectorProps {
	withdrawValueUSD: BigNumber
	withdrawDisabled: boolean
	availableCurrencies: Currency[]
	handleSubmit: any,
	setWithdrawCurrency: any,
	withdrawalCurrency: any,
	submitting: any,
}

const WithdrawalSelector = (props: WithdrawalSelectorProps) => {
	const {
		availableCurrencies,
		withdrawValueUSD,
		withdrawDisabled,
		handleSubmit,
		withdrawalCurrency,
		setWithdrawCurrency,
		submitting,
	} = props
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	const t = (s: string) => phrases[s][language]

	const prices = usePriceMap()

	const withdrawTokenAmount = useMemo(() => {
		const price = prices[withdrawalCurrency.priceMapKey]
		if (price) {
			return withdrawValueUSD.div(price)
		}
		return new BigNumber(0)
	}, [withdrawalCurrency, withdrawValueUSD, prices])

	return (
		<Row className="to-wallet">
			<Col xs={24} sm={8}>
				<Title level={5}>{t('To Wallet')}</Title>
			</Col>
			<Col xs={24} sm={14}>
				<Select
					defaultValue={DAI.name}
					disabled={submitting}
					onSelect={(selected) =>
						setWithdrawCurrency(
							find(
								availableCurrencies,
								(curr) => curr.name === selected,
							),
						)
					}
				>
					{availableCurrencies.map((currency) => (
						<Option value={currency.name} key={currency.name}>
							<img src={currency.icon} height="36" alt="logo" />
							<Text>{currency.name}</Text>
						</Option>
					))}
				</Select>

				<Text className="title" type="secondary">
					{t("You'll receive an estimate of")}
				</Text>
				<Value
					value={withdrawTokenAmount.times(0.999).toFixed(2)}
					numberSuffix={` ${withdrawalCurrency.name}`}
					extra={'$' + withdrawValueUSD.times(0.999).toFixed(2)}
				/>
				<br />
				<Button
					className="investing-btn"
					disabled={withdrawDisabled}
					loading={submitting}
					onClick={handleSubmit}
					block
					type="primary"
				>
					{t('Withdraw')}
				</Button>
				<Text type="secondary">{t('Withdraw Fee')}: 0.1%</Text>
			</Col>
		</Row>
	)
}

/**
 * Takes USD value and converts to appropriate MVLT shares amount.
 */
const useWithdrawValueHandler = () => {
	const {
		metaVaultData: { totalBalance, mvltPrice },
		currenciesData
	} = useMetaVaultData('v1')

	const [withdrawValueUSD, setWithdrawValueUSD] = useState('')

	const totalAvailableInUSD = useMemo(
		() => new BigNumber(totalBalance || '0').multipliedBy(mvltPrice || '0'),
		[totalBalance, mvltPrice],
	)

	const withdrawValueShares = useMemo(() => new BigNumber(withdrawValueUSD).div(mvltPrice), [
		withdrawValueUSD,
		mvltPrice,
	])

	return {
		withdrawValueUSD,
		setWithdrawValueUSD,
		withdrawValueShares,
		totalAvailableInUSD,
		totalBalance,
		currenciesData
	}
}

/**
 * Generates the withdraw component, allowing a user to select investment currency to withdraw from.
 */
export default function WithdrawTable() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const {
		withdrawValueUSD,
		setWithdrawValueUSD,
		withdrawValueShares,
		totalAvailableInUSD,
		totalBalance,
		currenciesData
	} = useWithdrawValueHandler()

	const updateWithdraw = (value: string) =>
		setWithdrawValueUSD(
			value
		)
	const withdrawalError = new BigNumber(withdrawValueUSD).gt(totalAvailableInUSD)
	const withdrawDisabled =
		withdrawValueUSD === '' || new BigNumber(withdrawValueUSD).isLessThanOrEqualTo(new BigNumber(0)) ||
		withdrawalError

	const [submitting, setSubmitting] = useState(false)
	const [withdrawalCurrency, setWithdrawCurrency] = useState<
		Currency | undefined
	>(DAI)

	const t = (s: string) => phrases[s][language]
	const { onAddTransaction } = useTransactionAdder()
	const { onWithdraw } = useMetaVault()

	const handleSubmit = async () => {
		if (!withdrawalCurrency) {
			notification.error({
				message: `[withdraw] Invalid currency`,
			})
			return
		}
		const sharesAmount = numberToDecimal(withdrawValueShares, 18)
		notification.info({
			message: t('Please confirm withdraw transaction.'),
		})
		const selectedCurrency = find(
			currenciesData,
			(c) => c.tokenId === withdrawalCurrency.tokenId,
		)
		try {
			setSubmitting(true)
			const receipt = await onWithdraw(
				sharesAmount,
				selectedCurrency.address,
			)
			setWithdrawValueUSD('')
			onAddTransaction({
				hash: receipt.transactionHash,
				description: 'Withdraw|$' + withdrawValueUSD,
			} as Transaction)
			setSubmitting(false)

		} catch (error) {
			notification.info({
				message: t('Error while withdrawing:'),
				description: error.message
			})
			setSubmitting(false)
		}
	}

	return (
		<div className="withdraw-table">
			<Row className="withdraw-from">
				<Col xs={24} sm={8}>
					<Title level={5}>{phrases['From'][language]}</Title>
				</Col>
				<Col xs={24} sm={14}>
					<Text className="title">
						<img src={logo} height="36" alt="logo" />
						{phrases['Investment Account'][language]}
					</Text>

					<Text type="secondary" className="available">
						{phrases['Available'][language]}:
						<Tooltip
							title={
								<>
									{new BigNumber(totalBalance || 0).toFixed(
										2,
									) + ' MVLT'}
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
					<Form.Item validateStatus={withdrawalError && 'error'}>
						<Input
							placeholder="0"
							min={"0"}
							type="number"
							value={withdrawValueUSD}
							suffix={
								<>
									<Text type="secondary">{USD.name}</Text>
									&nbsp;
								<Button
										block
										size="small"
										onClick={() => updateWithdraw(totalAvailableInUSD.toString())}
									>
										MAX
								</Button>
								</>}
							onChange={(e) => updateWithdraw(e.target.value)}
							disabled={submitting}
						/>
					</Form.Item>
				</Col>
			</Row>
			<div className="divider-group">
				<Divider />
				<ArrowDownOutlined className="divider-arrow" />
			</div>

			<WithdrawalSelector
				handleSubmit={handleSubmit}
				withdrawValueUSD={withdrawValueUSD === '' ? new BigNumber(0) : new BigNumber(withdrawValueUSD)}
				withdrawDisabled={withdrawDisabled}
				availableCurrencies={[DAI, CRV3, USDT, USDC]}
				withdrawalCurrency={withdrawalCurrency}
				setWithdrawCurrency={setWithdrawCurrency}
				submitting={submitting}
			/>
		</div>
	)
}

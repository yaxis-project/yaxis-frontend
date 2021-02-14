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
import { Currency, USD, Dai, CRV3, USDT, USDC } from '../../../utils/currencies'
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

const { Option } = Select

const { Title, Text } = Typography

interface WithdrawalSelectorProps {
	withdrawValueShares: BigNumber
	withdrawValueUSD: BigNumber
	withdrawDisabled: boolean
	availableCurrencies: Currency[]
}

const WithdrawalSelector = (props: WithdrawalSelectorProps) => {
	const {
		availableCurrencies,
		withdrawValueUSD,
		withdrawValueShares,
		withdrawDisabled,
	} = props
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	const t = (s: string) => phrases[s][language]
	const { onAddTransaction } = useTransactionAdder()
	const { onWithdraw } = useMetaVault()
	const [withdrawalCurrency, setWithdrawCurrency] = useState<
		Currency | undefined
	>(Dai)
	const { currenciesData, metaVaultData } = useMetaVaultData('v1')
	const withdrawTokenAmount = useMemo(() => {
		if (metaVaultData && metaVaultData.mvltPrice) {
			const mvltPrice = new BigNumber(metaVaultData.mvltPrice)
			return withdrawValueUSD.div(mvltPrice)
		}
		return new BigNumber(0)
	}, [withdrawalCurrency, withdrawValueShares])

	const handleSubmit = async () => {
		if (!withdrawalCurrency) {
			notification.error({
				message: `[withdraw] Invalid currency`,
			})
			return
		}
		const sharesAmount = numberToDecimal(withdrawTokenAmount, 18)
		notification.info({
			message: t('Please confirm withdraw transaction.'),
		})
		const selectedCurrency = find(
			currenciesData,
			(c) => c.tokenId === withdrawalCurrency.tokenId,
		)
		try {
			const receipt = await onWithdraw(
				sharesAmount,
				selectedCurrency.address,
			)
			onAddTransaction({
				hash: receipt.transactionHash,
				description: 'Withdraw|$' + withdrawValueUSD,
			} as Transaction)
		} catch (error) {
			notification.info({
				message: t('An error has occured. Please try again.'),
			})
		}
	}

	return (
		<Row className="to-wallet">
			<Col span={8}>
				<Title level={5}>{t('To Wallet')}</Title>
			</Col>
			<Col span={14}>
				<Select
					defaultValue={Dai.name}
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
					value={withdrawTokenAmount.toFixed(2)}
					numberSuffix={` ${withdrawalCurrency.name}`}
					extra={'$' + withdrawValueUSD.toFixed(2)}
				/>
				<br />
				<Button
					className="investing-btn"
					disabled={withdrawDisabled}
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
	} = useMetaVaultData('v1')

	const [withdrawValueUSD, setWithdrawValueUSD] = useState(new BigNumber(0))

	const totalAvailableInUSD = useMemo(
		() => new BigNumber(totalBalance || '0').multipliedBy(mvltPrice || '0'),
		[totalBalance],
	)

	const withdrawValueShares = useMemo(() => withdrawValueUSD.div(mvltPrice), [
		withdrawValueUSD,
		mvltPrice,
	])

	return {
		withdrawValueUSD,
		setWithdrawValueUSD,
		withdrawValueShares,
		totalAvailableInUSD,
		totalBalance,
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
	} = useWithdrawValueHandler()

	const updateWithdraw = (value: string) =>
		setWithdrawValueUSD(
			value == '' ? new BigNumber(0) : new BigNumber(value),
		)

	const withdrawalError = withdrawValueUSD.gt(totalAvailableInUSD)
	const withdrawDisabled =
		withdrawValueUSD.isLessThanOrEqualTo(new BigNumber(0)) ||
		withdrawalError

	return (
		<div className="withdraw-table">
			<Row className="withdraw-from">
				<Col span={8}>
					<Title level={5}>{phrases['From'][language]}</Title>
				</Col>
				<Col span={14}>
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
							type="number"
							suffix={<Text type="secondary">{USD.name}</Text>}
							onChange={(e) => updateWithdraw(e.target.value)}
						/>
					</Form.Item>
				</Col>
			</Row>
			<div className="divider-group">
				<Divider />
				<ArrowDownOutlined className="divider-arrow" />
			</div>

			<WithdrawalSelector
				withdrawValueShares={withdrawValueShares}
				withdrawValueUSD={withdrawValueUSD}
				withdrawDisabled={withdrawDisabled}
				availableCurrencies={[Dai, CRV3, USDT, USDC]}
			/>
		</div>
	)
}

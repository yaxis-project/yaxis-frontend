import React, { useState, useContext, useMemo } from 'react'
import { InvestingDepositCurrencies, Currency } from '../../../utils/currencies'
import DepositAssetRow from './DepositAssetRow'
import useMetaVault from '../../../hooks/useMetaVault'
import useMetaVaultData, { ICurrency } from '../../../hooks/useMetaVaultData'
import { currentConfig } from '../../../yaxis/configs'
import usePriceMap from '../../../hooks/usePriceMap'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { reduce } from 'lodash'
import { Row, Col, Grid, Typography, Button, notification } from 'antd'
import { BigNumber } from 'bignumber.js'
import styled from 'styled-components'
import { getContract } from '../../../utils/erc20'
import { provider } from 'web3-core'
import { callApprove, numberToDecimal } from '../../../yaxis/utils'
import { useWeb3React } from '@web3-react/core'
import useTransactionAdder from '../../../hooks/useTransactionAdder'
import { Transaction } from '../../../contexts/Transactions/types'
import { mapObjIndexed, pipe, values, flatten } from 'ramda'

const { Title, Text } = Typography
const { useBreakpoint } = Grid;


/**
 * Object to store the list of depositing values by currency.
 */
interface CurrencyValues {
	[key: string]: string
}

const initialCurrencyValues: CurrencyValues = reduce(
	InvestingDepositCurrencies,
	(prev, curr) => ({
		...prev,
		[curr.tokenId]: '',
	}),
	{},
)

/**
 * Appends given currencyValue state with given currency and value pair.
 * @param setCurrencyValues Updater for key value object;
 * @param key
 * @param value
 */
const handleFormInputChange = (setCurrencyValues: Function) => (
	key: string,
	value: string,
) => {
	setCurrencyValues((prev: any) => ({
		...prev,
		[key]: value,
	}))
}

/**
 * Iterates over the stored values data to determine if any have an insufficient balance before depositing.
 * @param currencyValues Stored currency values data.
 * @param currenciesData Currency data that stores balance.
 */
const computeInsufficientBalance = (
	currencyValues: CurrencyValues,
	currenciesData: any,
): boolean => {
	const noValue = !Object.values(currencyValues).find(
		(v) => parseFloat(v) > 0,
	)
	const insufficientBalance = !!Object.entries(currencyValues).find(
		([tokenId, v]) => {
			const value = new BigNumber(v || 0)
			const currency = currenciesData.find(
				(c: any) => c.tokenId === tokenId,
			)
			return !!!currency || value.gt(currency.balance || 0)
		},
	)
	return noValue || insufficientBalance
}

/**
 * Computes the total USD value of stored deposit values.
 * @param currencies List of currencies to iterate over.
 * @param currencyValues Stored deposit values.
 * @param priceMap Current prices object.
 */
const computeTotalDepositing = (
	currencies: Currency[],
	currencyValues: CurrencyValues,
	priceMap: any,
) =>
	currencies
		.map(({ tokenId, priceMapKey }) =>
			new BigNumber(currencyValues[tokenId] || 0).times(
				new BigNumber(priceMap[priceMapKey] || 0),
			),
		)
		.reduce((total, current) => total.plus(current), new BigNumber(0))
		.toFormat(2)

const HeaderRow = styled(Row)`
	margin-top: 10px;
`

const StyledCol = styled(Col)`
	@media only screen and (max-width: 400px) {
		padding-left: 16px;
	}
`
/**
 * Creates a deposit table for the savings account.
 */
export default function DepositTable() {
	const { md } = useBreakpoint();

	const currencies = InvestingDepositCurrencies
	const { onDepositAll, isSubmitting } = useMetaVault()
	const { onAddTransaction } = useTransactionAdder()
	const { account, library, chainId } = useWeb3React()

	const priceMap = usePriceMap()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		initialCurrencyValues,
	)

	const { currenciesData, onUpdateAllowances } = useMetaVaultData('v1')

	const disabled = useMemo(
		() => computeInsufficientBalance(currencyValues, currenciesData),
		[currencyValues, currenciesData],
	)

	const [submitting, setSubmitting] = useState(false)

	/**
	 * Memoized list of currencies that need approval.
	 */
	const currenciesNeededApproval = useMemo(
		(): ICurrency[] =>
			pipe(
				mapObjIndexed((v: string, symbol: string) => {
					const currency = currenciesData.find(
						(c) => c.tokenId === symbol,
					)
					if (!currency) return []
					const value = new BigNumber(v || 0)
					if (
						value &&
						!value.isNaN() &&
						value.gt(0) &&
						currency &&
						value.gte(currency.allowance) &&
						value.lte(currency.balance)
					) {
						return [currency]
					}
					return []
				}),
				values,
				flatten,
			)(currencyValues),
		[currencyValues, currenciesData],
	)

	/**
	 * Generates approval transactions for current list of currencies that need approval.
	 */
	const handleApprove = async () => {
		setSubmitting(true)
		const approvalCalls: Promise<any>[] = currenciesNeededApproval.map(
			(currency) =>
				callApprove(
					getContract(library as provider, currency.address),
					currentConfig(chainId).contractAddresses.yAxisMetaVault,
					account,
				)
		)
		notification.info({
			message: `Please approve ${approvalCalls.length} tokens for deposit.`,
		})
		await Promise.all(approvalCalls)
		onUpdateAllowances()
		setSubmitting(false)
	}

	const totalDepositing = useMemo(
		() => computeTotalDepositing(currencies, currencyValues, priceMap),
		[currencyValues, priceMap, currencies],
	)

	const handleSubmit = async () => {
		const amounts = currencies.map((c) => {
			const _v = currencyValues[c.tokenId]
			if (_v) {
				return numberToDecimal(_v, c.decimals)
			}
			return '0'
		})
		try {
			currenciesNeededApproval.length && await handleApprove()
			const receipt = await onDepositAll(amounts)
			setCurrencyValues(initialCurrencyValues)
			onAddTransaction({
				hash: receipt.transactionHash,
				description: 'Deposit|$' + totalDepositing,
			} as Transaction)
		} catch (e) {
			notification.info({
				message: `Error while depositing:`,
				description: e.message
			})
			setSubmitting(false)
		}
	}

	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	return (
		<div className="deposit-table">
			<HeaderRow className="deposit-asset-header-row">
				<Col xs={6} sm={6} md={5}>
					<Text type="secondary">{phrases['Asset'][language]}</Text>
				</Col>
				<Col xs={8} sm={8} md={7}>
					<Text type="secondary">{phrases['Wallet Balance'][language]}</Text>
				</Col>
				<StyledCol xs={10} sm={10} md={12}>
					<Text type="secondary">{phrases['Amount'][language]}</Text>
				</StyledCol>
			</HeaderRow>
			{currencies.map((currency) =>
			(
				<DepositAssetRow
					key={currency.name}
					currency={currency}
					onChange={handleFormInputChange(setCurrencyValues)}
					value={currencyValues[currency.tokenId]}
					disabled={isSubmitting || submitting}
				/>
			)
			)}
			<Row className="total" style={md ? {} : { padding: "0 10%" }}>
				<Col offset={md ? 12 : 0} xs={24} sm={24} md={11}>
					<Text type="secondary">{phrases['Total'][language]}</Text>
					<Title level={3}>${totalDepositing}</Title>
					<Button
						className="investing-btn"
						disabled={disabled}
						loading={isSubmitting || submitting}
						onClick={handleSubmit}
						block
						type="primary"
					>
						{currenciesNeededApproval &&
							currenciesNeededApproval.length > 0
							? phrases['Approve'][language]
							: phrases['Deposit'][language]}
					</Button>
					<Text
						type="secondary"
						style={{ marginTop: '10px', display: 'block' }}
					>
						{phrases['Withdraw Fee'][language]}: 0.1%
					</Text>
				</Col>
			</Row>
		</div>
	)
}

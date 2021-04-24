import { Currency } from '../../../utils/currencies'
import { BigNumber } from 'bignumber.js'

/**
 * Object to store the list of depositing values by currency.
 */
export interface CurrencyValues {
	[key: string]: string
}

/**
 * Appends given currencyValue state with given currency and value pair.
 * @param setCurrencyValues Updater for key value object;
 * @param key
 * @param value
 */
export const handleFormInputChange = (setCurrencyValues: Function) => (
	key: string,
	value: string,
) => {
	!isNaN(Number(value)) &&
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
export const computeInsufficientBalance = (
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
export const computeTotalDepositing = (
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

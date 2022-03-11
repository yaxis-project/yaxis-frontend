import {
	Currency,
	CurrencyContract,
	CurrencyValue,
} from '../../../constants/currencies'
import { BigNumber } from 'bignumber.js'
import { TPrices } from '../../../state/prices/reducer'

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
export const handleFormInputChange =
	(setCurrencyValues: React.Dispatch<React.SetStateAction<CurrencyValues>>) =>
	(key: string, value: string | number) => {
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
	currenciesData: { [tokenId: string]: CurrencyValue | undefined },
): boolean => {
	const noValue = !Object.values(currencyValues).find(
		(v) => parseFloat(v) > 0,
	)
	const insufficientBalance = !!Object.entries(currencyValues).find(
		([tokenId, v]) => {
			const value = new BigNumber(v || 0)
			const currency = currenciesData[tokenId]
			return !currency || value.gt(currency?.amount || 0)
		},
	)
	return noValue || insufficientBalance
}

/**
 * Computes the total USD value of stored deposit values.
 * @param vaults List of vaults to iterate over.
 * @param currencyValues Stored deposit values.
 * @param priceMap Current prices object.
 */
export const computeTotalDepositingCurrency = (
	currencies: Currency[],
	currencyValues: CurrencyValues,
	priceMap: TPrices,
) =>
	currencies
		.map(({ tokenId, priceMapKey }) => {
			const inputValue = currencyValues[tokenId]
			const inputNumber = Number(inputValue)
			return new BigNumber(isNaN(inputNumber) ? 0 : inputNumber).times(
				new BigNumber(priceMap[priceMapKey] || 0),
			)
		})
		.reduce((total, current) => total.plus(current), new BigNumber(0))
		.toFormat(2)

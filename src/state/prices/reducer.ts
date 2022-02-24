import { createReducer } from '@reduxjs/toolkit'
import { updatePrices } from './actions'
import {
	Ticker as TickerE,
	CurrenciesERC20 as CurrenciesERC20E,
	CurrenciesERC677 as CurrenciesERC677E,
	additionalCurrencies as additionalCurrenciesE,
	crvLPCurrencies as crvLPCurrenciesE,
} from '../../constants/type/ethereum'
import {
	Ticker as TickerA,
	CurrenciesERC20 as CurrenciesERC20A,
	CurrenciesERC677 as CurrenciesERC677A,
	additionalCurrencies as additionalCurrenciesA,
	crvLPCurrencies as crvLPCurrenciesA,
} from '../../constants/type/avalanche'

const currentTimestamp = () => new Date().getTime()

export type TPrices = {
	[key in TickerE]: number
} & {
	[key in TickerA]: number
}
export interface PriceState {
	prices: TPrices
	timestamp: number
}

export const initialState: PriceState = {
	prices: Object.fromEntries([
		...CurrenciesERC20E.map((c) => [c, 0]),
		...CurrenciesERC677E.map((c) => [c, 0]),
		...additionalCurrenciesE.map((c) => [c, 0]),
		...crvLPCurrenciesE.map((c) => [c, 0]),
		...CurrenciesERC20A.map((c) => [c, 0]),
		...CurrenciesERC677A.map((c) => [c, 0]),
		...additionalCurrenciesA.map((c) => [c, 0]),
		...crvLPCurrenciesA.map((c) => [c, 0]),
	]) as TPrices,
	timestamp: currentTimestamp(),
}

export default createReducer(initialState, (builder) =>
	builder.addCase(updatePrices, (state, action) => {
		state.prices = {
			...state.prices,
			...action.payload.prices,
		}
		state.timestamp = currentTimestamp()
	}),
)

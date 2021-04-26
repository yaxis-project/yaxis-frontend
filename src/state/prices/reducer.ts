import { createReducer } from '@reduxjs/toolkit'
import { updatePrices } from './actions'
import {
	Ticker,
	CurrenciesERC20,
	CurrenciesERC677,
	additionalCurrencies,
} from '../../constants/type'

const currentTimestamp = () => new Date().getTime()

export type TPrices = {
	[key in Ticker]: number
}
export interface PriceState {
	prices: TPrices
	timestamp: number
}

export const initialState: PriceState = {
	prices: Object.fromEntries([
		...CurrenciesERC20.map((c) => [c, 0]),
		...CurrenciesERC677.map((c) => [c, 0]),
		...additionalCurrencies.map((c) => [c, 0]),
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

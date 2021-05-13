import { createReducer } from '@reduxjs/toolkit'
import {
	updateMatchesDarkMode,
	updateUserDarkMode,
	updateFutureBalanceCalc,
} from './actions'

const currentTimestamp = () => new Date().getTime()

export type CalcPages = 'metavault' | 'staking' | 'lp'
export interface FutureBalanceCalculator {
	duration: number
	yearlyCompounds: number
}
export interface UserState {
	userDarkMode: boolean | null // the user's choice for dark mode or light mode
	matchesDarkMode: boolean // whether the dark mode media query matches
	futureBalancesCalcs: {
		[key in CalcPages]: FutureBalanceCalculator
	}
	timestamp: number
}

export const initialState: UserState = {
	userDarkMode: null,
	matchesDarkMode: false,
	futureBalancesCalcs: {
		metavault: {
			duration: 12,
			yearlyCompounds: 365,
		},
		staking: {
			duration: 12,
			yearlyCompounds: 365,
		},
		lp: {
			duration: 12,
			yearlyCompounds: 12,
		},
	},
	timestamp: currentTimestamp(),
}

export default createReducer(initialState, (builder) =>
	builder
		.addCase(updateUserDarkMode, (state, action) => {
			state.userDarkMode = action.payload.userDarkMode
			state.timestamp = currentTimestamp()
		})
		.addCase(updateMatchesDarkMode, (state, action) => {
			state.matchesDarkMode = action.payload.matchesDarkMode
			state.timestamp = currentTimestamp()
		})
		.addCase(
			updateFutureBalanceCalc,
			(state, { payload: { page, field, value } }) => {
				state.futureBalancesCalcs[page][field] = value
			},
		),
)

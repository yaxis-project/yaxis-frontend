import { createReducer } from '@reduxjs/toolkit'
import {
	updateMatchesDarkMode,
	updateUserDarkMode,
	updateFutureBalanceCalc,
	updateLanguage,
	updateVaultAutoStake,
	updateChain,
} from './actions'
import { TLanguages } from '../../constants/translations'
import { ChainId } from '../../constants/chains'

const currentTimestamp = () => new Date().getTime()

export type CalcPages = 'metavault' | 'staking' | 'lp'
export interface FutureBalanceCalculator {
	duration: number
	yearlyCompounds: number
}
export interface UserState {
	chainId: ChainId
	vaultAutoStake: boolean
	language: TLanguages
	userDarkMode: boolean | null // the user's choice for dark mode or light mode
	matchesDarkMode: boolean // whether the dark mode media query matches
	futureBalancesCalcs: {
		[key in CalcPages]: FutureBalanceCalculator
	}
	timestamp: number
}

// const browserLanguage = navigator.language?.split('-')?.[0]?.toUpperCase()

export const initialState: UserState = {
	chainId: 1,
	vaultAutoStake: true,
	language: 'EN',
	// TODO: enable language support
	// Languages.find(
	// 	(supportedLanguage) => supportedLanguage === browserLanguage,
	// ) || 'EN',
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
		.addCase(updateChain, (state, action) => {
			state.chainId = action.payload.chainId
			state.timestamp = currentTimestamp()
		})
		.addCase(updateVaultAutoStake, (state, action) => {
			state.vaultAutoStake = action.payload.vaultAutoStake
			state.timestamp = currentTimestamp()
		})
		.addCase(updateLanguage, (state, action) => {
			state.language = action.payload.language
			state.timestamp = currentTimestamp()
		})
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

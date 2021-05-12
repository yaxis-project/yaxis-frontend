import { createAction } from '@reduxjs/toolkit'
import { CalcPages, FutureBalanceCalculator } from './reducer'

export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>(
	'user/updateMatchesDarkMode',
)
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>(
	'user/updateUserDarkMode',
)
export const toggleURLWarning = createAction<void>('app/toggleURLWarning')

export const updateFutureBalanceCalc = createAction<{
	page: CalcPages
	field: keyof FutureBalanceCalculator
	value: number
}>('user/updateFutureBalanceCalc')

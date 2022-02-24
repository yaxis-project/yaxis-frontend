import { createAction } from '@reduxjs/toolkit'
import { CalcPages, FutureBalanceCalculator } from './reducer'
import { TLanguages } from '../../constants/translations'
import { ChainId } from '../../constants/chains'

export const updateChain =
	createAction<{ chainId: ChainId }>('user/updateChain')
export const updateLanguage = createAction<{ language: TLanguages }>(
	'user/updateLanguage',
)
export const updateVaultAutoStake = createAction<{ vaultAutoStake: boolean }>(
	'user/updateVaultAutoStake',
)
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

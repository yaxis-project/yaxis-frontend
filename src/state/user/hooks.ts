import { useCallback } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updateUserDarkMode, updateFutureBalanceCalc } from './actions'
import { CalcPages, FutureBalanceCalculator } from './reducer'

export function useIsDarkMode(): boolean {
	const { userDarkMode, matchesDarkMode } = useSelector<
		AppState,
		{ userDarkMode: boolean | null; matchesDarkMode: boolean }
	>(
		({ user: { matchesDarkMode, userDarkMode } }) => ({
			userDarkMode,
			matchesDarkMode,
		}),
		shallowEqual,
	)

	return userDarkMode === null ? matchesDarkMode : userDarkMode
}

export function useDarkModeManager(): [boolean, () => void] {
	const dispatch = useDispatch<AppDispatch>()
	const darkMode = useIsDarkMode()

	const toggleSetDarkMode = useCallback(() => {
		dispatch(updateUserDarkMode({ userDarkMode: !darkMode }))
	}, [darkMode, dispatch])

	return [darkMode, toggleSetDarkMode]
}

export function useFutureBalanceCalc(page: CalcPages): FutureBalanceCalculator {
	return useSelector((state: AppState) => {
		return state.user.futureBalancesCalcs[page]
	})
}

export function useFutureBalanceCalcUpdate(page: CalcPages) {
	const dispatch = useDispatch<AppDispatch>()
	return useCallback(
		({
			field,
			value,
		}: {
			field: keyof FutureBalanceCalculator
			value: number
		}) => dispatch(updateFutureBalanceCalc({ page, field, value })),
		[dispatch, page],
	)
}

import { useCallback, useMemo } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import {
	updateLanguage,
	updateUserDarkMode,
	updateFutureBalanceCalc,
	updateVaultAutoStake,
	updateChain,
} from './actions'
import { TLanguages } from '../../constants/translations'
import {
	ChainId,
	CHAIN_INFO,
	L1ChainInfo,
	L2ChainInfo,
} from '../../constants/chains'
import { CalcPages, FutureBalanceCalculator } from './reducer'

export function useVaultAutoStake(): boolean {
	return useSelector((state: AppState) => state.user.vaultAutoStake)
}

export function useSetVaultAutoStake() {
	const dispatch = useDispatch<AppDispatch>()

	return useCallback(
		(vaultAutoStake: boolean) => {
			dispatch(updateVaultAutoStake({ vaultAutoStake }))
		},
		[dispatch],
	)
}

export function useLanguage(): string {
	return useSelector((state: AppState) => state.user.language)
}

export function useSetLanguage() {
	const dispatch = useDispatch<AppDispatch>()

	return useCallback(
		(language: TLanguages) => {
			dispatch(updateLanguage({ language }))
		},
		[dispatch],
	)
}

export function useChain(): ChainId {
	return useSelector((state: AppState) => state.user.chainId)
}

export function useChainInfo(): L1ChainInfo | L2ChainInfo {
	const chainId = useChain()
	return useMemo(() => CHAIN_INFO[chainId], [chainId])
}

export function useSetChain() {
	const dispatch = useDispatch<AppDispatch>()

	return useCallback(
		(chainId: ChainId) => {
			dispatch(updateChain({ chainId }))
		},
		[dispatch],
	)
}

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

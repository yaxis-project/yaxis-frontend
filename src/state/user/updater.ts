import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../index'
import { updateMatchesDarkMode, updateChain } from './actions'
import { useWeb3React } from '@web3-react/core'
import { ALL_SUPPORTED_CHAIN_IDS } from '../../constants/chains'

export default function Updater(): null {
	const dispatch = useDispatch<AppDispatch>()

	// keep dark mode in sync with the system
	useEffect(() => {
		const darkHandler = (match: MediaQueryListEvent) => {
			dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))
		}

		const match = window?.matchMedia('(prefers-color-scheme: dark)')
		dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))

		if (match?.addListener) {
			match?.addListener(darkHandler)
		} else if (match?.addEventListener) {
			match?.addEventListener('change', darkHandler)
		}

		return () => {
			if (match?.removeListener) {
				match?.removeListener(darkHandler)
			} else if (match?.removeEventListener) {
				match?.removeEventListener('change', darkHandler)
			}
		}
	}, [dispatch])

	const { chainId } = useWeb3React()

	useEffect(() => {
		if (ALL_SUPPORTED_CHAIN_IDS.includes(chainId))
			dispatch(updateChain({ chainId }))
		else {
			// Kovan switches to mainnet fallback
			if (chainId === 42) dispatch(updateChain({ chainId: 1 }))
		}
	}, [dispatch, chainId])

	return null
}

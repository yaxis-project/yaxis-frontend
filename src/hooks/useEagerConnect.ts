import { useState, useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import {
	networkConnectorFactory,
	injected,
	SUPPORTED_WALLETS,
} from '../connectors'
import { getEagerProvider } from '../connectors/utils'
import { useChain } from '../state/user/hooks'

export function useEagerConnect() {
	const { activate, active } = useWeb3React()
	const { activate: activateFallback } = useWeb3React('fallback')
	const [tried, setTried] = useState(false)
	const chainId = useChain()

	const eagerProvider = useMemo(() => {
		const previous = getEagerProvider()
		const provider = SUPPORTED_WALLETS[previous]
		if (provider && provider.connector) return provider.connector
		return injected
	}, [])

	useEffect(() => {
		activate(eagerProvider, undefined, true).catch(() => {
			const networkConnector = networkConnectorFactory(chainId)
			activateFallback(networkConnector)
			setTried(true)
		})
	}, [activate, activateFallback, eagerProvider]) // intentionally only running on mount (make sure it's only mounted once :))

	// if the connection worked, wait until we get confirmation of that to flip the flag
	useEffect(() => {
		if (active) {
			setTried(true)
		}
	}, [active])

	return tried
}

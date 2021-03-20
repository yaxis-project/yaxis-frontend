import { useState, useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected, SUPPORTED_WALLETS } from '../connectors'
import { getEagerProvider } from '../connectors/utils'
import { isMobile } from 'react-device-detect'

export function useEagerConnect() {
	const { activate, active } = useWeb3React()
	const [tried, setTried] = useState(false)

	const eagerProvider = useMemo(() => {
		const previous = getEagerProvider()
		const provider = SUPPORTED_WALLETS[previous]
		if (provider && provider.connector) return provider.connector
		return injected
	}, [])

	useEffect(() => {
		// const p = eagerProvider.getProvider()
		// injected.isAuthorized().then((isAuthorized) => {
		// 	if (isAuthorized) {
		activate(eagerProvider, undefined, true).catch(() => {
			setTried(true)
		})
		// 	} else {
		// 		if (isMobile && (window as any).ethereum) {

		// 		} else {
		// 			setTried(true)
		// 		}
		// 	}
		// })
	}, [activate, eagerProvider]) // intentionally only running on mount (make sure it's only mounted once :))

	// if the connection worked, wait until we get confirmation of that to flip the flag
	useEffect(() => {
		if (active) {
			setTried(true)
		}
	}, [active])

	return tried
}

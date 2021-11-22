import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'

function useWeb3Provider() {
	const { account, ...mainProviderRest } = useWeb3React()
	const fallbackProvider = useWeb3React('fallback')

	const provider = useMemo(() => {
		if (account) return { account, ...mainProviderRest }
		return { ...fallbackProvider, error: mainProviderRest.error }
	}, [account, mainProviderRest, fallbackProvider])

	return provider
}

export default useWeb3Provider

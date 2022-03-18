import React, { createContext, useEffect, useState } from 'react'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { Contracts, initializeContracts } from '../../constants/contracts'
import { ALL_SUPPORTED_CHAIN_IDS, ChainId } from '../../constants/chains'
import { useSetChain } from '../../state/user'

export interface ContractContext {
	contracts?: Contracts
	loading: boolean
}

export const Context = createContext<ContractContext>({
	contracts: null,
	loading: true,
})

const ContractProvider = ({ children }) => {
	const { account, library, chainId } = useWeb3Provider()
	const [contracts, setContracts] = useState<Contracts>()
	const [loading, setLoading] = useState(true)
	const setChain = useSetChain()

	useEffect(() => {
		setLoading(true)

		if (library) {
			const contracts = initializeContracts(library, chainId as ChainId)
			setContracts(contracts)
			setLoading(false)
		}

		if (ALL_SUPPORTED_CHAIN_IDS.includes(chainId))
			setChain(chainId as ChainId)
		else {
			// Kovan switches to mainnet fallback
			if (chainId === 42) setChain(1)
		}
	}, [library, account, chainId])

	return (
		<Context.Provider value={{ contracts, loading }}>
			{children}
		</Context.Provider>
	)
}

export default ContractProvider

export function useContracts() {
	const context = React.useContext(Context)
	if (context === null) {
		throw new Error('useContracts must be used within a ContractsProvider')
	}
	return context
}

import React, { createContext, useEffect, useState } from 'react'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { Contracts } from '../../constants/contracts'

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

	useEffect(() => {
		if (library) {
			setContracts(new Contracts(library, 'ethereum', chainId))
			setLoading(false)
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

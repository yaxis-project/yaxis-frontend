import React, { createContext, useEffect, useState } from 'react'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { Contracts } from '../../constants/contracts'

export interface ContractContext {
	contracts?: Contracts
}

export const Context = createContext<ContractContext>({
	contracts: null,
})

const ContractProvider = ({ children }) => {
	const { account, library, chainId } = useWeb3Provider()
	const [contracts, setContracts] = useState<Contracts>()
	useEffect(() => {
		if (library) {
			setContracts(new Contracts(library, chainId))
		}
	}, [library, account, chainId])

	return <Context.Provider value={{ contracts }}>{children}</Context.Provider>
}

export default ContractProvider

export function useContracts() {
	const context = React.useContext(Context)
	if (context === null) {
		throw new Error('useContracts must be used within a ContractsProvider')
	}
	return context
}

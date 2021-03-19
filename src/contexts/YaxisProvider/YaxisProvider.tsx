import React, { createContext, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Yaxis } from '../../yaxis/Yaxis'
import moment, { Moment } from 'moment'

export interface YaxisContext {
	yaxis?: Yaxis
	block: number
	lastUpdated: Moment
}

export const Context = createContext<YaxisContext>({
	yaxis: undefined,
	block: 0,
	lastUpdated: moment(),
})

const YaxisProvider: React.FC = ({ children }) => {
	const { account, library, chainId } = useWeb3React()
	const [yaxis, setYaxis] = useState<any>()
	const [block, setBlock] = useState(0)
	const [lastUpdated, setLastUpdated] = useState<Moment>(moment())

	useEffect(() => {
		if (!library) return
		const fetchBlockNumber = async function () {
			const latestBlockNumber = await library.eth.getBlockNumber()
			if (block !== latestBlockNumber) {
				setLastUpdated(moment())
				setBlock(latestBlockNumber)
			}
		}
		fetchBlockNumber()
		const interval = setInterval(async () => {
			await fetchBlockNumber()
		}, 5000)

		return () => clearInterval(interval)
	}, [library, block])

	useEffect(() => {
		if (library) {
			const yaxisLib = new Yaxis(library, chainId, {
				defaultAccount: account,
				defaultConfirmations: 1,
				autoGasMultiplier: 1.5,
				accounts: [],
				libraryNodeTimeout: 10000,
			})
			setYaxis(yaxisLib)
		}
		console.log(3)
	}, [library, account, chainId])

	return (
		<Context.Provider value={{ yaxis, block, lastUpdated }}>
			{children}
		</Context.Provider>
	)
}

export default YaxisProvider

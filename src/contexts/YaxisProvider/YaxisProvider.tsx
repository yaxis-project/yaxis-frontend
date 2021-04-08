import React, { createContext, useEffect, useState, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Yaxis } from '../../yaxis/Yaxis'
import moment, { Moment } from 'moment'
import BN from 'bignumber.js'

export interface YaxisContext {
	yaxis?: Yaxis
	block: number
	lastUpdated: Moment
	balance: BN
}

export const Context = createContext<YaxisContext>({
	yaxis: undefined,
	block: 0,
	lastUpdated: moment(),
	balance: new BN(0),
})

const YaxisProvider: React.FC = ({ children }) => {
	const { account: acc1, library: lib1, chainId: chainId1 } = useWeb3React()
	const { library: lib2, chainId: chainId2 } = useWeb3React('fallback')
	const [account, library, chainId] = useMemo(() => {
		if (acc1) return [acc1, lib1, chainId1]
		return [null, lib2, chainId2]
	}, [acc1, lib1, chainId1, lib2, chainId2])

	const [yaxis, setYaxis] = useState<any>()
	const [block, setBlock] = useState(0)
	const [balance, setBalance] = useState(new BN(0))
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
		}, 5 * 1000)

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
	}, [library, account, chainId])

	useEffect(() => {
		if (!library?.eth?.getBalance || !account) return
		const getEthereumBalance = async function () {
			const latestBalance = await library.eth.getBalance(account)
			const toBN = new BN(latestBalance)
			setBalance(toBN)
		}
		getEthereumBalance()
	}, [account, library, block])

	return (
		<Context.Provider value={{ yaxis, block, lastUpdated, balance }}>
			{children}
		</Context.Provider>
	)
}

export default YaxisProvider

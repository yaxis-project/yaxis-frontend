import React, { createContext, useEffect, useState } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWallet } from 'use-wallet'
import { Yaxis } from '../../yaxis/Yaxis'
import Web3 from 'web3'
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

declare global {
	interface Window {
		yaxissauce: any
	}
}

const YaxisProvider: React.FC = ({ children }) => {
	const { ethereum, connect }: { ethereum: any; connect: any } = useWallet()
	const [yaxis, setYaxis] = useState<any>()

	// @ts-ignore
	window.yaxis = yaxis
	// @ts-ignore
	window.eth = ethereum
	const [block, setBlock] = useState(0)
	const [lastUpdated, setLastUpdated] = useState<Moment>(moment())

	useEffect(() => {
		if (!ethereum) return
		const fetchBlockNumber = async function () {
			const latestBlockNumber = await web3.eth.getBlockNumber()
			if (block !== latestBlockNumber) {
				setLastUpdated(moment())
				setBlock(latestBlockNumber)
			}
		}
		const web3 = new Web3(ethereum)

		fetchBlockNumber()
		const interval = setInterval(async () => {
			await fetchBlockNumber()
		}, 5000)

		return () => clearInterval(interval)
	}, [ethereum, block])

	useEffect(() => {
		if (ethereum) {
			const chainId = Number(ethereum.chainId)
			const yaxisLib = new Yaxis(ethereum, chainId, {
				defaultAccount: ethereum.selectedAddress,
				defaultConfirmations: 1,
				autoGasMultiplier: 1.5,
				accounts: [],
				ethereumNodeTimeout: 10000,
			})
			setYaxis(yaxisLib)
			window.yaxissauce = yaxisLib
		} else {
			const injected = new InjectedConnector({})
			injected.isAuthorized().then((isAuthorized) => {
				if (isAuthorized) {
					let isSignOut = localStorage.getItem('signOut')
					if (!isSignOut) {
						connect('injected')
					}
				}
			})
		}
	}, [ethereum, connect])

	return (
		<Context.Provider value={{ yaxis, block, lastUpdated }}>
			{children}
		</Context.Provider>
	)
}

export default YaxisProvider

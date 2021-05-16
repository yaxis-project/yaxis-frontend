import { useCallback, useMemo, useState, useEffect } from 'react'
import { notification } from 'antd'
import { useContracts } from '../contexts/Contracts'
import useWeb3Provider from './useWeb3Provider'
import { Contract } from '@ethersproject/contracts'
import objectPath from 'object-path'
import {
	useTransactionAdder,
	useHasPendingTransaction,
} from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils/number'
import { LoadingOutlined } from '@ant-design/icons'
import { NETWORK_NAMES } from '../connectors'
import { etherscanUrl } from '../utils'

interface Params {
	contractName: string
	method: string
	description: string
}

interface CallOptions {
	amount?: string
	cb?: Function
	args?: any[]
	descriptionExtra?: string
}

const clickableStyle = { cursor: 'pointer' }

const useContractWrite = ({ contractName, method, description }: Params) => {
	const [key, setKey] = useState(null)
	const [data, setData] = useState(null)
	// const [accountOnCall, setAccountOnCall] = useState(null)
	// const [networkOnCall, setNetworkOnCall] = useState(null)
	const loading = useHasPendingTransaction(contractName, method)

	const { account, library, chainId } = useWeb3Provider()
	const { contracts } = useContracts()

	const networkName = useMemo(() => NETWORK_NAMES[chainId] || '', [chainId])

	const contract = useMemo(() => {
		if (contracts) {
			const c = objectPath.get(contracts, contractName) as Contract
			if (!c)
				console.error(`Unable to initialize contract: ${contractName}`)
			return c
		}
		return null
	}, [contracts, contractName])

	const addTransaction = useTransactionAdder()

	useEffect(() => notification.close(key), [account, chainId, key])

	const call = useCallback(
		async ({ args, amount, cb, descriptionExtra }: CallOptions = {}) => {
			const key = `${contractName}-${method}-${new Date().getTime()}`
			setKey(key)
			// setAccountOnCall(account)
			// setNetworkOnCall(chainId)
			let receipt
			try {
				if (!library || !account) return
				if (!contract) throw new Error('Contract not loaded')
				const c = contract.connect(
					library.getSigner(account).connectUnchecked(),
				)
				const gasCost = await c.estimateGas[method](...(args || []), {})
				const config: any = {
					gasLimit: calculateGasMargin(gasCost),
				}
				if (amount) config.value = amount
				const m = c[method]

				notification.info({
					key,
					message: `Please confirm ${description}.`,
					duration: null,
				})
				receipt = await m(...(args || []), config)
				addTransaction(receipt, {
					method,
					summary: description,
					contract: contractName,
					amount: descriptionExtra,
				})
				notification.close(key)
				notification.info({
					key,
					message: `Pending ${description}.`,
					description: 'Click to see on Etherscan',
					duration: null,
					style: clickableStyle,
					icon: <LoadingOutlined />,
					onClick: () =>
						window.open(
							etherscanUrl(`/tx/${receipt?.hash}`, networkName),
							'_blank',
						),
				})
			} catch (e) {
				console.error(e)
				notification.close(key)
				notification.error({
					message: `Error: Unable to ${description}:`,
					description: e.message,
				})
				// setAccountOnCall(null)
				return false
			}
			try {
				await receipt.wait()
				notification.close(key)
				if (cb) cb()
				setData(receipt)
				// setAccountOnCall(null)
				return receipt
			} catch (e) {
				console.error(e)
				notification.close(key)
				notification.error({
					message: `Internal Error: Unable to ${description}:`,
					description: e.message,
				})
				// setAccountOnCall(null)
				return false
			}
		},
		[
			account,
			// accountOnCall,
			library,
			contract,
			description,
			method,
			contractName,
			addTransaction,
			networkName,
			// networkOnCall,
		],
	)

	return { loading, data, call }
}

export default useContractWrite

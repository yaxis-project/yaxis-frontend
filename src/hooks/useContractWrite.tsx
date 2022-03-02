import { useCallback, useMemo, useState, useEffect } from 'react'
import { notification } from 'antd'
import { useContracts } from '../contexts/Contracts'
import useWeb3Provider from './useWeb3Provider'
import { Contract, CallOverrides } from '@ethersproject/contracts'
import objectPath from 'object-path'
import {
	useTransactionAdder,
	useHasPendingTransaction,
} from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils/number'
import { LoadingOutlined } from '@ant-design/icons'
import { NETWORK_NAMES } from '../connectors'
import { useExplorerUrl } from '../utils'

interface Params {
	contractName: string
	method: string
	description: string
}

interface CallOptions {
	amount?: string
	cb?: (...args) => unknown
	args?: any[]
	descriptionExtra?: string
}

const clickableStyle = { cursor: 'pointer' }

const useContractWrite = ({ contractName, method, description }: Params) => {
	const [key, setKey] = useState(null)
	const [data, setData] = useState(null)
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

	const explorerUrl = useExplorerUrl(`/tx/`)

	useEffect(() => notification.close(key), [account, chainId, key])

	const call = useCallback(
		async ({ args, amount, cb, descriptionExtra }: CallOptions = {}) => {
			const key = `${contractName}-${method}-${new Date().getTime()}`
			setKey(key)
			let receipt
			try {
				if (!library || !account) return
				if (!contract) throw new Error('Contract not loaded')
				const c = contract.connect(
					library.getSigner(account).connectUnchecked(),
				)

				const config: CallOverrides = {
					gasLimit: 1_000_000,
				}
				if (amount) config.value = amount

				const mEstimate = await c.estimateGas[method]
				if (!mEstimate)
					throw new Error(`${method} not found on ${contractName}`)
				const gasCost = await mEstimate(...(args || []), config)
				config.gasLimit = calculateGasMargin(gasCost)

				await c.callStatic[method](...(args || []), config)

				const m = c[method]
				if (!m)
					throw new Error(`${method} not found on ${contractName}`)

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
						window.open(explorerUrl + `${receipt?.hash}`, '_blank'),
				})
			} catch (error) {
				console.error(error)
				notification.close(key)
				notification.error({
					message: `Error: Unable to ${description}:`,
					description: (error as any)?.message,
				})
				return false
			}
			try {
				await receipt.wait()
				notification.close(key)
				if (cb) cb()
				setData(receipt)
				return receipt
			} catch (error) {
				console.error(error)
				notification.close(key)
				notification.error({
					message: `Internal Error: Unable to ${description}:`,
					description: (error as Error)?.message,
				})
				return false
			}
		},
		[
			account,
			library,
			contract,
			description,
			method,
			contractName,
			addTransaction,
			networkName,
		],
	)

	return { loading, data, call }
}

export default useContractWrite

import { useCallback, useMemo, useState } from 'react'
import { notification } from 'antd'
import useGlobal from './useGlobal'
import useWeb3Provider from './useWeb3Provider'
import { Contract } from 'web3-eth-contract'
import objectPath from 'object-path'

interface Params {
	contractName: string
	method: string
	description: string
}

interface CallOptions {
	amount?: any
	cb?: Function
	args?: any[]
}

const useContractWrite = ({ contractName, method, description }: Params) => {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(false)

	const { account } = useWeb3Provider()
	const { yaxis } = useGlobal()
	const contract = useMemo(() => {
		const c = objectPath.get(yaxis?.contracts, contractName) as Contract
		if (!c) console.log(`Unable to initialize contract: ${contractName}`)
		return c
	}, [yaxis, contractName])

	const call = useCallback(
		async ({ args, amount, cb }: CallOptions = {}) => {
			try {
				setLoading(true)
				notification.info({
					message: `Please confirm ${description}.`,
				})
				const m = contract.methods[method]
				const withArgs = args ? m(...args) : m()
				const config: any = { from: account }
				if (amount) config.amount = amount
				const response = await withArgs
					.send(config)
					.on('transactionHash', (tx: any) => {
						console.log(tx)
						return tx.transactionHash
					})
				if (cb) cb()
				setData(response)
				setLoading(false)
				return true
			} catch (e) {
				console.error(e)
				notification.error({
					description: e.message,
					message: `Unable to ${description}:`,
				})
				setLoading(false)
				return false
			}
		},
		[account, contract, description, method],
	)

	return { loading, data, call }
}

export default useContractWrite

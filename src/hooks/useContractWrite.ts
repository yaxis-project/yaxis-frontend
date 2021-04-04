import {
	useCallback,
	useMemo,
	useState,
} from 'react'
import { notification } from 'antd'
import useYaxis from './useYaxis'
import { useWeb3React } from '@web3-react/core'
import { Contracts } from "../yaxis/contracts"
import { Contract } from 'web3-eth-contract'

interface Params {
	contractName: keyof Contracts
	method: string;
	description: string
	args?: any[]
}

const useContractWrite = ({ contractName, method, description, args }: Params) => {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)

	const { account } = useWeb3React()
	const yaxis = useYaxis()
	const contract = useMemo(
		() => {
			const c = yaxis && yaxis.contracts && yaxis.contracts[contractName] as Contract
			if (!c) console.log(`Unable to initialize contract: ${contractName}`)
			return c
		},
		[yaxis, contractName],
	)

	const call = useCallback(async () => {
		try {
			setLoading(true)
			notification.info({
				message: `Please approve ${description}.`,
			})
			const m = await contract.methods[method]
			const withArgs = args ? m(args) : m()
			const response = withArgs.send({ from: account })
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
	}, [account, contract, args, description, method])

	return { loading, data, call }
}

export default useContractWrite

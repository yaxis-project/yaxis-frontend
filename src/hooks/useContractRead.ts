import { useEffect, useMemo, useState } from 'react'
import useGlobal from './useGlobal'
import { Contract } from 'web3-eth-contract'
import objectPath from 'object-path'

interface Params {
	contractName: string
	method: string
	args?: any[]
}

const useContractRead = ({ contractName, method, args }: Params) => {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(true)

	const { yaxis, block } = useGlobal()

	const contract = useMemo(() => {
		const c = objectPath.get(yaxis?.contracts, contractName) as Contract
		if (!c) console.log(`Unable to initialize contract: ${contractName}`)
		return c
	}, [yaxis, contractName])

	useEffect(() => {
		const get = async () => {
			const m = await contract?.methods[method]
			if (!m) return
			const withArgs = args ? m(...args) : m()
			const response = await withArgs.call()
			setData(response)
			setLoading(false)
		}
		get()
	}, [contract, method, args, block])

	return { loading, data }
}

export default useContractRead

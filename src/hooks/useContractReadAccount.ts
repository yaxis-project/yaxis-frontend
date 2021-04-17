import { useEffect, useMemo, useState } from 'react'
import useGlobal from './useGlobal'
import { Contract } from 'web3-eth-contract'
import objectPath from 'object-path'
import useWeb3Provider from './useWeb3Provider'

interface Params {
    contractName: string
    method: string
    args?: any[]
    result?: string
}

const useContractReadAccount = ({ contractName, method, args, result }: Params) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    const { account } = useWeb3Provider()
    const { yaxis, block } = useGlobal()

    const contract = useMemo(() => {
        if (!yaxis) return null
        const output = objectPath.get(yaxis?.contracts, contractName) as Contract
        if (!output) console.log(`Unable to initialize contract: ${contractName}`)
        return output
    }, [yaxis, contractName])

    useEffect(() => {
        setData(null)
        if (account) setLoading(true)
    }, [account])

    useEffect(() => {
        const get = async () => {
            const m = await contract?.methods[method]
            if (!m) return
            const withArgs = args ? m(...args) : m()
            const response = await withArgs.call()
            result ? setData(response[result]) : setData(response)
            setLoading(false)
        }
        if (account && contract)
            get()
    }, [account, contract, method, args, result, block])

    return { loading, data }
}

export default useContractReadAccount

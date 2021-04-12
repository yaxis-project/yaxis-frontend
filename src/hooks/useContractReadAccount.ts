import { useEffect, useMemo, useState } from 'react'
import useGlobal from './useGlobal'
import { Contract } from 'web3-eth-contract'
import objectPath from 'object-path'
import useWeb3Provider from './useWeb3Provider'

interface Params {
    contractName: string
    method: string
    args?: any[]
}

const useContractReadAccount = ({ contractName, method, args }: Params) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    const { account } = useWeb3Provider()
    const { yaxis, block } = useGlobal()

    const contract = useMemo(() => {
        const c = objectPath.get(yaxis?.contracts, contractName) as Contract
        if (!c) console.log(`Unable to initialize contract: ${contractName}`)
        return c
    }, [yaxis, contractName])

    useEffect(() => {
        setData(null)
        if (account) setLoading(true)
    }, [account])

    useEffect(() => {
        const get = async () => {
            const m = await contract?.methods[method]
            const withArgs = args ? m(...args) : m()
            const response = await withArgs.call()
            setData(response)
            setLoading(false)
        }
        if (account)
            get()
    }, [account, contract, method, args, block])

    return { loading, data }
}

export default useContractReadAccount

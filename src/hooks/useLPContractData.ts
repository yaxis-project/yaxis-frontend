import { useMemo } from 'react'
import useWeb3Provider from './useWeb3Provider'
import { provider } from 'web3-core'
import { getContract } from '../utils/erc20'
import useFarm from './useFarm'
import useStakedBalance from './useStakedBalance'
import { currencyMap } from '../utils/currencies'

/**
 * Get staked LP data for the signed in user for the given token.
 */
export default function useLPContractData(farmId: string) {
	const { library } = useWeb3Provider()
	const farmData = useFarm(farmId)
	const currency = currencyMap[farmData.symbol]
	const stakedBalance = useStakedBalance(farmData.pid)
	const lpContract = useMemo(() => {
		return getContract(library as provider, farmData.lpTokenAddress)
	}, [library, farmData.lpTokenAddress])

	return { farmData, currency, lpContract, stakedBalance }
}

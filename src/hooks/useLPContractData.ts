import { useMemo } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getContract } from '../utils/erc20'
import useFarm from './useFarm'
import useStakedBalance from './useStakedBalance'
import { currencyMap } from '../utils/currencies'

/**
 * Get staked LP data for the signed in user for the given token.
 */
export default function useLPContractData(farmId: string) {
	const { ethereum } = useWallet()
	const farmData = useFarm(farmId)
	const currency = currencyMap[farmData.symbol]
	const stakedBalance = useStakedBalance(farmData.pid)
	const lpContract = useMemo(() => {
		return getContract(ethereum as provider, farmData.lpTokenAddress)
	}, [ethereum, farmData.lpTokenAddress])

	return { farmData, currency, lpContract, stakedBalance }
}

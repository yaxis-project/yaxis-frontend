import { useMemo } from 'react'
import useWeb3Provider from './useWeb3Provider'
import { provider } from 'web3-core'
import { getContract } from '../utils/erc20'
import useFarm from './useFarm'
import useContractReadAccount from './useContractReadAccount'
import useContractRead from './useContractRead'
import { currencyMap } from '../utils/currencies'
import BigNumber from 'bignumber.js'

/**
 * Get staked LP data for the signed in user for the given token.
 */
export default function useLPContractData(pool: any) {
	const { account, library } = useWeb3Provider()
	const farmData = useFarm(pool?.id)
	const currency = currencyMap[farmData.symbol]
	const { data: stakedBalance } = useContractReadAccount({
		contractName: `rewards.${pool?.rewards}`,
		method: 'balanceOf',
		args: [account],
	})
	const { data: reserves } = useContractRead({
		contractName: `pools.0.lpContract`,
		method: 'getReserves()',
	})
	const { data: totalSupply } = useContractRead({
		contractName: `rewards.${pool?.rewards}`,
		method: 'totalSupply',
	})
	const lpContract = useMemo(() => {
		return getContract(library as provider, farmData.lpTokenAddress)
	}, [library, farmData.lpTokenAddress])

	return {
		reserves,
		totalSupply,
		farmData,
		currency,
		lpContract,
		stakedBalance: new BigNumber(stakedBalance || 0),
	}
}

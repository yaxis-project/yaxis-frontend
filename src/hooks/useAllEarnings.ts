import { useCallback, useEffect, useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import useWeb3Provider from './useWeb3Provider'

import { getEarned, getYaxisChefContract, getFarms } from '../yaxis/utils'
import useGlobal from './useGlobal'

const useAllEarnings = (): {
	balances: Array<BigNumber>
	totalAmount: BigNumber
} => {
	const [allEarning, setBalance] = useState<{
		balances: Array<BigNumber>
		totalAmount: BigNumber
	}>({
		balances: [],
		totalAmount: new BigNumber(0),
	})
	const { account } = useWeb3Provider()
	const { yaxis, block } = useGlobal()
	const farms = useMemo(() => getFarms(yaxis), [yaxis])
	const yaxisChefContract = getYaxisChefContract(yaxis)

	const fetchAllBalances = useCallback(async () => {
		try {
			const balances: Array<BigNumber> = await Promise.all(
				farms.map(({ pid }: { pid: number }) =>
					getEarned(yaxisChefContract, pid, account),
				),
			)
			let sumEarning = new BigNumber(0)
			for (let earning of balances) {
				sumEarning = sumEarning.plus(earning)
			}
			setBalance({
				balances: balances,
				totalAmount: sumEarning,
			})
		} catch { }
	}, [account, yaxisChefContract, farms])

	useEffect(() => {
		try {
			if (account && yaxisChefContract && yaxis) fetchAllBalances()
		} catch { }
	}, [account, block, yaxisChefContract, setBalance, yaxis, fetchAllBalances])

	return allEarning
}

export default useAllEarnings

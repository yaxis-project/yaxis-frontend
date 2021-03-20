import { useCallback, useEffect, useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'

import { getEarned, getYaxisChefContract, getFarms } from '../yaxis/utils'
import useYaxis from './useYaxis'
import useBlock from './useBlock'

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
	const { account } = useWeb3React()
	const yaxis = useYaxis()
	const farms = useMemo(() => getFarms(yaxis), [yaxis])
	const yaxisChefContract = getYaxisChefContract(yaxis)
	const block = useBlock()

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

import {useCallback, useEffect, useState} from 'react'
import {provider} from 'web3-core'

import BigNumber from 'bignumber.js'
import {useWallet} from 'use-wallet'

import {getEarned, getYaxisChefContract, getFarms} from '../yaxis/utils'
import useYaxis from './useYaxis'
import useBlock from './useBlock'

const useAllEarnings = (): { balances: Array<BigNumber>, totalAmount: BigNumber } => {
	const [allEarning, setBalance] = useState<{ balances: Array<BigNumber>, totalAmount: BigNumber }>({
		balances: [],
		totalAmount: new BigNumber(0)
	})
	const {account} = useWallet<provider>()
	const yaxis = useYaxis();
	const farms = getFarms(yaxis);
	const yaxisChefContract = getYaxisChefContract(yaxis);
	const block = useBlock();

	const fetchAllBalances = useCallback(async () => {
        try {
            const balances: Array<BigNumber> = await Promise.all(
                farms.map(({pid}: { pid: number }) =>
                    getEarned(yaxisChefContract, pid, account),
                ),
            );
            let sumEarning = new BigNumber(0);
            for (let earning of balances) {
                sumEarning = sumEarning.plus(earning);
            }
            setBalance({
                balances: balances,
                totalAmount: sumEarning,
            });
        } catch {
        }
	}, [account, yaxisChefContract, block, yaxis])

	useEffect(() => {
        try {
            if (account && yaxisChefContract && yaxis) fetchAllBalances()
		} catch {
        }
		
	}, [account, block, yaxisChefContract, setBalance, yaxis])

	return allEarning
}

export default useAllEarnings

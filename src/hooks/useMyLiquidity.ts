import { useState, useEffect, useCallback, useMemo } from 'react'
import useFarm from './useFarm'
import useTokenBalance from './useTokenBalance'
import useWeb3Provider from './useWeb3Provider'
import useStakedBalance from './useStakedBalance'
import useContractReadAccount from './useContractReadAccount'
import BigNumber from 'bignumber.js'
import { StakePool } from '../yaxis/type'
import { Farm } from '../contexts/Farms/types'

/**
 * Liquidity Data object.
 */
export interface LiquidityPoolData {
	farm: Farm
	userPoolShare: BigNumber
	totalSupply: BigNumber
	userBalance: BigNumber
	stakedBalance: BigNumber
}

/**
 * Returns details about the logged in user's liquidity pool stats.
 * @param pool StakePool passed to fetch contract data.
 * @returns {LiquidityPoolData}
 * @see useFarm
 */
export default function useLP(pool: StakePool): LiquidityPoolData {
	const { account } = useWeb3Provider()

	const farm = useFarm(pool.symbol)
	const [userPoolShare, setUserPoolShare] = useState<BigNumber>(
		new BigNumber(0),
	)
	const [totalSupply, setTotalSupply] = useState<BigNumber>(new BigNumber(0))
	const [tokenBalance, setTokenBalance] = useState<BigNumber>(
		new BigNumber(0),
	)

	const { balance } = useTokenBalance(farm?.lpContract?.options?.address)
	const { balance: legacyStakedBalance } = useStakedBalance(pool.pid)

	const {
		data: newStakedBalance,
	} = useContractReadAccount({
		contractName: `yaxisMetaVault`,
		method: 'pendingYax',
		args: [account],
	})

	const stakedBalance = useMemo(() => pool?.legacy ? legacyStakedBalance
		: newStakedBalance, [pool, legacyStakedBalance, newStakedBalance])

	const getData = useCallback(async () => {
		if (!(farm && farm.lpContract)) return

		const totalBalance = balance.plus(stakedBalance)
		const { lpContract } = farm
		const supplyValue: BigNumber = await lpContract.methods
			.totalSupply()
			.call()
		if (new BigNumber(supplyValue).gt(new BigNumber(0)))
			setUserPoolShare(totalBalance.div(supplyValue))
		setTokenBalance(balance)
		setTotalSupply(supplyValue)
	}, [farm, stakedBalance, balance])

	useEffect(() => {
		getData()
	}, [getData])

	return {
		farm,
		userPoolShare,
		totalSupply,
		stakedBalance,
		userBalance: tokenBalance,
	}
}

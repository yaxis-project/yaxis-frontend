import { useState, useEffect, useCallback } from 'react'
import useFarm from './useFarm'
import useTokenBalance from './useTokenBalance'
import useStakedBalance from './useStakedBalance'
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
	const farm = useFarm(pool.symbol)
	const [userPoolShare, setUserPoolShare] = useState<BigNumber>(
		new BigNumber(0),
	)
	const [totalSupply, setTotalSupply] = useState<BigNumber>(new BigNumber(0))
	const [tokenBalance, setTokenBalance] = useState<BigNumber>(
		new BigNumber(0),
	)

	const userBalance = useTokenBalance(farm?.lpContract?.options?.address)
	const stakedBalance = useStakedBalance(pool.pid)

	const getData = useCallback(async () => {
		if (!(farm && farm.lpContract)) return

		const totalBalance = userBalance.plus(stakedBalance)
		const { lpContract } = farm
		const supplyValue: BigNumber = await lpContract.methods
			.totalSupply()
			.call()
		if (new BigNumber(supplyValue).gt(new BigNumber(0)))
			setUserPoolShare(totalBalance.div(supplyValue))
		setTokenBalance(userBalance)
		setTotalSupply(supplyValue)
	}, [farm, stakedBalance, userBalance])

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

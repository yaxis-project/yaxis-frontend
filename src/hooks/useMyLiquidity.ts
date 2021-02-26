import { useState, useEffect } from 'react'
import useFarm from './useFarm'
import useTokenBalance from './useTokenBalance'
import useStakedBalance from './useStakedBalance'
import BigNumber from 'bignumber.js'
import { StakePool } from '../yaxis/type'

/**
 * Liquidity Data object.
 */
export interface LiquidityData {
	tokenBalance: BigNumber
	userPoolShare: BigNumber
	totalSupply: BigNumber
	userBalance: BigNumber
}

/**
 * Returns details about the logged in user's liquidity pool stats.
 * @param pool StakePool passed to fetch contract data.
 * @returns {LiquidityData}
 * @see useFarm
 */
export default function useMyLiquidity(pool: StakePool): LiquidityData {
	const farm = useFarm(pool.symbol)
	const [userPoolShare, setUserPoolShare] = useState<BigNumber>(
		new BigNumber(0),
	)
	const [totalSupply, setTotalSupply] = useState<BigNumber>(new BigNumber(0))
	const [tokenBalance, setTokenBalance] = useState<BigNumber>(
		new BigNumber(0),
	)

	const lpContract = farm?.lpContract
	const userBalance = useTokenBalance(lpContract?.options?.address)
	const stakedBalance = useStakedBalance(pool.pid)
	const totalBalance = userBalance.plus(stakedBalance)

	useEffect(() => {
		if (!(farm && lpContract)) return
		const getSupplyValue = async () => {
			const { lpContract } = farm
			const supplyValue: BigNumber = await lpContract.methods
				.totalSupply()
				.call()
			setTokenBalance(userBalance)
			setTotalSupply(supplyValue)
			if (new BigNumber(supplyValue).gt(new BigNumber(0)))
				setUserPoolShare(totalBalance.div(supplyValue))
		}
		getSupplyValue()
	}, [farm, lpContract, tokenBalance, userBalance, totalBalance])

	return { tokenBalance, totalSupply, userPoolShare, userBalance }
}

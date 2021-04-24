import { useEffect, useMemo, useState } from 'react'
import useGlobal from './useGlobal'
import useMetaVaultData from './useMetaVaultData'
import usePriceMap from './usePriceMap'
import { RewardsContracts } from '../yaxis/type'
import { Contract } from 'web3-eth-contract'
import objectPath from 'object-path'
import BigNumber from 'bignumber.js'

const defaultState = {
	apr: new BigNumber(0),
	rewardsPerBlock: new BigNumber(0),
}
interface Params {
	rewardsContract: keyof RewardsContracts
}

const useRewardAPY = ({ rewardsContract }: Params) => {
	const [data, setData] = useState(defaultState)
	const [loading, setLoading] = useState(true)

	const { yaxis } = useGlobal()
	const { YAXIS } = usePriceMap()

	const { metaVaultData } = useMetaVaultData('v1')

	const contract = useMemo(() => {
		const c = objectPath.get(
			yaxis?.contracts,
			`rewards.${rewardsContract}`,
		) as Contract
		if (!c)
			console.log(
				`Unable to initialize contract: Rewards ${rewardsContract}`,
			)
		return c
	}, [yaxis, rewardsContract])

	const pool = useMemo(
		() => yaxis?.contracts.pools.find((p) => p.rewards === rewardsContract),
		[yaxis, rewardsContract],
	)

	useEffect(() => {
		const get = async () => {
			const calls = []
			calls.push(await contract.methods.totalSupply().call())
			calls.push(await contract.methods.duration().call())
			const [totalSupply, duration] = await Promise.all(calls)
			const balance = await yaxis?.contracts.yaxis.methods
				.balanceOf(contract.options.address)
				.call()
			const reserves = await pool?.lpContract.methods.getReserves().call()
			let tvl
			if (pool)
				tvl = new BigNumber(reserves['_reserve0']).plus(
					new BigNumber(reserves['_reserve1']).multipliedBy(
						new BigNumber(reserves['_reserve0']).dividedBy(
							new BigNumber(reserves['_reserve1']),
						),
					),
				)
			else if (rewardsContract === 'Yaxis') tvl = totalSupply
			else tvl = (metaVaultData?.tvl / YAXIS) * 10 ** 18
			const funding =
				rewardsContract === 'Yaxis'
					? new BigNumber(balance).minus(tvl)
					: new BigNumber(balance)
			if (funding.lt(0)) {
				setLoading(false)
				return
			}

			const period = new BigNumber(duration).dividedBy(86400)
			const AVERAGE_BLOCKS_PER_DAY = 6450
			const rewardsPerBlock = funding
				.dividedBy(period)
				.dividedBy(AVERAGE_BLOCKS_PER_DAY)
				.dividedBy(10 ** 18)
			const rewardPerToken = funding.dividedBy(tvl)
			const apr = rewardPerToken
				.dividedBy(period)
				.multipliedBy(365)
				.multipliedBy(100)
			setData({ apr, rewardsPerBlock })
			setLoading(false)
		}
		if (contract) get()
	}, [
		contract,
		yaxis?.contracts,
		metaVaultData?.tvl,
		YAXIS,
		pool,
		rewardsContract,
	])

	return { loading, data }
}

export default useRewardAPY

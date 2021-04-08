import { useCallback, useEffect, useState, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getYaxisChefContract, numberToFloat } from '../yaxis/utils'
import useGlobal from './useGlobal'
import BigNumber from 'bignumber.js'

const useRewardPerBlock = () => {
	const [rewardPerBlock, setRewardPerBlock] = useState(0)
	const { account } = useWeb3React()
	const { yaxis, block } = useGlobal()
	const yaxisChefContract = useMemo(() => getYaxisChefContract(yaxis), [
		yaxis,
	])

	const fetRewardPerBlock = useCallback(async () => {
		const [multiplier, yaxPerBlock] = await Promise.all([
			await yaxisChefContract.methods
				.getMultiplier(block, block + 1)
				.call(),
			yaxisChefContract.methods.yaxPerBlock().call(),
		])
		let rate = numberToFloat(
			new BigNumber(multiplier).multipliedBy(yaxPerBlock),
			18,
		)
		setRewardPerBlock(rate)
	}, [block, yaxisChefContract])

	useEffect(() => {
		if (
			account &&
			yaxisChefContract &&
			yaxis &&
			block > 0 &&
			rewardPerBlock === 0
		) {
			// Possible memory leak?
			fetRewardPerBlock()
		}
	}, [
		account,
		block,
		yaxisChefContract,
		setRewardPerBlock,
		yaxis,
		fetRewardPerBlock,
		rewardPerBlock,
	])

	return rewardPerBlock
}

export default useRewardPerBlock

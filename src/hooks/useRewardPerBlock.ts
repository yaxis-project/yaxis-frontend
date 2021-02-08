import {useCallback, useEffect, useState} from 'react'
import {provider} from 'web3-core'

import {useWallet} from 'use-wallet'

import {getYaxisChefContract, numberToFloat} from '../yaxis/utils'
import useYaxis from './useYaxis'
import useBlock from './useBlock'
import BigNumber from "bignumber.js";

const useRewardPerBlock = () => {
	const [rewardPerBlock, setRewardPerBlock] = useState(0)
	const {account}: { account: string; ethereum: provider } = useWallet()
	const yaxis = useYaxis()
	const yaxisChefContract = getYaxisChefContract(yaxis)
	const block = useBlock()

	const fetRewardPerBlock = useCallback(async () => {

		const [multiplier, yaxPerBlock] = await Promise.all([
			await yaxisChefContract.methods.getMultiplier(block, block + 1).call(),
			yaxisChefContract.methods.yaxPerBlock().call()
		]);
		let rate = numberToFloat(new BigNumber(multiplier).multipliedBy(yaxPerBlock), 18);
		setRewardPerBlock(rate)
	}, [block, account, yaxisChefContract, yaxis])

	useEffect(() => {
		if (account && yaxisChefContract && yaxis && block > 0 && rewardPerBlock == 0) {
			fetRewardPerBlock()
		}
	}, [account, block, yaxisChefContract, setRewardPerBlock, yaxis])

	return rewardPerBlock
}

export default useRewardPerBlock

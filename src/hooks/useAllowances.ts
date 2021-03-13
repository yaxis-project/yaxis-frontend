import { useEffect, useState, useCallback } from 'react'

import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'

import { getAllowances } from '../utils/erc20'
import useYaxis from './useYaxis'
import { getMutilcallContract } from '../yaxis/utils'
import useBlock from './useBlock'

const useAllowances = (
	tokenAddresses: string[],
	spender: string,
): [BigNumber[], () => void] => {
	const [allowances, setAllowances] = useState<BigNumber[]>([
		...Array(tokenAddresses.length),
	])
	const { account, library } = useWeb3React()
	const yaxis = useYaxis()
	const block = useBlock()
	let mutilcallContract = getMutilcallContract(yaxis)

	const onUpdateAllowances = useCallback(async () => {
		const balance = await getAllowances(
			yaxis,
			mutilcallContract,
			tokenAddresses,
			account,
			spender,
		)
		setAllowances(balance)
	}, [
		tokenAddresses,
		setAllowances,
		account,
		spender,
		yaxis,
		mutilcallContract,
	])

	useEffect(() => {
		if (account && library && yaxis && yaxis.web3) {
			onUpdateAllowances()
		}
	}, [account, library, yaxis, block])

	return [allowances, onUpdateAllowances]
}

export default useAllowances

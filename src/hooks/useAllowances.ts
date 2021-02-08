import {useEffect, useState, useCallback} from 'react'

import BigNumber from 'bignumber.js'
import {useWallet} from 'use-wallet'
import {provider} from 'web3-core'

import {getAllowances} from '../utils/erc20'
import useYaxis from "./useYaxis";
import {getMutilcallContract} from "../yaxis/utils";
import useBlock from './useBlock';

const useAllowances = (tokenAddresses: string[], spender: string): [BigNumber[], () => void] => {
	const [allowances, setAllowances] = useState<BigNumber[]>([...Array(tokenAddresses.length)])
	const {account, ethereum} = useWallet<provider>()
	const yaxis = useYaxis();
	const block = useBlock()
	let mutilcallContract = getMutilcallContract(yaxis);

	const onUpdateAllowances = useCallback(async () => {
		const balance = await getAllowances(yaxis, mutilcallContract, tokenAddresses, account, spender)
		setAllowances(balance)
	}, [tokenAddresses, setAllowances, account, spender, yaxis, mutilcallContract])

	useEffect(() => {
		if (account && ethereum && yaxis && yaxis.web3) {
			onUpdateAllowances()
		}
	}, [account, ethereum, yaxis, block])

	return [allowances, onUpdateAllowances]
}

export default useAllowances

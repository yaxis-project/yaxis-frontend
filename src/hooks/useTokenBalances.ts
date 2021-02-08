import {useCallback, useEffect, useState} from 'react'

import BigNumber from 'bignumber.js'
import {useWallet} from 'use-wallet'
import {provider} from 'web3-core'

import {getBalances} from '../utils/erc20'
import useBlock from './useBlock'
import useYaxis from "./useYaxis";
import {getMutilcallContract} from "../yaxis/utils";

const useTokenBalances = (tokenAddresses: string[]) => {
	const [balances, setBalance] = useState<BigNumber[]>([...Array(tokenAddresses.length)])
	const {account, ethereum} = useWallet<provider>()
	const block = useBlock()
	const yaxis = useYaxis();
	let mutilcallContract = getMutilcallContract(yaxis);

	const fetchBalances = useCallback(async () => {
		const balance = await getBalances(yaxis, mutilcallContract, tokenAddresses, account)
		setBalance(balance)
	}, [account, tokenAddresses, yaxis, mutilcallContract, setBalance])

	useEffect(() => {
		if (account && ethereum && yaxis && yaxis.web3) {
			fetchBalances()
		}
	}, [account, ethereum, setBalance, yaxis, block, fetchBalances])

	return balances
}

export default useTokenBalances

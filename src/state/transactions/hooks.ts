import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useWeb3Provider from '../../hooks/useWeb3Provider'
import { AppDispatch, AppState } from '../index'
import { addTransaction, clearPendingTransactions } from './actions'
import { TransactionDetails } from './reducer'

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
	response: TransactionResponse,
	customData: {
		contract: string
		method: string
		summary?: string
		amount?: string
	},
) => void {
	const { chainId, account } = useWeb3Provider()
	const dispatch = useDispatch<AppDispatch>()

	return useCallback(
		(
			response: TransactionResponse,
			{
				contract,
				method,
				summary,
				amount,
			}: {
				method: string
				contract: string
				summary?: string
				amount?: string
			} = { method: '', contract: '' },
		) => {
			if (!account) return
			if (!chainId) return

			const { hash } = response
			if (!hash) {
				throw Error('No transaction hash found.')
			}
			dispatch(
				addTransaction({
					account,
					hash,
					from: account,
					chainId,
					summary,
					method,
					contract,
					amount,
				}),
			)
		},
		[dispatch, chainId, account],
	)
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
	const { account, chainId } = useWeb3Provider()

	const state = useSelector<AppState, AppState['transactions']>(
		(state) => state.transactions,
	)

	return useMemo(
		() => (chainId && account ? state[account]?.[chainId] ?? {} : {}),
		[account, chainId, state],
	)
}

export function useIsTransactionPending(transactionHash?: string): boolean {
	const transactions = useAllTransactions()

	if (!transactionHash || !transactions[transactionHash]) return false

	return !transactions[transactionHash].receipt
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
	return new Date().getTime() - tx.addedTime < 86_400_000
}

export function useHasPendingTransaction(
	contractName: string,
	method: string,
): boolean {
	const allTransactions = useAllTransactions()
	return useMemo(() => {
		const txIndex = Object.keys(allTransactions).find((hash) => {
			const tx = allTransactions[hash]
			if (!tx) return false
			return (
				!tx.confirmedTime &&
				isTransactionRecent(tx) &&
				tx.contract === contractName &&
				tx.method === method
			)
		})
		return txIndex !== undefined
	}, [contractName, method, allTransactions])
}

export function useClearPendingTransactions() {
	const { chainId, account } = useWeb3Provider()

	const dispatch = useDispatch<AppDispatch>()

	return useCallback(
		() => dispatch(clearPendingTransactions({ account, chainId })),
		[dispatch, account, chainId],
	)
}

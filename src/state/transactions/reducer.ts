import { createReducer } from '@reduxjs/toolkit'
import {
	addTransaction,
	checkedTransaction,
	clearAllTransactions,
	finalizeTransaction,
	SerializableTransactionReceipt,
} from './actions'

const now = () => new Date().getTime()

export interface TransactionDetails {
	hash: string
	summary?: string
	amount?: string
	receipt?: SerializableTransactionReceipt
	lastCheckedBlockNumber?: number
	addedTime: number
	confirmedTime?: number
	from: string
	method: string
	contract: string
}

export interface TransactionState {
	[chainId: number]: {
		[txHash: string]: TransactionDetails
	}
}

export const initialState: TransactionState = {}

export default createReducer(initialState, (builder) =>
	builder
		.addCase(
			addTransaction,
			(
				transactions,
				{
					payload: {
						chainId,
						from,
						hash,
						summary,
						method,
						contract,
						amount,
					},
				},
			) => {
				if (transactions[chainId]?.[hash]) {
					throw Error('Attempted to add existing transaction.')
				}
				const txs = transactions[chainId] ?? {}
				txs[hash] = {
					hash,
					summary,
					from,
					addedTime: now(),
					method,
					contract,
					amount,
				}
				transactions[chainId] = txs
			},
		)
		.addCase(
			clearAllTransactions,
			(transactions, { payload: { chainId } }) => {
				if (!transactions[chainId]) return
				transactions[chainId] = {}
			},
		)
		.addCase(
			checkedTransaction,
			(transactions, { payload: { chainId, hash, blockNumber } }) => {
				const tx = transactions[chainId]?.[hash]
				if (!tx) {
					return
				}
				if (!tx.lastCheckedBlockNumber) {
					tx.lastCheckedBlockNumber = blockNumber
				} else {
					tx.lastCheckedBlockNumber = Math.max(
						blockNumber,
						tx.lastCheckedBlockNumber,
					)
				}
			},
		)
		.addCase(
			finalizeTransaction,
			(transactions, { payload: { hash, chainId, receipt } }) => {
				const tx = transactions[chainId]?.[hash]
				if (!tx) {
					return
				}
				tx.receipt = receipt
				tx.confirmedTime = now()
			},
		),
)

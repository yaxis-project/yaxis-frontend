import { createReducer } from '@reduxjs/toolkit'
import {
	addTransaction,
	checkedTransaction,
	clearAllTransactions,
	clearPendingTransactions,
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
	[account: string]: {
		[chainId: number]: {
			[txHash: string]: TransactionDetails
		}
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
						account,
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
				if (transactions[account]?.[chainId]?.[hash]) {
					throw Error('Attempted to add existing transaction.')
				}
				if (!transactions[account]) transactions[account] = {}
				const txs = transactions[account][chainId] ?? {}
				txs[hash] = {
					hash,
					summary,
					from,
					addedTime: now(),
					method,
					contract,
					amount,
				}
				transactions[account][chainId] = txs
			},
		)
		.addCase(
			clearAllTransactions,
			(transactions, { payload: { account, chainId } }) => {
				if (!transactions[account]?.[chainId]) return
				transactions[account][chainId] = {}
			},
		)
		.addCase(
			clearPendingTransactions,
			(transactions, { payload: { account, chainId } }) => {
				if (!transactions[account]?.[chainId]) return
				for (const tx in transactions[account][chainId]) {
					if (!transactions[account]?.[chainId]?.[tx]) continue
					if (!transactions[account][chainId][tx]?.confirmedTime)
						delete transactions[account][chainId][tx]
				}
			},
		)
		.addCase(
			checkedTransaction,
			(
				transactions,
				{ payload: { account, chainId, hash, blockNumber } },
			) => {
				const tx = transactions[account]?.[chainId]?.[hash]
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
			(
				transactions,
				{ payload: { account, hash, chainId, receipt } },
			) => {
				const tx = transactions[account]?.[chainId]?.[hash]
				if (!tx) {
					return
				}
				tx.receipt = receipt
				tx.confirmedTime = now()
			},
		),
)

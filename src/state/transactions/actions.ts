import { createAction } from '@reduxjs/toolkit'

export interface SerializableTransactionReceipt {
	to: string
	from: string
	contractAddress: string
	transactionIndex: number
	blockHash: string
	transactionHash: string
	blockNumber: number
	status?: number
}

export const addTransaction = createAction<{
	account: string
	chainId: number
	hash: string
	from: string
	summary?: string
	amount?: string
	method: string
	contract: string
}>('transactions/addTransaction')
export const clearPendingTransactions = createAction<{
	account: string
	chainId: number
}>('transactions/clearPendingTransactions')
export const clearAllTransactions = createAction<{
	account: string
	chainId: number
}>('transactions/clearAllTransactions')
export const finalizeTransaction = createAction<{
	account: string
	chainId: number
	hash: string
	receipt: SerializableTransactionReceipt
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
	account: string
	chainId: number
	hash: string
	blockNumber: number
}>('transactions/checkedTransaction')

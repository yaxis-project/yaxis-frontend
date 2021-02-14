import { useContext } from 'react'
import { Context } from '../contexts/Transactions'

const useTransactionAdder = () => {
	const { onAddTransaction, onClearTransactions, transactions } = useContext(
		Context,
	)
	return { onAddTransaction, onClearTransactions, transactions }
}

export default useTransactionAdder

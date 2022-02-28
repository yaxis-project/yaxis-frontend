import { useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { useBlockNumber } from '../application/hooks'
import { AppDispatch, AppState } from '../index'
import { checkedTransaction, finalizeTransaction } from './actions'
import { notification } from 'antd'
import { useExplorerUrl } from '../../utils'
import { NETWORK_NAMES } from '../../connectors'
import { SerializableTransactionReceipt } from '.'

const clickableStyle = { cursor: 'pointer' }

export function shouldCheck(
	lastBlockNumber: number,
	tx: {
		addedTime: number
		receipt?: SerializableTransactionReceipt
		lastCheckedBlockNumber?: number
	},
): boolean {
	if (tx.receipt) return false
	if (!tx.lastCheckedBlockNumber) return true
	const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
	if (blocksSinceCheck < 1) return false
	const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
	if (minutesPending > 60) {
		// every 10 blocks if pending for longer than an hour
		return blocksSinceCheck > 9
	} else if (minutesPending > 5) {
		// every 3 blocks if pending more than 5 minutes
		return blocksSinceCheck > 2
	} else {
		// otherwise every block
		return true
	}
}

export default function Updater(): null {
	const { account, chainId, library } = useWeb3Provider()

	const networkName = useMemo(() => NETWORK_NAMES[chainId] || '', [chainId])

	const lastBlockNumber = useBlockNumber()

	const dispatch = useDispatch<AppDispatch>()
	const state = useSelector<AppState, AppState['transactions']>(
		(state) => state.transactions,
	)

	const transactions = useMemo(
		() => (chainId ? state[account]?.[chainId] ?? {} : {}),
		[account, chainId, state],
	)

	const explorerUrl = useExplorerUrl(`/tx/`)

	useEffect(() => {
		if (!chainId || !library || !lastBlockNumber) return

		Object.keys(transactions)
			.filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
			.forEach((hash) => {
				library
					.getTransactionReceipt(hash)
					.then((receipt) => {
						if (receipt) {
							dispatch(
								finalizeTransaction({
									account,
									chainId,
									hash,
									receipt: {
										blockHash: receipt.blockHash,
										blockNumber: receipt.blockNumber,
										contractAddress:
											receipt.contractAddress,
										from: receipt.from,
										status: receipt.status,
										to: receipt.to,
										transactionHash:
											receipt.transactionHash,
										transactionIndex:
											receipt.transactionIndex,
									},
								}),
							)

							const tx = transactions[hash]
							if (receipt.status === 1) {
								notification.success({
									message: `Successfully ${tx.summary}.`,
									description: 'Click to see on Etherscan',
									style: clickableStyle,
									onClick: () =>
										window.open(
											explorerUrl + `${tx?.hash}`,
											'_blank',
										),
								})
							}
							if (receipt.status === 0)
								notification.error({
									message: `Failed: Unable to ${tx.summary}.`,
									description: 'Click to see on Etherscan',
									style: clickableStyle,
									onClick: () =>
										window.open(
											explorerUrl + `${tx?.hash}`,
											'_blank',
										),
								})
						} else {
							dispatch(
								checkedTransaction({
									account,
									chainId,
									hash,
									blockNumber: lastBlockNumber,
								}),
							)
						}
					})
					.catch((error) => {
						console.error(
							`failed to check transaction hash: ${hash}`,
							error,
						)
					})
			})
	}, [
		account,
		chainId,
		library,
		transactions,
		lastBlockNumber,
		dispatch,
		networkName,
	])

	return null
}

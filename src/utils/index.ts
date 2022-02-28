import BigNumber from 'bignumber.js'
import { useChainInfo } from '../state/user'

export { default as formatAddress } from './formatAddress'

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
	return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export const decToBn = (dec: number, decimals = 18) => {
	return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals))
}

// chunks array into chunks of maximum size
// evenly distributes items among the chunks
export function chunkArray<T>(items: T[], maxChunkSize: number): T[][] {
	if (maxChunkSize < 1) throw new Error('maxChunkSize must be gte 1')
	if (items.length <= maxChunkSize) return [items]

	const numChunks: number = Math.ceil(items.length / maxChunkSize)
	const chunkSize = Math.ceil(items.length / numChunks)
	return Array.from(Array(numChunks).keys()).map((ix) =>
		items.slice(ix * chunkSize, ix * chunkSize + chunkSize),
	)
}

export function useExplorerUrl(url = '') {
	const chainInfo = useChainInfo()
	return `${chainInfo.explorer}${url}`
}

export function useYaxisUrl() {
	const chainInfo = useChainInfo()
	return chainInfo.yaxisUrl
}

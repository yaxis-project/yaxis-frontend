import { ChainId } from '../chains'

import ethereum from './ethereum'
import avalanche from './avalanche'

export const configs = {
	...ethereum,
	...avalanche,
}

/**
 * Return the configuration for a given blockchain and chainId
 * @param chainId defaults to 1 (ethereum mainnet)
 * @returns Configuration object
 */
export const currentConfig = (chainId = ChainId['ETHEREUM_MAINNET']) =>
	configs[chainId]

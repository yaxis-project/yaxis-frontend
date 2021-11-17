import { Config } from '../type'

import ethereum from './ethereum'

export const configs = {
	ethereum,
}

/**
 * Return the configuration for a given blockchain and chainId
 * @param chainId defaults to 1 (mainnet)
 * @param blockchain defaults to ethereum
 * @returns Configuration object
 */
export const currentConfig = (chainId = 1, blockchain = 'ethereum'): Config =>
	configs[blockchain][chainId]

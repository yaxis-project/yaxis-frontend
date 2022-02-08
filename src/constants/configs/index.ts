import { Config } from '../type/ethereum'

import ethereum from './ethereum'
import avalanche from './avalanche'

export const Networks = <const>['ethereum', 'avalanche']

export type TNetworks = typeof Networks[number]

export const configs = {
	ethereum,
	avalanche
}

/**
 * Return the configuration for a given blockchain and chainId
 * @param chainId defaults to 1 (mainnet)
 * @param blockchain defaults to ethereum
 * @returns Configuration object
 */
export const currentConfig = (chainId = 1, blockchain = 'ethereum'): Config =>
	configs[blockchain][chainId]

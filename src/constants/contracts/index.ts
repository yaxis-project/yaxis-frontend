import { AvalancheContracts } from './avalanche'
import { EthereumContracts } from './ethereum'

import { ChainId, CHAIN_INFO } from '../chains'

export type Contracts = AvalancheContracts | EthereumContracts

export const initializeContracts = (library: any, networkId: ChainId) => {
	const chainInfo = CHAIN_INFO[networkId]

	switch (chainInfo.blockchain) {
		case 'ethereum':
			return new EthereumContracts(library, networkId)

		case 'avalanche':
			return new AvalancheContracts(library, networkId)

		default:
			throw new Error('Unsupported Chain')
	}
}

export type { LiquidityPoolWithContract as AvalancheLiquidityPoolC } from './avalanche'
export type { LiquidityPoolWithContract as EthereumLiquidityPoolC } from './ethereum'

export { AvalancheContracts, EthereumContracts }

import { ChainId } from '../../chains'

import { abis as fuji } from './fuji'
import { abis as mainnet } from './mainnet'

const avalanche = {
	[ChainId.AVALANCHE_FUJI]: fuji,
	[ChainId.AVALANCHE_MAINNET]: mainnet,
}

export default avalanche

import { ChainId } from '../../chains'

import mainnet from './mainnet'
import fuji from './fuji'

const avalanche = {
	[ChainId.AVALANCHE_FUJI]: fuji,
	[ChainId.AVALANCHE_MAINNET]: mainnet,
}

export default avalanche

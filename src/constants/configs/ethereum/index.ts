import { ChainId } from '../../chains'

import kovan from './kovan'
import mainnet from './mainnet'

const ethereum = {
	[ChainId.ETHEREUM_KOVAN]: kovan,
	[ChainId.ETHEREUM_MAINNET]: mainnet,
}

export default ethereum

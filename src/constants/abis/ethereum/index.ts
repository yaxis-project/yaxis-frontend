import { ChainId } from '../../chains'

import { abis as kovan } from './kovan'
import { abis as mainnet } from './mainnet'

const ethereum = {
	[ChainId.ETHEREUM_KOVAN]: kovan,
	[ChainId.ETHEREUM_MAINNET]: mainnet,
}

export default ethereum

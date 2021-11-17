import { Config } from '../../type'

import kovan from './kovan'
import mainnet from './mainnet'

const ethereum: Record<number, Config> = {
	42: kovan,
	1: mainnet,
}

export default ethereum

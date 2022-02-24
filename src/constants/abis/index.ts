import { JsonFragment } from '@ethersproject/abi'
import { ChainId } from '../chains'

import ethereum from './ethereum'
import avalanche from './avalanche'

const abis: Record<ChainId, Record<string, JsonFragment[]>> = {
	...ethereum,
	...avalanche,
}

export default abis

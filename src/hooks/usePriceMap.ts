import { useContext } from 'react'

import PriceMapContext from '../contexts/PriceMapContext'

interface IPriceMap {
	[key: string]: number
}

function usePriceMap(): IPriceMap | null {
	return useContext(PriceMapContext)
}

export default usePriceMap

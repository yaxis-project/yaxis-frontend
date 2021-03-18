import { useContext } from 'react'

import { Context } from '../contexts/Prices'

function usePriceMap() {
	return useContext(Context)
}

export default usePriceMap

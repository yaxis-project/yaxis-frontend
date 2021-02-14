import { useContext } from 'react'
import { Context as FarmsContext } from '../contexts/Farms'
import { Farm } from '../yaxis/utils'

const useFarm = (id: string): Farm => {
	const { farms } = useContext(FarmsContext)
	return farms.find((farm) => farm.tokenSymbol === id)
}

export default useFarm

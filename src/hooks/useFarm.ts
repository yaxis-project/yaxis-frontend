import { useContext } from 'react'
import { Context as FarmsContext } from '../contexts/Farms'
import { farmFactory, Farm } from '../contexts/Farms/types'

const useFarm = (id: string): Farm => {
	const { farms } = useContext(FarmsContext)
	return farms.find((farm) => farm.id === id) || farmFactory()
}

export default useFarm

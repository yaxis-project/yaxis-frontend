import { useContext } from 'react'
import { Context as FarmsContext } from '../contexts/Farms'

const useFarms = () => {
	return useContext(FarmsContext)
}

export default useFarms

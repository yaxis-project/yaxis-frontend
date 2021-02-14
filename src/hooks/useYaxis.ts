import { useContext } from 'react'
import { Context } from '../contexts/YaxisProvider'

const useYaxis = () => {
	const { yaxis } = useContext(Context)
	return yaxis
}

export default useYaxis

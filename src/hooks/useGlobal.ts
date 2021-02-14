import { useContext } from 'react'
import { Context } from '../contexts/YaxisProvider'

const useGlobal = () => {
	return useContext(Context)
}

export default useGlobal

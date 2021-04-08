import { useContext } from 'react'
import { Context } from '../contexts/Global'

const useGlobal = () => {
	return useContext(Context)
}

export default useGlobal

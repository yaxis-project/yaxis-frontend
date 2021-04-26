import { useSelector } from 'react-redux'
import { AppState } from '../index'

export function usePrices() {
	return useSelector((state: AppState) => state.prices)
}

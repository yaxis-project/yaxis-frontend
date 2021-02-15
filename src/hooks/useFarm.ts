import { useContext } from 'react'
import { Context as FarmsContext } from '../contexts/Farms'
import { Farm } from '../yaxis/utils'

const useFarm = (id: string): Farm => {
	const { farms } = useContext(FarmsContext)
	return (
		farms.find((farm) => farm.id === id) || {
			id: '',
			lpToken: '',
			lpTokenAddress: '',
			earnToken: '',
			earnTokenAddress: '',
			pid: 0,
			active: false,
			type: '',
			liquidId: '',
			lpAddress: '',
			lpTokens: [
				{
					symbol: '',
					decimals: 0,
				},
			],
			tokenAddress: '',
			name: '',
			symbol: '',
			tokenSymbol: '',
			icon: '',
			lpUrl: '',
		}
	)
}

export default useFarm

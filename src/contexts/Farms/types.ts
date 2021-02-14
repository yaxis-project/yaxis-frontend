import { Farm } from '../../yaxis/utils'
import BigNumber from 'bignumber.js'

export const defaultStakedValue: StakedValue = {
	pid: 0,
	totalSupply: 0,
	poolWeight: new BigNumber(0),
	reserve: [],
	prices: [],
	balance: 0,
	tvl: 0,
	lpPrice: 0,
}

export interface StakedValue {
	pid: number
	totalSupply?: number
	poolWeight: BigNumber
	reserve?: number[]
	prices: any[]
	balance?: number
	tvl?: number
	lpPrice: number
}
export interface FarmsContext {
	farms: Farm[]
	stakedValues: Array<StakedValue>
	unharvested: number
}

import BigNumber from 'bignumber.js'
import { StakePool } from '../../yaxis/type'

export interface Farm extends StakePool {
	id: string
	lpToken: string
	lpTokenAddress: string
	earnToken: string
	earnTokenAddress: string
}

export const defaultFarm = {
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

export function farmFactory(farm?: Farm) {
	return { ...defaultFarm, ...farm }
}

export interface StakedValue extends Farm {
	totalSupply?: number
	poolWeight: BigNumber
	reserve?: number[]
	prices: any[]
	balance?: number
	tvl?: number
	lpPrice: number
}

export const defaultStakedValue: StakedValue = {
	...defaultFarm,
	totalSupply: 0,
	poolWeight: new BigNumber(0),
	reserve: [],
	prices: [],
	balance: 0,
	tvl: 0,
	lpPrice: 0,
}

export function stakedValueFactory(stakedValue?: StakedValue) {
	return { ...defaultStakedValue, ...stakedValue }
}

export interface FarmsContext {
	farms: Farm[]
	stakedValues: Array<StakedValue>
	unharvested: number
}

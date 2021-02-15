import { Contract } from 'web3-eth-contract'

export interface StakePool {
	pid: number
	active: boolean
	type: string
	liquidId: string
	lpAddress: string
	lpContract?: Contract
	tokenContract?: Contract
	lpTokens: {
		symbol: string
		decimals: number
		address?: string
		weight?: number
	}[]
	tokenAddress: string
	name: string
	symbol: string
	tokenSymbol: string
	icon: string
	lpUrl: string
}

export interface Config {
	contractAddresses: {
		multicall: string
		yaxis: string
		yaxisChef: string
		weth: string
		xYaxStaking: string
		yAxisMetaVault: string
		stableSwap3PoolConverter: string
		pickleChef: string
		pickleJar: string
	}
	pools: StakePool[]
	vault: {
		usdc: string
		dai: string
		usdt: string
		threeCrv: string
		metaVaultOpenTime: number
	}
	staking: {
		openTime: number
		strategy: string
	}
}

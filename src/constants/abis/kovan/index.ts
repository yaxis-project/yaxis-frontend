import { AbiItem } from 'web3-utils'

export const abis = {
	ERC20Abi: require('./erc20.json') as AbiItem[],
	ERC677Abi: require('./erc677.json') as AbiItem[],
	UNIV2PairAbi: require('./uni_v2_lp.json') as AbiItem[],
	BalancerAbi: require('./balancer.json') as AbiItem[],
	YaxisChefABI: require('./yaxis_chef.json') as AbiItem[],
	PickleChefABI: require('./pickleChef.json') as AbiItem[],
	PickleJarABI: require('./pickleJar.json') as AbiItem[],
	SwapABI: require('./swap.json') as AbiItem[],
	MulticallABI: require('./Multicall.json') as AbiItem[],
	XYaxStakingABI: require('./xYax.json') as AbiItem[],
	YAxisMetaVaultABI: require('./yAxisMetaVault.json') as AbiItem[],
	StableSwap3PoolConverterABI: require('./converter.json') as AbiItem[],
	RewardsABI: require('./Rewards.json') as AbiItem[],
	UniswapRouterABI: require('./UniswapRouter.json') as AbiItem[],
	Curve3poolABI: require('./Curve3Pool.json') as AbiItem[],
}

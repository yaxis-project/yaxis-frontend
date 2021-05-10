import { JsonFragment } from '@ethersproject/abi'

export const abis = {
	ERC20Abi: require('./erc20.json') as JsonFragment[],
	ERC677Abi: require('./erc677.json') as JsonFragment[],
	UNIV2PairAbi: require('./uni_v2_lp.json') as JsonFragment[],
	BalancerAbi: require('./balancer.json') as JsonFragment[],
	YaxisChefABI: require('./yaxis_chef.json') as JsonFragment[],
	PickleChefABI: require('./pickleChef.json') as JsonFragment[],
	PickleJarABI: require('./pickleJar.json') as JsonFragment[],
	SwapABI: require('./swap.json') as JsonFragment[],
	MulticallABI: require('./Multicall.json') as JsonFragment[],
	XYaxStakingABI: require('./xYax.json') as JsonFragment[],
	YAxisMetaVaultABI: require('./yAxisMetaVault.json') as JsonFragment[],
	StableSwap3PoolConverterABI: require('./converter.json') as JsonFragment[],
	RewardsABI: require('./Rewards.json') as JsonFragment[],
	UniswapRouterABI: require('./UniswapRouter.json') as JsonFragment[],
	Curve3poolABI: require('./Curve3Pool.json') as JsonFragment[],
}

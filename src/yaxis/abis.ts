import { AbiItem } from 'web3-utils'

export const abis = {
	ERC20Abi: require('./abi/erc20.json') as AbiItem[],
	UNIV2PairAbi: require('./abi/uni_v2_lp.json') as AbiItem[],
	BalancerAbi: require('./abi/balancer.json') as AbiItem[],
	WETHAbi: require('./abi/weth.json') as AbiItem[],
	YaxisChefABI: require('./abi/yaxis_chef.json') as AbiItem[],
	PickleChefABI: require('./abi/pickleChef.json') as AbiItem[],
	PickleJarABI: require('./abi/pickleJar.json') as AbiItem[],
	YaxisTokenABI: require('./abi/yaxis_token.json') as AbiItem[],
	MulticallABI: require('./abi/Multicall.json') as AbiItem[],
	XYaxABI: require('./abi/xYax.json') as AbiItem[],
	YaxisMetaVaultABI: require('./abi/yAxisMetaVault.json') as AbiItem[],
	ConverterABI: require('./abi/converter.json') as AbiItem[],
}

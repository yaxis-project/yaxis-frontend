import { AbiItem } from 'web3-utils'

export const abis = {
    ERC20Abi: require('./erc20.json') as AbiItem[],
    UNIV2PairAbi: require('./uni_v2_lp.json') as AbiItem[],
    BalancerAbi: require('./balancer.json') as AbiItem[],
    WETHAbi: require('./weth.json') as AbiItem[],
    YaxisChefABI: require('./yaxis_chef.json') as AbiItem[],
    PickleChefABI: require('./pickleChef.json') as AbiItem[],
    PickleJarABI: require('./pickleJar.json') as AbiItem[],
    YaxTokenABI: require('./yax_token.json') as AbiItem[],
    YaxisTokenABI: require('./yaxis_token.json') as AbiItem[],
    SwapABI: require('./swap.json') as AbiItem[],
    MulticallABI: require('./Multicall.json') as AbiItem[],
    XYaxABI: require('./xYax.json') as AbiItem[],
    YaxisMetaVaultABI: require('./yAxisMetaVault.json') as AbiItem[],
    ConverterABI: require('./converter.json') as AbiItem[],
    RewardsYaxisABI: require('./RewardsYaxis.json') as AbiItem[],
}

import { JsonFragment } from '@ethersproject/abi'

export const abis = {
	BalancerAbi: require('./balancer.json') as JsonFragment[],
	ControllerABI: require('./Controller.json') as JsonFragment[],
	CurvePoolABI: require('./CurvePool.json') as JsonFragment[],
	ERC20Abi: require('./erc20.json') as JsonFragment[],
	ERC677Abi: require('./erc677.json') as JsonFragment[],
	GaugeABI: require('./gauge.json') as JsonFragment[],
	GaugeControllerABI: require('./GaugeController.json') as JsonFragment[],
	ManagerABI: require('./Manager.json') as JsonFragment[],
	MerkleDistributorABI: require('./MerkleDistributor.json') as JsonFragment[],
	MinterABI: require('./minter.json') as JsonFragment[],
	MulticallABI: require('./Multicall.json') as JsonFragment[],
	PickleChefABI: require('./pickleChef.json') as JsonFragment[],
	PickleJarABI: require('./pickleJar.json') as JsonFragment[],
	RewardsABI: require('./Rewards.json') as JsonFragment[],
	StableSwap3PoolConverterABI: require('./converter.json') as JsonFragment[],
	SwapABI: require('./swap.json') as JsonFragment[],
	UniswapRouterABI: require('./UniswapRouter.json') as JsonFragment[],
	UNIV2PairAbi: require('./uni_v2_lp.json') as JsonFragment[],
	VaultABI: require('./vault.json') as JsonFragment[],
	VaultTokenABI: require('./VaultToken.json') as JsonFragment[],
	VaultHelperABI: require('./vaultHelper.json') as JsonFragment[],
	VotingEscrowABI: require('./votingEscrow.json') as JsonFragment[],
	XYaxStakingABI: require('./xYax.json') as JsonFragment[],
	YaxisChefABI: require('./yaxis_chef.json') as JsonFragment[],
	YAxisMetaVaultABI: require('./yAxisMetaVault.json') as JsonFragment[],
}

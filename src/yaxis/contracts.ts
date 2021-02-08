import {Contract} from 'web3-eth-contract';
import Web3 from 'web3'
import {Config, StakePool} from "./type";
import {configs} from "./configs";
import {abis} from "./abis";

export class Contracts {
	public yaxis: Contract;
	public yaxisChef: Contract;
	public pickleChef: Contract;
	public pickleJar: Contract;
	public xYaxStaking: Contract;
	public yaxisMetaVault: Contract;
	public weth: Contract;
	public pools: StakePool[] = [];
	private config: Config;
	public multicall: Contract;
	public vaultConverter: Contract;
	public vault: {
		usdc: Contract,
		dai: Contract,
		usdt: Contract,
		threeCrv: Contract,
	}

	constructor(provider: any, networkId: number, public web3: Web3) {

		this.yaxis = new this.web3.eth.Contract(abis.YaxisTokenABI)

		this.yaxisChef = new this.web3.eth.Contract(abis.YaxisChefABI)
		this.pickleChef = new this.web3.eth.Contract(abis.PickleChefABI)
		this.pickleJar = new this.web3.eth.Contract(abis.PickleJarABI)

		this.xYaxStaking = new this.web3.eth.Contract(abis.XYaxABI)
		this.yaxisMetaVault = new this.web3.eth.Contract(abis.YaxisMetaVaultABI)
		this.multicall = new this.web3.eth.Contract(abis.MulticallABI)
		this.vaultConverter = new this.web3.eth.Contract(abis.ConverterABI)
		this.vault = {
			usdc: new this.web3.eth.Contract(abis.ERC20Abi),
			usdt: new this.web3.eth.Contract(abis.ERC20Abi),
			dai: new this.web3.eth.Contract(abis.ERC20Abi),
			threeCrv: new this.web3.eth.Contract(abis.ERC20Abi),
		}
		this.weth = new this.web3.eth.Contract(abis.WETHAbi)
		this.config = configs[networkId]
		for (let index = 0; index < this.config.pools.length; index++) {
			let stakePool = this.config.pools[index];
			stakePool.lpContract = new this.web3.eth.Contract((stakePool.type === "balancer" ? abis.BalancerAbi : abis.UNIV2PairAbi));
			stakePool.tokenContract = new this.web3.eth.Contract(abis.ERC20Abi)
			this.pools.push(stakePool);
		}
		this.setProvider(provider, networkId)
		this.setDefaultAccount(this.web3.eth.defaultAccount)
	}

	setProvider(provider: any, networkId: number) {
		const setProvider = (contract: any, address: string) => {
			contract.setProvider(provider)
			if (address) contract.options.address = address
			else console.error('Contract address not found in network', networkId)
		}

		setProvider(this.yaxis, this.config.contractAddresses.yaxis)
		setProvider(this.yaxisChef, this.config.contractAddresses.yaxisChef)
		setProvider(this.weth, this.config.contractAddresses.weth)
		setProvider(this.multicall, this.config.contractAddresses.multicall)
		setProvider(this.xYaxStaking, this.config.contractAddresses.xYaxStaking)
		setProvider(this.yaxisMetaVault, this.config.contractAddresses.yAxisMetaVault)
		setProvider(this.vaultConverter, this.config.contractAddresses.stableSwap3PoolConverter)
		setProvider(this.pickleChef, this.config.contractAddresses.pickleChef)
		setProvider(this.pickleJar, this.config.contractAddresses.pickleJar)

		setProvider(this.vault.usdc, this.config.vault.usdc)
		setProvider(this.vault.usdt, this.config.vault.usdt)
		setProvider(this.vault.dai, this.config.vault.dai)
		setProvider(this.vault.threeCrv, this.config.vault.threeCrv)

		this.pools.forEach(
			({lpContract, lpAddress, tokenContract, tokenAddress}) => {
				setProvider(lpContract, lpAddress)
				setProvider(tokenContract, tokenAddress)
			},
		)
	}

	setDefaultAccount(account: string) {
		this.yaxis.options.from = account
		this.yaxisChef.options.from = account
	}
}

import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { Contracts } from './contracts'
import { configs } from './configs'

BigNumber.config({
	EXPONENTIAL_AT: 1000,
	DECIMAL_PLACES: 80,
})

export class Yaxis {
	public web3: Web3
	public contracts: Contracts
	public yaxisAddress: string
	public yaxisChefAddress: string
	public wethAddress: string
	public networkId: number

	constructor(provider: any, networkId: number, options: any) {
		var realProvider

		if (typeof provider === 'string') {
			if (provider.includes('wss')) {
				realProvider = new Web3.providers.WebsocketProvider(
					provider,
					options.ethereumNodeTimeout || 10000,
				)
			} else {
				realProvider = new Web3.providers.HttpProvider(
					provider,
					options.ethereumNodeTimeout || 10000,
				)
			}
		} else {
			realProvider = provider
		}

		this.web3 = new Web3(realProvider)
		if (options.defaultAccount) {
			this.web3.eth.defaultAccount = options.defaultAccount
		}
		let config = configs[networkId]
		const contractAddresses = config.contractAddresses
		this.contracts = new Contracts(realProvider, networkId, this.web3)
		this.yaxisAddress = contractAddresses.yaxis
		this.yaxisChefAddress = contractAddresses.yaxisChef
		this.wethAddress = contractAddresses.weth
	}

	setProvider(provider: any, networkId: number) {
		this.web3.setProvider(provider)
		this.contracts.setProvider(provider, networkId)
		this.networkId = networkId
	}

	setDefaultAccount(account: string) {
		this.web3.eth.defaultAccount = account
		this.contracts.setDefaultAccount(account)
	}

	getDefaultAccount() {
		return this.web3.eth.defaultAccount
	}

	toBigN(a: any) {
		return new BigNumber(a)
	}
}

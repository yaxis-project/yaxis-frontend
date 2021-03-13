import Web3 from 'web3'
import { provider as Provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import BigNumber from 'bignumber.js'
import { Yaxis } from '../yaxis/Yaxis'
import { abis } from '../yaxis/abis'

export const getContract = (provider: Provider, address?: string) => {
	const web3 = new Web3(provider)
	return new web3.eth.Contract(abis.ERC20Abi, address)
}

export const getAllowance = async (
	lpContract: Contract,
	spender: string,
	account: string,
): Promise<string> => {
	try {
		const allowance: string = await lpContract.methods
			.allowance(account, spender)
			.call()
		return allowance
	} catch (e) {
		return '0'
	}
}

export const getBalance = async (
	provider: Provider,
	tokenAddress: string,
	userAddress: string,
): Promise<string> => {
	const lpContract = getContract(provider, tokenAddress)
	try {
		const balance: string = await lpContract.methods
			.balanceOf(userAddress)
			.call()
		return balance
	} catch (e) {
		return '0'
	}
}
export const getAllowances = async (
	yaxis: Yaxis,
	mutilcall: Contract,
	tokens: string[],
	owner: string,
	spender: string,
): Promise<BigNumber[]> => {
	const calls: any[] = []
	const testToken = getContract(yaxis?.web3?.currentProvider)
	tokens.forEach((token) => {
		calls.push([
			token,
			testToken.methods.allowance(owner, spender).encodeABI(),
		])
	})
	try {
		const response = await mutilcall.methods.aggregate(calls).call()
		return response[1].map((value: any) => {
			// @ts-ignore
			let decodeUint256 = yaxis.web3.eth.abi.decodeParameter(
				'uint256',
				value,
			) as string
			return new BigNumber(decodeUint256)
		})
	} catch (e) {
		console.error('Error when get allowances')
		return Promise.reject(e)
	}
}
export const getBalances = async (
	yaxis: Yaxis,
	mutilcall: Contract,
	tokens: string[],
	owner: string,
): Promise<BigNumber[]> => {
	const calls: any[] = []
	const testToken = getContract(yaxis.web3.currentProvider)
	tokens.forEach((token) => {
		calls.push([token, testToken.methods.balanceOf(owner).encodeABI()])
	})
	try {
		const response = await mutilcall.methods.aggregate(calls).call()
		return response[1].map((value: any) => {
			// @ts-ignore
			let decodeUint256 = yaxis.web3.eth.abi.decodeParameter(
				'uint256',
				value,
			) as string
			return new BigNumber(decodeUint256)
		})
	} catch (e) {
		console.error('Error when get balances', e)
		return Promise.reject(e)
	}
}

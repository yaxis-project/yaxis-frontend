import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Contract } from 'web3-eth-contract'
import { Yaxis } from './Yaxis'
import { getApy } from '../utils/number'
import { Farm, StakedValue, stakedValueFactory } from '../contexts/Farms/types'

BigNumber.config({
	EXPONENTIAL_AT: 1000,
	DECIMAL_PLACES: 80,
})

export function collapseDecimals(value: any, decimal = 18) {
	return value
		? new BigNumber(value).div(new BigNumber(10).pow(decimal)).toString()
		: '0'
}

export function numberToFloat(value: any, decimal = 18, fixNumber = 3) {
	return Number(
		new BigNumber(value)
			.div(new BigNumber(10).pow(decimal))
			.toFixed(fixNumber),
	)
}

export function getCurrentUnixTime() {
	return Math.floor(new Date().getTime() / 1000)
}

export function numberToDecimal(value: any, decimal = 18): string {
	return new BigNumber(value).times(new BigNumber(10).pow(decimal)).toFixed()
}

export const getYaxisChefAddress = (yaxis: Yaxis) => {
	return yaxis && yaxis.yaxisChefAddress
}
export const getYaxisAddress = (yaxis: Yaxis) => {
	return yaxis && yaxis.yaxisAddress
}
export const getWethContract = (yaxis: Yaxis) => {
	return yaxis && yaxis.contracts && yaxis.contracts.weth
}

export const getYaxisPrice = (stakedValue: any, farms: any[]) => {
	const yaxisIndex = farms.findIndex(
		({ tokenSymbol }) => tokenSymbol === 'YAX',
	)
	return yaxisIndex >= 0 && stakedValue[yaxisIndex]
		? new BigNumber(stakedValue[yaxisIndex].prices[0])
		: new BigNumber(0)
}
export const getYaxisChefContract = (yaxis: Yaxis) => {
	return yaxis && yaxis.contracts && yaxis.contracts.yaxisChef
}
export const getYaxisContract = (yaxis: Yaxis) => {
	return yaxis && yaxis.contracts && yaxis.contracts.yaxis
}
export const getMutilcallContract = (yaxis: Yaxis) => {
	return yaxis && yaxis.contracts && yaxis.contracts.multicall
}
export const getYaxisMetaVault = (yaxis: Yaxis) => {
	return yaxis && yaxis.contracts && yaxis.contracts.yaxisMetaVault
}
export const getYaxisMetaVaultConverter = (yaxis: Yaxis) => {
	return yaxis && yaxis.contracts && yaxis.contracts.vaultConverter
}

export const getFarms = (yaxis: Yaxis): Farm[] => {
	return yaxis
		? yaxis.contracts.pools.map((pool) => {
			return {
				...pool,
				id: pool.symbol,
				lpToken: pool.symbol,
				lpTokenAddress: pool.lpAddress,
				earnToken: 'YAX',
				earnTokenAddress: yaxis.contracts.yaxis.options.address,
			}
		})
		: []
}

export const getPoolWeight = async (
	yaxisChefContract: Contract,
	pid: number,
) => {
	const { allocPoint } = await yaxisChefContract.methods.poolInfo(pid).call()
	const totalAllocPoint = await yaxisChefContract.methods
		.totalAllocPoint()
		.call()
	return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}
export const getTotalStaking = async (yaxis: Yaxis) => {
	return new BigNumber(
		await yaxis.contracts.xYaxStaking.methods.availableBalance().call(),
	)
}
export const getXSushiStakingContract = (yaxis: Yaxis) => {
	return yaxis && yaxis.contracts && yaxis.contracts.xYaxStaking
}

export const getEarned = async (
	yaxisChefContract: Contract,
	pid: number,
	account: string,
) => {
	if (!pid) return 0
	return yaxisChefContract.methods.pendingYaxis(pid, account).call()
}

async function getLinkPoolInfo(
	priceMap: any,
	farm: Farm,
): Promise<StakedValue> {
	const lpContract = farm.lpContract
	const reserveTokens = farm.lpTokens
	const {
		_reserve0,
		_reserve1,
	} = await lpContract.methods.getReserves().call()
	const reserve = [
		numberToFloat(_reserve0, reserveTokens[0].decimals),
		numberToFloat(_reserve1, reserveTokens[1].decimals),
	]
	let totalSupply = numberToFloat(
		await lpContract.methods.totalSupply().call(),
	)

	// // const balance = numberToFloat(await lpContract.methods
	// // 	.balanceOf(yaxisChefContract.options.address)
	// // 	.call())
	const prices = [
		priceMap[reserveTokens[0].symbol],
		priceMap[reserveTokens[1].symbol],
	]
	if (prices[1]) {
		prices[0] = (prices[1] * reserve[1]) / reserve[0]
	} else if (prices[0]) {
		prices[1] = (prices[0] * reserve[0]) / reserve[1]
	}
	const totalLpValue = reserve[0] * prices[0] + reserve[1] * prices[1]
	const lpPrice = new BigNumber(totalLpValue).div(totalSupply).toNumber()
	const tvl = totalLpValue
	return {
		...farm,
		totalSupply,
		reserve,
		balance: 0,
		prices,
		lpPrice,
		tvl,
		poolWeight: new BigNumber(1),
	}
}

async function getUniPoolInfo(
	yaxisChefContract: Contract,
	priceMap: any,
	farm: Farm,
): Promise<StakedValue> {
	const lpContract = farm.lpContract
	const reserveTokens = farm.lpTokens
	const pid = farm.pid
	const {
		_reserve0,
		_reserve1,
	} = await lpContract.methods.getReserves().call()
	const reserve = [
		numberToFloat(_reserve0, reserveTokens[0].decimals),
		numberToFloat(_reserve1, reserveTokens[1].decimals),
	]
	let totalSupply = numberToFloat(
		await lpContract.methods.totalSupply().call(),
	)

	const balance = numberToFloat(
		await lpContract.methods
			.balanceOf(yaxisChefContract.options.address)
			.call(),
	)
	const prices = [
		priceMap[reserveTokens[0].symbol],
		priceMap[reserveTokens[1].symbol],
	]
	if (prices[1]) {
		prices[0] = (prices[1] * reserve[1]) / reserve[0]
	} else if (prices[0]) {
		prices[1] = (prices[0] * reserve[0]) / reserve[1]
	}
	const totalLpValue = reserve[0] * prices[0] + reserve[1] * prices[1]
	const lpPrice = new BigNumber(totalLpValue).div(totalSupply).toNumber()
	const tvl = balance * lpPrice
	return {
		...farm,
		totalSupply,
		reserve,
		balance,
		prices,
		lpPrice,
		tvl,
		poolWeight: await getPoolWeight(yaxisChefContract, pid),
	}
}

async function getBalPoolInfo(
	yaxisChefContract: Contract,
	priceMap: any,
	farm: Farm,
): Promise<StakedValue> {
	const lpContract = farm.lpContract
	const reserveTokens = farm.lpTokens
	const pid = farm.pid
	let totalSupply = numberToFloat(
		await lpContract.methods.totalSupply().call(),
	)

	const balance = numberToFloat(
		await lpContract.methods
			.balanceOf(yaxisChefContract.options.address)
			.call(),
	)

	const _reserve0 = await lpContract.methods
		.getBalance(reserveTokens[0].address)
		.call()
	const _reserve1 = await lpContract.methods
		.getBalance(reserveTokens[1].address)
		.call()
	const reserve = [
		numberToFloat(_reserve0, reserveTokens[0].decimals),
		numberToFloat(_reserve1, reserveTokens[1].decimals),
	]

	const prices = [
		priceMap[reserveTokens[0].symbol],
		priceMap[reserveTokens[1].symbol],
	]
	const weights = [reserveTokens[0].weight, reserveTokens[1].weight]

	if (prices[1]) {
		prices[0] =
			(prices[1] * reserve[1] * weights[0]) / (reserve[0] * weights[1])
	} else if (prices[0]) {
		prices[1] =
			(prices[0] * reserve[0] * weights[1]) / (reserve[1] * weights[0])
	}
	const totalLpValue = reserve[0] * prices[0] + reserve[1] * prices[1]
	const lpPrice = new BigNumber(totalLpValue).div(totalSupply).toNumber()
	const tvl = balance * lpPrice
	return {
		...farm,
		totalSupply,
		reserve,
		balance,
		prices,
		tvl,
		lpPrice,
		poolWeight: await getPoolWeight(yaxisChefContract, pid),
	}
}

export const getTotalLPWethValue = async (
	yaxisChefContract: Contract,
	wethContract: Contract,
	priceMap: any,
	farm: Farm,
): Promise<StakedValue> => {
	if (!farm.active) return stakedValueFactory()

	let type = farm.type || 'uni'
	if (type === 'balancer') {
		return await getBalPoolInfo(yaxisChefContract, priceMap, farm)
	}
	if (type === 'link') {
		return await getLinkPoolInfo(priceMap, farm)
	}
	return await getUniPoolInfo(yaxisChefContract, priceMap, farm)
}

export const approve = async (
	lpContract: Contract,
	yaxisChefContract: Contract,
	account: string,
) => {
	return lpContract.methods
		.approve(yaxisChefContract.options.address, ethers.constants.MaxUint256)
		.send({ from: account })
}

export const callApprove = async (
	erc20Contract: Contract,
	spender: string,
	account: string,
) => {
	return erc20Contract.methods
		.approve(spender, ethers.constants.MaxUint256)
		.send({ from: account })
}

export const getYaxisSupply = async (yaxis: Yaxis) => {
	return new BigNumber(
		await yaxis.contracts.yaxis.methods.totalSupply().call(),
	)
}

export const stake = async (
	yaxisChefContract: Contract,
	pid: number,
	amount: string,
	account: string,
) => {
	return yaxisChefContract.methods
		.deposit(
			pid,
			new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
		)
		.send({ from: account })
		.on('transactionHash', (tx: any) => {
			console.log(tx)
			return tx.transactionHash
		})
}

export const unstake = async (
	yaxisChefContract: Contract,
	pid: number,
	amount: string,
	account: string,
) => {
	return yaxisChefContract.methods
		.withdraw(
			pid,
			new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
		)
		.send({ from: account })
		.on('transactionHash', (tx: any) => {
			console.log(tx)
			return tx.transactionHash
		})
}
export const harvest = async (
	yaxisChefContract: Contract,
	pid: number,
	account: string,
) => {
	return yaxisChefContract.methods
		.deposit(pid, '0')
		.send({ from: account })
		.on('transactionHash', (tx: any) => {
			console.log(tx)
			return tx.transactionHash
		})
}

export const depositAll = async (
	yAxisMetaVault: Contract,
	params: any[],
	account: string,
) => {
	return yAxisMetaVault.methods.depositAll
		.apply(null, params)
		.send({ from: account })
		.on('transactionHash', (tx: any) => {
			console.log(tx)
			return tx.transactionHash
		})
}

export const withdraw = async (
	yAxisMetaVault: Contract,
	params: any[],
	account: string,
) => {
	return yAxisMetaVault.methods.withdraw
		.apply(null, params)
		.send({ from: account })
		.on('transactionHash', (tx: any) => {
			console.log(tx)
			return tx.transactionHash
		})
}

export const getStaked = async (
	yaxisChefContract: Contract,
	pid: number,
	account: string,
) => {
	try {
		const { amount } = await yaxisChefContract.methods
			.userInfo(pid, account)
			.call()
		return new BigNumber(amount)
	} catch {
		return new BigNumber(0)
	}
}

export const redeem = async (yaxisChefContract: Contract, account: string) => {
	let now = new Date().getTime() / 1000
	if (now >= 1597172400) {
		return yaxisChefContract.methods
			.exit()
			.send({ from: account })
			.on('transactionHash', (tx: any) => {
				console.log(tx)
				return tx.transactionHash
			})
	} else {
		alert('pool not active')
	}
}

/**
 * Generates yaxis YAX staking for amount. Note Amount is in units of Ether.
 * @param contract
 * @param amount
 * @param account
 */
export const enter = async (
	contract: Contract,
	amount: string,
	account: string,
) => {
	return contract.methods
		.enter(
			new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
		)
		.send({ from: account })
		.on('transactionHash', (tx: any) => {
			console.log(tx)
			return tx.transactionHash
		})
}

export const leave = async (
	contract: Contract,
	amount: string,
	account: string,
) => {
	return contract.methods
		.leave(
			new BigNumber(amount).times(new BigNumber(10).pow(18)).toFixed(0),
		)
		.send({ from: account })
		.on('transactionHash', (tx: any) => {
			console.log(tx)
			return tx.transactionHash
		})
}

export const getCurveApyApi = async () => {
	try {
		const { apy = {} } = await (
			await fetch('https://stats.curve.fi/raw-stats/apys.json')
		).json()
		return apy?.total && apy?.total['3pool']
			? parseFloat(apy?.total['3pool'])
			: 0
	} catch (e) {
		return 0
	}
}
export const getPickle3CrvAPY = async (
	contract: Contract,
	pickleJarContract: Contract,
	picklePrice: number,
	_3crvPrice: number,
	block: number,
) => {
	const [
		poolInfo,
		totalAllocPoint,
		picklePerBlock,
		multiplier,
		ratio,
		balance,
	]: any[] = await Promise.all([
		contract.methods.poolInfo(14).call(),
		contract.methods.totalAllocPoint().call(),
		contract.methods.picklePerBlock().call(),
		contract.methods.getMultiplier(block, block + 1).call(),
		pickleJarContract.methods.getRatio().call(),
		pickleJarContract.methods.balanceOf(contract.options.address).call(),
	])
	const tvl =
		numberToFloat(new BigNumber(balance).times(ratio).toNumber(), 18, 18) *
		_3crvPrice
	const rewardPerBlock = Number(
		collapseDecimals(new BigNumber(picklePerBlock).times(multiplier), 18),
	)
	let poolWeight = new BigNumber(poolInfo.allocPoint)
		.dividedBy(totalAllocPoint)
		.toNumber()
	let farmApy = getApy(tvl, picklePrice, rewardPerBlock, poolWeight)
	return farmApy
}

export function etherscanUrl(url: string, networkName: string) {
	const baseUrl = 'etherscan.io'
	const network = networkName === 'mainnet' ? '' : `${networkName}.`
	return `https://${network}${baseUrl}${url}`
}

type FormatBNOptions = {
	places?: number
	hideOnWhole?: boolean
	showDust?: boolean
}
export const formatBN = (BN: BigNumber, options?: FormatBNOptions) => {
	const { places = 2, hideOnWhole = true, showDust = false } = options

	const isWhole = BN.toString() === BN.toFixed(0).toString()
	const formattedString = Number(BN.toFixed(places)).toLocaleString(
		undefined, // leave undefined to use the browser's locale,
		// or use a string like 'en-US' to override it.
		{ minimumFractionDigits: places },
	)
	const split = BN.toString().split(".")
	if (hideOnWhole && isWhole) return split[0]
	if (showDust && split.length === 2 && !isWhole) {
		const dust = split[1].length
		if (dust > places) return formattedString.concat("..")
	}
	return formattedString

}

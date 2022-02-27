import BigNumber from 'bignumber.js/bignumber'
import { BigNumber as BN } from '@ethersproject/bignumber'

export const MAX_UINT = 2 ^ (256 - 1)

const ONE_MINUTE_IN_SECONDS = new BigNumber(60)
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60)
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24)
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365)

export const INTEGERS = {
	ONE_MINUTE_IN_SECONDS,
	ONE_HOUR_IN_SECONDS,
	ONE_DAY_IN_SECONDS,
	ONE_YEAR_IN_SECONDS,
	ZERO: new BigNumber(0),
	ONE: new BigNumber(1),
	ONES_31: new BigNumber('4294967295'), // 2**32-1
	ONES_127: new BigNumber('340282366920938463463374607431768211455'), // 2**128-1
	ONES_255: new BigNumber(
		'115792089237316195423570985008687907853269984665640564039457584007913129639935',
	), // 2**256-1
	INTEREST_RATE_BASE: new BigNumber('1e18'),
}

export function getApy(
	tvl: number,
	price: number,
	rewardPerBlock: number,
	poolWeight = 1,
): number {
	const BLOCKS_PER_YEAR = new BigNumber(2336000)

	if (tvl && price && rewardPerBlock && poolWeight) {
		return (
			new BigNumber(price)
				.times(rewardPerBlock)
				.times(BLOCKS_PER_YEAR)
				.times(poolWeight)
				.div(tvl)
				.toNumber() * 100
		)
	}
	return 0
}

// add 20%
export function calculateGasMargin(value: BN): BN {
	return value.mul(120).div(100)
}

type FormatBNOptions = {
	places?: number
	hideOnWhole?: boolean
	showDust?: boolean
}
export const formatBN = (BN: BigNumber, options: FormatBNOptions = {}) => {
	const { places = 2, hideOnWhole = true, showDust = false } = options

	const isWhole = BN.toString() === BN.toFixed(0).toString()
	const formattedString = Number(BN.toFixed(places)).toLocaleString(
		undefined, // leave undefined to use the browser's locale,
		// or use a string like 'en-US' to override it.
		{ minimumFractionDigits: places },
	)
	const split = BN.toString().split('.')
	if (hideOnWhole && isWhole) return split[0]
	if (showDust && split.length === 2 && !isWhole) {
		const dust = split[1].length
		if (dust > places) return formattedString.concat('..')
	}
	return formattedString
}

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

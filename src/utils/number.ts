import BigNumber from 'bignumber.js/bignumber'

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
	poolWeight: number = 1,
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

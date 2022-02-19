import BigNumber from 'bignumber.js'

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
	const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
	return displayBalance.toNumber()
}
export const mulPowNumber = (balance: BigNumber, decimals = 18) => {
	const displayBalance = balance.multipliedBy(new BigNumber(10).pow(decimals))
	return displayBalance.toNumber()
}
export const getDisplayBalance = (balance: BigNumber, decimals = 18) => {
	const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
	if (displayBalance.lt(1)) {
		return displayBalance.toPrecision(4)
	} else {
		return displayBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}
}

export const getFullDisplayBalance = (
	balance: BigNumber | string | number,
	decimals = 18,
) => {
	return new BigNumber(balance)
		.dividedBy(new BigNumber(10).pow(decimals))
		.toFixed()
}

export const abbrNumber = (_num: number, digits = 2) => {
	const num = _num
	const units = ['K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y']
	let decimal = 0
	if (_num < 1e3) {
		return _num.toFixed(3)
	}

	for (let i = units.length - 1; i >= 0; i--) {
		decimal = Math.pow(1000, i + 1)

		if (num <= -decimal || num >= decimal) {
			return +(num / decimal).toFixed(digits) + units[i]
		}
	}

	return num
}

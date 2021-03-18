import { defaultPriceMap } from './Prices'
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price'

export type Ticker =
	| 'YFI'
	| 'PICKLE'
	| 'BTC'
	| 'ETH'
	| 'LINK'
	| 'USDT'
	| 'YFV'
	| 'USDC'
	| 'WBTC'
	| 'crvRenWSBTC'
	| 'vUSD'
	| 'DAI'
	| 'aLINK'
	| 'YCURVE'
	| 'yCRV'
	| 'YAX'
	| 'Cure3Crv'
	| 'CRV'

type CoinGeckoID = string
const tokenCgkIdMap: Record<Ticker, CoinGeckoID> = {
	YFI: 'yearn-finance',
	PICKLE: 'pickle-finance',
	BTC: 'bitcoin',
	ETH: 'ethereum',
	LINK: 'chainlink',
	USDT: 'tether',
	YFV: 'yfv-finance',
	USDC: 'usd-coin',
	WBTC: 'wrapped-bitcoin',
	crvRenWSBTC: 'wrapped-bitcoin',
	vUSD: 'usd-coin',
	DAI: 'usd-coin',
	aLINK: 'aave-link',
	YCURVE: 'curve-fi-ydai-yusdc-yusdt-ytusd',
	yCRV: 'curve-fi-ydai-yusdc-yusdt-ytusd',
	YAX: 'yaxis',
	Cure3Crv: 'lp-3pool-curve',
	CRV: 'curve-dao-token',
}

export async function getCoinGeckoPrices() {
	let cgkIds = Object.values(tokenCgkIdMap).join(',')
	let prices = await (
		await fetch(`${COINGECKO_API}?vs_currencies=usd&ids=${cgkIds}`)
	).json()
	let priceMap = defaultPriceMap
	for (let [symbol, cgkId] of Object.entries(tokenCgkIdMap)) {
		const cgkPrice = prices[cgkId]?.usd
		if (cgkPrice) priceMap[symbol] = cgkPrice
	}
	return priceMap
}

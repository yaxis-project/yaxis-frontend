import { initialState } from './reducer'
import { Ticker } from '../../constants/type'

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price'

type CoinGeckoID = string
const tokenCgkIdMap: { [key in Ticker]: CoinGeckoID } = {
	link: 'chainlink',
	wbtc: 'wrapped-bitcoin',
	mim: 'magic-internet-money',
	cvx: 'convex-finance',
	eth: 'ethereum',
	usdt: 'tether',
	usdc: 'usd-coin',
	dai: 'dai',
	yaxis: 'yaxis',
	'3crv': 'lp-3pool-curve',
	weth: 'weth',
	yax: '',
	btc: 'bitcoin',
	crv: 'curve-dao-token',
	mvlt: '',
}

export async function getCoinGeckoPrices() {
	let cgkIds = Object.values(tokenCgkIdMap)
		.filter((id) => !!id)
		.join(',')
	let prices = await (
		await fetch(`${COINGECKO_API}?vs_currencies=usd&ids=${cgkIds}`)
	).json()
	let priceMap = { ...initialState.prices }
	for (let [symbol, cgkId] of Object.entries(tokenCgkIdMap)) {
		const cgkPrice = prices[cgkId]?.usd
		if (cgkPrice) priceMap[symbol] = cgkPrice
	}
	return priceMap
}

import { Ticker } from '../../constants/type/ethereum'

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
	mim3crv: '',
	rencrv: '',
	alethcrv: '',
	linkcrv: '',
	spell: 'spell-token',
	aleth: 'alchemix-eth',
	frax: 'frax',
	crvcvxeth: '',
	crv3crypto: '',
	frax3crv: '',
}

export async function getCoinGeckoPrices() {
	const cgkIds = Object.values(tokenCgkIdMap)
		.filter((id) => !!id)
		.join(',')
	const prices = await (
		await fetch(`${COINGECKO_API}?vs_currencies=usd&ids=${cgkIds}`)
	).json()
	const priceMap = {}
	for (const [symbol, cgkId] of Object.entries(tokenCgkIdMap)) {
		const cgkPrice = prices[cgkId]?.usd
		if (cgkPrice) priceMap[symbol] = cgkPrice
	}
	return priceMap
}

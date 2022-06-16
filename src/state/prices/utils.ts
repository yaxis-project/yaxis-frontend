import { Ticker } from '../../constants/type'

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price'

type CoinGeckoID = string
const tokenCgkIdMap: { [key in Ticker]: CoinGeckoID } = {
	// Ethereum
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
	// Avalanche
	avax: 'avalanche-2',
	wavax: 'wrapped-avax',
	joe: 'joe',
	av3crv: '',
	atricrypto: '',
	avwavax: '',
	joewavax: '',
	wethavax: '',
	usdcusdc: '',
	avaxlink: '',
	avaxusdt: '',
	avaxptp: '',
	avaxgohm: '',
	avaxsavax: '',
	avaxwbtc: '',
	usdcjoe: '',
	avaxusdc: '',
	steth: '',
	stethcrv: '',
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

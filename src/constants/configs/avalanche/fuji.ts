import {
	Config,
	CurrenciesConfig,
	ExternalConfig,
	ExternalPoolsConfig,
} from '../../type'

const currencies: CurrenciesConfig = {
	ERC20: {
		crv: '',
		wbtc: '',
		link: '',
		mim: '',
		cvx: '',
		yax: '',
		usdc: '',
		dai: '',
		usdt: '',
		'3crv': '',
		weth: '',
		mvlt: '',
		spell: '',
	},
	ERC677: {
		yaxis: '',
	},
}

const external: ExternalConfig = {
	multicall: '',
	pickleChef: '',
	pickleJar: '',
	uniswapRouter: '',
	gaugeController: '',
}

const externalPools: ExternalPoolsConfig = {
	curve: {
		mim3crv: {
			currency: '',
			pool: '',
			token: '',
			gauge: '',
			convexRewards: '',
			extraRewards: {
				spell: {
					contract: '',
					token: '',
				},
			},
		},
		rencrv: {
			currency: '',
			pool: '',
			token: '',
			gauge: '',
			convexRewards: '',
		},
		alethcrv: {
			currency: '',
			pool: '',
			token: '',
			gauge: '',
			convexRewards: '',
		},
		linkcrv: {
			currency: '',
			pool: '',
			token: '',
			gauge: '',
			convexRewards: '',
		},
		'3pool': {
			currency: '',
			pool: '',
			token: '',
			gauge: '',
			convexRewards: '',
		},
	},
}

const mainnet: Config = {
	internal: {
		// Current
		manager: '',
		controller: '',
		vaultHelper: '',
		minter: '',
		minterWrapper: '',
		stableSwap3PoolConverter: '',
		votingEscrow: '',
		gaugeController: '',
		merkleDistributor: '',
		feeDistributor: '',
		// Legacy
		swap: '',
		yaxisChef: '',
		xYaxStaking: '',
		yAxisMetaVault: '',
	},
	rewards: {
		MetaVault: '',
		Yaxis: '',
		'Uniswap YAXIS/ETH': '',
	},
	vaults: {
		usd: {
			url: '',
			tokenPoolContract: externalPools.curve.mim3crv.pool,
			token: '',
			tokenContract: externalPools.curve.mim3crv.token,
			vault: '',
			vaultToken: 'CV:',
			vaultTokenContract: '',
			gauge: '',
		},
		btc: {
			url: '',
			tokenPoolContract: externalPools.curve.rencrv.pool,
			token: '',
			tokenContract: externalPools.curve.rencrv.token,
			vault: '',
			vaultToken: 'CV:',
			vaultTokenContract: '',
			gauge: '',
		},
		eth: {
			url: '',
			tokenPoolContract: externalPools.curve.alethcrv.pool,
			token: '',
			tokenContract: externalPools.curve.alethcrv.token,
			vault: '',
			vaultToken: 'CV:',
			vaultTokenContract: '',
			gauge: '',
		},
		link: {
			url: '',
			tokenPoolContract: externalPools.curve.linkcrv.pool,
			token: '',
			tokenContract: externalPools.curve.linkcrv.token,
			vault: '',
			vaultToken: 'CV:',
			vaultTokenContract: '',
			gauge: '',
		},
		yaxis: {
			url: '',
			tokenPoolContract: '',
			token: '',
			tokenContract: '',
			vault: '',
			vaultToken: '',
			vaultTokenContract: currencies.ERC677.yaxis,
			gauge: '',
		},
	},
	pools: {
        // TODO: rework
        'Uniswap YAXIS/ETH': {
			active: true,
			legacy: false,
			type: 'uniswap',
			liquidId: `${currencies.ERC677.yaxis}/ETH`,
			lpAddress: '0xF0E3FdF48661CD10d56692f60BD4eCcd01E9CF64',
			lpUrl: `https://app.uniswap.org/#/add/v2/ETH/${currencies.ERC677.yaxis}`,
			lpTokens: [
				{
					tokenId: 'yaxis',
				},
				{
					tokenId: 'eth',
				},
			],
			tokenAddress: currencies.ERC677.yaxis,
			name: 'Uniswap YAXIS/ETH',
			symbol: 'YAXIS/ETH UNI-V2 LP',
			tokenSymbol: 'YAXIS_ETH_UNISWAP_LP',
			icon: '',
			rewards: 'Uniswap YAXIS/ETH',
		},
		'Uniswap YAX/ETH': {
			legacy: true,
			pid: 6,
			active: true,
			type: 'uniswap',
			liquidId: `${currencies.ERC20.yax}/ETH`,
			lpAddress: '0x1107b6081231d7f256269ad014bf92e041cb08df',
			lpUrl: `https://app.uniswap.org/#/add/v2/ETH/${currencies.ERC20.yax}`,
			lpTokens: [
				{
					tokenId: 'yax',
				},
				{
					tokenId: 'eth',
				},
			],
			tokenAddress: currencies.ERC20.yax,
			name: 'Uniswap YAX/ETH',
			symbol: 'YAX/ETH UNI-V2 LP',
			tokenSymbol: 'YAX_ETH_UNISWAP_LP',
			icon: '',
		},
		'Linkswap YAX/ETH': {
			legacy: true,
			pid: null,
			active: true,
			type: 'linkswap',
			liquidId: `${currencies.ERC20.yax}/ETH`,
			lpAddress: '0x21dee38170F1e1F26baFf2C30C0fc8F8362b6961',
			lpUrl: `https://linkswap.app/#/add/${currencies.ERC20.yax}/ETH`,
			lpTokens: [
				{
					tokenId: 'yax',
				},
				{
					tokenId: 'eth',
				},
			],
			tokenAddress: currencies.ERC20.yax,
			name: 'Linkswap YAX/ETH',
			symbol: 'YAX/ETH LINKSWAP LP',
			tokenSymbol: 'YAX_ETH_LINKSWAP_LP',
			icon: '',
		},
	},
	currencies,
	external,
	externalPools,
}

export default mainnet

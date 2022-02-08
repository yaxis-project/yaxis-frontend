import {
	Config,
	CurrenciesConfig,
	ExternalConfig,
	ExternalPoolsConfig,
} from '../../type/ethereum'

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
		frax: ''
	},
	ERC677: {
		yaxis: '0x55853edc67aa68ec2e3903ac00f2bc5bf2ca8db0',
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
		crv3crypto: {
			currency: '',
			pool: '',
			token: '',
			gauge: '',
			convexRewards: '',
		},
		crvcvxeth: {
			currency: '',
			pool: '',
			token: '',
			gauge: '',
			convexRewards: '',
		},
		frax3crv: {
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
		manager: '0x16Fe974Ac6E594C54971abC3D52642A7f25Eb2d9',
		controller: '0xF25bB60Ae2b8af55091Da5DfDB4d3Ded65692168',
		vaultHelper: '0xE41492B7cA12D3f8a453cd027096B1a3D1D256B0',
		minter: '0x5eeE22c1C3C8F7816989c370a18ccF38206e11a3',
		minterWrapper: '0xeB690B7c96eA5f803fc0a68B6709F558dc78862C',
		stableSwap3PoolConverter: '',
		votingEscrow: '0xfCC55AEadf4547cC599f4AaC35Ba29DE446ED90F',
		gaugeController: '0x451F3A4685f418Abcb6Ba94c7a7b45aEcDfd4Df3',
		feeDistributor: '0x181cB46c9E189bE76429aB18DEA5f8332Ce4Baf7',
		// Legacy
		merkleDistributor: '',
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
		cvx: {
			url: '',
			tokenPoolContract: externalPools.curve.crvcvxeth.pool,
			token: '',
			tokenContract: externalPools.curve.crvcvxeth.token,
			vault: '',
			vaultToken: 'CV:CVX',
			vaultTokenContract: '',
			gauge: '',
		},
		tricrypto: {
			url: '',
			tokenPoolContract: externalPools.curve.crv3crypto.pool,
			token: '',
			tokenContract: externalPools.curve.crv3crypto.token,
			vault: '',
			vaultToken: 'CV:TRICRYPTO',
			vaultTokenContract: '',
			gauge: '',
		},
		frax: {
			url: '',
			tokenPoolContract: externalPools.curve.frax3crv.pool,
			token: '',
			tokenContract: externalPools.curve.frax3crv.token,
			vault: '',
			vaultToken: 'CV:FRAX',
			vaultTokenContract: '',
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

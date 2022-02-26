import {
	AvalancheConfig,
	AvalancheCurrenciesConfig,
	AvalancheExternalConfig,
	AvalancheExternalPoolsConfig,
} from '../../type/avalanche'

const currencies: AvalancheCurrenciesConfig = {
	ERC20: {
		crv: '0x249848beca43ac405b8102ec90dd5f22ca513c06',
		// wbtc: '',
		// link: '',
		// mim: '',
		// cvx: '',
		// yax: '',
		// usdc: '',
		// dai: '',
		// usdt: '',
		// '3crv': '',
		// weth: '',
		// mvlt: '',
		// spell: '',
		// frax: '',
		wavax: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
		joe: '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd',
	},
	ERC677: {
		yaxis: '0x55853edc67aa68ec2e3903ac00f2bc5bf2ca8db0',
	},
}

const external: AvalancheExternalConfig = {
	multicall: '0x98e2060F672FD1656a07bc12D7253b5e41bF3876',
	// pickleChef: '',
	// pickleJar: '',
	// uniswapRouter: '',
	gaugeController: '0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB',
}

const externalPools: AvalancheExternalPoolsConfig = {
	curve: {
		av3crv: {
			currency: '',
			pool: '0x7f90122BF0700F9E7e1F688fe926940E8839F353',
			token: '0x1337BedC9D22ecbe766dF105c9623922A27963EC',
			gauge: '0x5B5CFE992AdAC0C9D48E05854B2d91C73a003858',
			convexRewards: '',
		},
		atricrypto: {
			currency: '',
			pool: '0xB755B949C126C04e0348DD881a5cF55d424742B2',
			token: '0x1daB6560494B04473A0BE3E7D83CF3Fdf3a51828',
			gauge: '0x445FE580eF8d70FF569aB36e80c647af338db351',
			convexRewards: '',
		},
	},
	// aave: {
	// 	avax: {
	// 		currency: '',
	// 		pool: '',
	// 		token: '',
	// 		gauge: '',
	// 		convexRewards: '',
	// 	},
	// },
}

const fuji: AvalancheConfig = {
	internal: {
		// Current
		manager: '',
		controller: '',
		vaultHelper: '',
		minter: '',
		minterWrapper: '',
		votingEscrow: '',
		gaugeController: '',
		feeDistributor: '',
	},
	rewards: {
		'TraderJoe JOE/AVAX': '',
	},
	vaults: {
		usd: {
			url: 'https://avax.curve.fi/aave',
			tokenPoolContract: externalPools.curve.av3crv.pool,
			token: 'av3CRV',
			tokenContract: externalPools.curve.av3crv.token,
			vault: '0x9261528CedDC2454dF4A240396724baE19EF0977',
			vaultToken: 'CV:AV3CRV',
			vaultTokenContract: '',
			gauge: '',
		},
		tricrypto: {
			url: 'https://avax.curve.fi/atricrypto',
			tokenPoolContract: externalPools.curve.atricrypto.pool,
			token: '',
			tokenContract: externalPools.curve.atricrypto.token,
			vault: '',
			vaultToken: 'CV:',
			vaultTokenContract: '',
			gauge: '',
		},
		// avax: {
		// 	url: 'https://app.aave.com/#/deposit',
		// 	tokenPoolContract: externalPools.aave.avax.pool,
		// 	token: '',
		// 	tokenContract: externalPools.aave.avax.token,
		// 	vault: '',
		// 	vaultToken: 'CV:',
		// 	vaultTokenContract: '',
		// 	gauge: '',
		// },
	},
	pools: {
		// TODO: rework
		'TraderJoe JOE/AVAX': {
			active: true,
			legacy: false,
			type: 'traderjoe',
			liquidId: `JOE/${currencies.ERC677.yaxis}`,
			lpAddress: '0x12b6298a70e2ae1b1352e051237703a3acbef8b4',
			lpUrl: 'https://traderjoexyz.com/farm/0x454E67025631C065d3cFAD6d71E6892f74487a15-0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00',
			lpTokens: [
				{
					tokenId: 'joe',
				},
				{
					tokenId: 'yaxis',
				},
			],
			tokenAddress: currencies.ERC677.yaxis,
			name: 'TraderJoe JOE/AVAX',
			symbol: 'TraderJoe JOE-AVAX',
			tokenSymbol: 'YAXIS_ETH_UNISWAP_LP',
			icon: '',
			rewards: 'TraderJoe JOE/AVAX',
		},
	},
	currencies,
	external,
	externalPools,
}

export default fuji

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

const mainnet: AvalancheConfig = {
	internal: {
		// Current
		manager: '0x90a21f77C590dE56Da313184b99bE351D54391d0',
		controller: '0x39054d4403691Cc28CcaB0A7c587cecd15aAc5FF',
		vaultHelper: '0x05EDf20b2118166a5Ea043ca42f0f7E467bAfec5',
		minter: '0x8d43a0952468C68060d21dC8EBa5494EccD05D4D',
		minterWrapper: '0xb7Bad9c8eeDecA186cbDe947D414b3865E090422',
		votingEscrow: '0x1c130c9C65D85545C7C969FEc04EE9b209F7cCcF',
		gaugeController: '0xd958Fb00374d3c72e9cc493DB530090dab60a5De',
		feeDistributor: '0x31fB936e455145208812Aa5d03FCC6aCE6e1047b',
	},
	rewards: {
		'TraderJoe JOE/AVAX': '0x60552c4EEAf57d37176cEce52c3082B27e731398',
	},
	vaults: {
		usd: {
			url: 'https://avax.curve.fi/aave',
			tokenPoolContract: externalPools.curve.av3crv.pool,
			token: 'AV3CRV',
			tokenContract: externalPools.curve.av3crv.token,
			vault: '0x77312C5dC9CaBc981f5C149a356281A022572eCF',
			vaultToken: 'CV:AV3CRV',
			vaultTokenContract: '0x37D3f7257ae996d5c1FeEE560386C1ABaE807FdF',
			gauge: '0x0cc2aF9D57Abf1FC03C08adBDf4B88dfBAa218BF',
		},
		tricrypto: {
			url: 'https://avax.curve.fi/atricrypto',
			tokenPoolContract: externalPools.curve.atricrypto.pool,
			token: 'ATRICRYPTO',
			tokenContract: externalPools.curve.atricrypto.token,
			vault: '0xDF2Dd0326C7a0fAf56bc92b1305957042991EA3A',
			vaultToken: 'CV:ATRICRYPTO',
			vaultTokenContract: '0xE1C86563B41e155AFa9539650DD18B5d5B244807',
			gauge: '0x6A140de006f1EA9E01056DCbE0CDF465884f03db',
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

export default mainnet

import {
	AvalancheConfig,
	AvalancheCurrenciesConfig,
	AvalancheExternalConfig,
	AvalancheExternalPoolsConfig,
} from '../../type/avalanche'

const currencies: AvalancheCurrenciesConfig = {
	ERC20: {
		crv: '0x47536F17F4fF30e64A96a7555826b8f9e66ec468',
		wbtc: '0x50b7545627a5162F82A992c33b87aDc75187B218',
		// link: '',
		// mim: '',
		// cvx: '',
		// yax: '',
		usdc: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
		dai: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
		usdt: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
		// '3crv': '',
		weth: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
		// mvlt: '',
		// spell: '',
		// frax: '',
		wavax: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
		joe: '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd',
	},
	ERC677: {
		yaxis: '0x55853edc67aa68ec2e3903ac00f2bc5bf2ca8db0',
	},
}

const external: AvalancheExternalConfig = {
	multicall: '0x98e2060F672FD1656a07bc12D7253b5e41bF3876',
	gaugeController: '0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB',
	// joeRouter: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
	// joeMasterChef: '0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00',
	// aaveLendingPool: '0x4F01AeD16D97E3aB5ab2B501154DC9bb0F1A5A2C',
	// aaveRewards: '0x01D83Fe6A10D2f2B7AF17034343746188272cAc9',
}

const externalPools: AvalancheExternalPoolsConfig = {
	curve: {
		av3crv: {
			currency: 'usd',
			pool: '0x7f90122BF0700F9E7e1F688fe926940E8839F353',
			token: '0x1337BedC9D22ecbe766dF105c9623922A27963EC',
			gauge: '0x5B5CFE992AdAC0C9D48E05854B2d91C73a003858',
			convexRewards: '',
		},
		atricrypto: {
			currency: 'usd',
			pool: '0xB755B949C126C04e0348DD881a5cF55d424742B2',
			token: '0x1daB6560494B04473A0BE3E7D83CF3Fdf3a51828',
			gauge: '0x445FE580eF8d70FF569aB36e80c647af338db351',
			convexRewards: '',
		},
		aawbtcrencrv: {
			currency: 'usd',
			pool: '0x16a7DA911A4DD1d83F3fF066fE28F3C792C50d90',
			token: '0xC2b1DF84112619D190193E48148000e3990Bf627',
			gauge: '0x0f9cb53Ebe405d49A0bbdBD291A65Ff571bC83e1',
			convexRewards: '',
		},
	},
	aave: {
		avax: {
			currency: '',
			pool: '',
			token: '0xDFE521292EcE2A4f44242efBcD66Bc594CA9714B',
			gauge: '',
			convexRewards: '',
		},
	},
	traderjoe: {
		joewavax: {
			currency: '',
			pool: '',
			token: '0x454e67025631c065d3cfad6d71e6892f74487a15',
			gauge: '',
			convexRewards: '',
		},
	},
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
		'TraderJoe YAXIS/WAVAX': '0x60552c4EEAf57d37176cEce52c3082B27e731398',
	},
	vaults: {
		av3crv: {
			url: 'https://avax.curve.fi/aave/deposit',
			tokenPoolContract: externalPools.curve.av3crv.pool,
			token: 'AV3CRV',
			tokenContract: externalPools.curve.av3crv.token,
			vault: '0x77312C5dC9CaBc981f5C149a356281A022572eCF',
			vaultToken: 'CV:AV3CRV',
			vaultTokenContract: '0x37D3f7257ae996d5c1FeEE560386C1ABaE807FdF',
			gauge: '0x0cc2aF9D57Abf1FC03C08adBDf4B88dfBAa218BF',
		},
		atricrypto: {
			url: 'https://avax.curve.fi/atricrypto/deposit',
			tokenPoolContract: externalPools.curve.atricrypto.pool,
			token: 'ATRICRYPTO',
			tokenContract: externalPools.curve.atricrypto.token,
			vault: '0xDF2Dd0326C7a0fAf56bc92b1305957042991EA3A',
			vaultToken: 'CV:ATRICRYPTO',
			vaultTokenContract: '0xE1C86563B41e155AFa9539650DD18B5d5B244807',
			gauge: '0x6A140de006f1EA9E01056DCbE0CDF465884f03db',
		},
		avax: {
			url: 'https://app.aave.com/#/deposit',
			tokenPoolContract: externalPools.aave.avax.pool,
			token: 'AVWAVAX',
			tokenContract: externalPools.aave.avax.token,
			vault: '0x03d651b4D500D73F719AdbB3bDD9d3661eC05500',
			vaultToken: 'CV:AVAX',
			vaultTokenContract: '0x897f0C22574156fD38762eC9d93B12eA3Fd7a184',
			gauge: '0x8d9658F6b8ec48eff2Daa46642C715b6f3C0C6f8',
		},
		joewavax: {
			url: 'https://traderjoexyz.com/pool/0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd/AVAX#/',
			tokenPoolContract: externalPools.traderjoe.joewavax.pool,
			token: 'JOEWAVAX',
			tokenContract: externalPools.traderjoe.joewavax.token,
			vault: '0x03d651b4D500D73F719AdbB3bDD9d3661eC05500',
			vaultToken: 'CV:JOEWAVAX',
			vaultTokenContract: '0x897f0C22574156fD38762eC9d93B12eA3Fd7a184',
			gauge: '0x8d9658F6b8ec48eff2Daa46642C715b6f3C0C6f8',
		},
	},
	pools: {
		'TraderJoe YAXIS/WAVAX': {
			active: true,
			legacy: false,
			type: 'traderjoe',
			liquidId: `${currencies.ERC677.yaxis}/WAVAX`,
			lpAddress: '0x12b6298a70e2ae1b1352e051237703a3acbef8b4',
			lpUrl: 'https://traderjoexyz.com/trade?inputCurrency=0x55853edc67aa68ec2e3903ac00f2bc5bf2ca8db0&outputCurrency=0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7#/',
			lpTokens: [
				{
					tokenId: 'yaxis',
				},
				{
					tokenId: 'wavax',
				},
			],
			tokenAddress: currencies.ERC677.yaxis,
			name: 'TraderJoe YAXIS/WAVAX',
			symbol: 'TraderJoe YAXIS-WAVAX',
			tokenSymbol: 'YAXIS_ETH_UNISWAP_LP',
			icon: '',
			rewards: 'TraderJoe YAXIS/WAVAX',
		},
	},
	currencies,
	external,
	externalPools,
}

export default mainnet

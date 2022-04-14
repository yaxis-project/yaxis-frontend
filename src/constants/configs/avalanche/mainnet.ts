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
		yaxis: '0x91A1700835230B8b3B06B5B3DD1Fe70D48ACbd91',
	},
}

const external: AvalancheExternalConfig = {
	multicall: '0x98e2060F672FD1656a07bc12D7253b5e41bF3876',
	joeRouter: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
	joeMasterChef: '0xd6a4f121ca35509af06a0be99093d08462f53052',
	aaveRewards: '0x01D83Fe6A10D2f2B7AF17034343746188272cAc9',
}

const externalPools: AvalancheExternalPoolsConfig = {
	curve: {
		av3crv: {
			currency: 'usd',
			pool: '0x7f90122BF0700F9E7e1F688fe926940E8839F353',
			token: '0x1337BedC9D22ecbe766dF105c9623922A27963EC',
			gauge: '0x5B5CFE992AdAC0C9D48E05854B2d91C73a003858',
			rewards: '0xb504b6eb06760019801a91b451d3f7bd9f027fc9',
		},
		atricrypto: {
			currency: 'usd',
			pool: '0xB755B949C126C04e0348DD881a5cF55d424742B2',
			token: '0x1daB6560494B04473A0BE3E7D83CF3Fdf3a51828',
			gauge: '0x445FE580eF8d70FF569aB36e80c647af338db351',
			rewards: '0xa05e565ca0a103fcd999c7a7b8de7bd15d5f6505',
		},
		aawbtcrencrv: {
			currency: 'usd',
			pool: '0x16a7DA911A4DD1d83F3fF066fE28F3C792C50d90',
			token: '0xC2b1DF84112619D190193E48148000e3990Bf627',
			gauge: '0x0f9cb53Ebe405d49A0bbdBD291A65Ff571bC83e1',
			rewards: '0x75d05190f35567e79012c2f0a02330d3ed8a1f74',
		},
	},
	aave: {
		avax: {
			currency: '',
			pool: '0x4F01AeD16D97E3aB5ab2B501154DC9bb0F1A5A2C',
			token: '0xDFE521292EcE2A4f44242efBcD66Bc594CA9714B',
			gauge: '',
			rewards: '',
		},
	},
	traderjoe: {
		joewavax: {
			currency: '',
			pool: '',
			token: '0x454e67025631c065d3cfad6d71e6892f74487a15',
			gauge: '',
			rewards: '',
		},
	},
}

const mainnet: AvalancheConfig = {
	internal: {
		// Current
		manager: '0x831cde67d3A584E49ae57AfBc64d42545aBF9a1F',
		controller: '0xf853FbAc78eE9a592E105eBfCe5d0Bf877F845c8',
		vaultHelper: '0x95A901B5B85ae8996b4b9a2838e573Cb60C2F165',
		minter: '0xE4532E2433007C5f62B2ac537B54Db9D5aaab453',
		minterWrapper: '0xB5D82cDd557329cD1B16D89D1Cfdf2B274CFB0C4',
		votingEscrow: '0x9D71b871C5E5d192B48F983c4e52761c99DD9298',
		gaugeController: '0x11107B773e51A1030A8c7D27DACBED655992E384',
		feeDistributor: '0x53D26Dd410e7d6D54548903633e269444740c32a',
	},
	rewards: {
		'TraderJoe YAXIS/WAVAX': '0x261835a2933781063e15152B50b36B16378B1e61',
	},
	vaults: {
		av3crv: {
			url: 'https://avax.curve.fi/aave/deposit',
			tokenPoolContract: externalPools.curve.av3crv.pool,
			token: 'AV3CRV',
			tokenContract: externalPools.curve.av3crv.token,
			vault: '0x4FEf85d0EcBa72B92A3aE6909F02552b6E04A37d',
			vaultToken: 'CV:AV3CRV',
			vaultTokenContract: '0xe2f2Ed71481AA6c21b2D748ce17432EF7C062265',
			gauge: '0xE078741e5329487bf12908189b111D1b8266243E',
		},
		atricrypto: {
			url: 'https://avax.curve.fi/atricrypto/deposit',
			tokenPoolContract: externalPools.curve.atricrypto.pool,
			token: 'ATRICRYPTO',
			tokenContract: externalPools.curve.atricrypto.token,
			vault: '0xeecB776aF2a9F1B96953b1487CF5Cce7c304FdDB',
			vaultToken: 'CV:ATRICRYPTO',
			vaultTokenContract: '0x6a6C5A596De30a538F95B79b8C9c7B80eDc485EB',
			gauge: '0xc4101Cc2D62301c965713782c1CEF458164a4172',
		},
		avax: {
			url: 'https://app.aave.com/#/deposit',
			tokenPoolContract: externalPools.aave.avax.pool,
			token: 'WAVAX',
			payable: 'AVAX',
			tokenContract: currencies.ERC20.wavax,
			vault: '0x2046C733b0DA43b5A3e5a2F97A219B480eee1818',
			vaultToken: 'CV:AVAX',
			vaultTokenContract: '0xF81354F92A8c91484C54085aDcd9fDCfbF621Cf0',
			gauge: '0x69577301988ddc9032167C2E22D458e7A6A92244',
		},
		joewavax: {
			url: 'https://traderjoexyz.com/pool/0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd/AVAX#/',
			tokenPoolContract: externalPools.traderjoe.joewavax.pool,
			token: 'JOEWAVAX',
			tokenContract: externalPools.traderjoe.joewavax.token,
			vault: '0xaa6e94eb94246f8E4656a34c05C164a1A853172a',
			vaultToken: 'CV:JOEWAVAX',
			vaultTokenContract: '0xdD88A3B3051B72C5d32C4A94AFe494dfb75f7839',
			gauge: '0x2D89a857a76b00C2A0E9EFb016DF49F9CB049755',
		},
	},
	pools: {
		'TraderJoe YAXIS/WAVAX': {
			active: true,
			legacy: false,
			type: 'traderjoe',
			liquidId: `${currencies.ERC677.yaxis}/WAVAX`,
			lpAddress: '0xa3268e6D1aEF5DFB3Eb345d35d925cd2A64c5E87',
			lpUrl: `https://traderjoexyz.com/pool/${currencies.ERC677.yaxis}/AVAX`,
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
			tokenSymbol: 'TRADERJOE_LP',
			icon: '',
			rewards: 'TraderJoe YAXIS/WAVAX',
		},
	},
	currencies,
	external,
	externalPools,
}

export default mainnet

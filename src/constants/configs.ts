import { Config } from './type'

export const configs: Record<number, Config> = {
	42: {
		vaults: {
			'3crv': {
				url: 'https://curve.fi/mim/deposit',
				tokenPoolContract: '0x5a6A4D54456819380173272A5E8E9B9904BdF41B',
				token: 'MIM3CRV',
				tokenContract: '0x496a875Ca0824AA44194bAb63CedD874C2D8afbf',
				vault: '0x9Ea9fb13c66E002197E2a7F4B876832C20c436F7',
				vaultToken: 'CV:3CRV',
				vaultTokenContract:
					'0xC6cE04aC6240fa394b225F4139a0D3035Aebb7f6',
				gauge: '0xDE1C012132401C96F5259F20eFB75125a77e742e',
			},
			wbtc: {
				url: 'https://curve.fi/ren/deposit',
				tokenPoolContract: '0x93054188d876f558f4a66b2ef1d97d16edf0895b',
				token: 'RENCRV',
				tokenContract: '0x8D36D69853d9287712Cd0B51d3dd2E651961584f',
				vault: '0xC0C83c539eD945a2B6FB97a4f54b37C13E2a1804',
				vaultToken: 'CV:WBTC',
				vaultTokenContract:
					'0x1F35c0521E946fECB0246afDF6033C802bE7F003',
				gauge: '0x1cbA0F0B4106ACF0Bfa490e6bC7e610c0F90f948',
			},
			weth: {
				url: 'https://curve.fi/factory/38/deposit',
				token: 'alETHCRV',
				tokenPoolContract: '0xC4C319E2D4d66CcA4464C0c2B32c9Bd23ebe784e',
				tokenContract: '0x59C9B21eDdBFC04Cb453f49b7f3dA18d0F573838',
				vault: '0x0596235bF475e1c16247D5E1f2C4e5B3bbb9279c',
				vaultToken: 'CV:WETH',
				vaultTokenContract:
					'0x51c43d38D9E67af8758057504b12852B3B06DeA4',
				gauge: '0xb31A41817252EAa257Dac8984132e72df09A6f8E',
			},
			link: {
				url: 'https://curve.fi/link/deposit',
				tokenPoolContract: '0xf178c0b5bb7e7abf4e12a4838c7b7c5ba2c623c0',
				token: 'LINKCRV',
				tokenContract: '0x92628DfD845DFAf587526D977090929f12598f3C',
				vault: '0xE1159C7a059ff06D05588A1cd22ECdaFDf7DECeE',
				vaultToken: 'CV:LINK',
				vaultTokenContract:
					'0x8D781473cEb8e57af781E915Df7246Ba5D84CFB0',
				gauge: '0x4c6E2dFeEe929a544053d75b326fe4932AaDDf8e',
			},
			yaxis: {
				url: '',
				tokenPoolContract: '',
				token: 'YAXIS',
				tokenContract: '',
				vault: '',
				vaultToken: 'YAXIS',
				vaultTokenContract:
					'0x8624474F9E886b59A3317F3Ab598fFA63e050E96',
				gauge: '0xc6cF1665Cd2d81075464789d795b7cb8fB5Aa3D3',
			},
		},
		internal: {
			// Current
			manager: '0x5D68Ddd47357a29714CB08bb48397E3Fe3d6F425',
			controller: '0x9A1bad98A98591f05697D4770c4EF4C8F6E476DB',
			vaultHelper: '0x448223929ab973E3d97afc5A7bE48f2d74651497',
			minter: '0x9652EC937545F28efb2c7e813A93D659d02D5e39',
			stableSwap3PoolConverter:
				'0x1A17D5dbBcdBe9E95c3110b2CAc35312Ed82909e',
			votingEscrow: '0x9B95f3164eA9CE0f04747e82F5A2232a5448845A',
			gaugeController: '0xA6Ac7751565b4Cf63B20315950EB9af6961f560e',
			merkleDistributor: '0x51A8F76b848E478e08B771DE55e5e17370DE1D25',
			// Legacy
			swap: '0x90D647a323DE34057ABb36cC05D530C59a102f9A',
			yaxisChef: '0x7eD746d742166bc8465Ed04dD23a62DA4524bCAa',
			xYaxStaking: '0xc5598a5FE5aFFb55308ac06593Af31784606de4C',
			yAxisMetaVault: '0xF293DbBe39EDC5793Ed02d3731170f618538b0D9',
		},
		external: {
			multicall: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
			pickleChef: '0x76f4A0CE3753F745e97e588F8423230B83f4a2F4',
			pickleJar: '0x13F4cc6C239aBaD03EbD2deAA6A7107E9c6c9BEB',
			uniswapRouter: '0x8D037Ea525f150BaD41D0caB990665fE944Cb2F7',
			curve3pool: '0xE2C2a45850375c0A8B92b853fcd0a110463ed5Ab',
		},
		rewards: {
			MetaVault: '0xFDAc13A5f54A7f1784FE2d1AA6fA30ee5C92fcb8',
			Yaxis: '0x8Dd07469b35C02cfa294071D456a2d98b5D42Fa9',
			'Uniswap YAXIS/ETH': '0x71d8189DF0515ac3E2339599FeC1627e6e3AFB72',
		},
		currencies: {
			ERC20: {
				wbtc: '0x508996CeC62aD89457B3C4c434bB4b2e0Eda9A1B',
				link: '0xa2dB763BbEB1dDA3EeB0845C6C23D379A9Cc0F53',
				mim: '0x7F3331ea41B6A839EA623cbc26Cbf92E625BEa07',
				cvx: '0x5Ca82b87E5d82C69Cb0Ab873107F77fdEb537b8a',
				yax: '0x32f5Bc5949591215297594a8A62b991F665f8041',
				usdc: '0xc3Fe4D1658B567C03f626C3FA9dd2e1D15904Dd7',
				dai: '0x4f4242Dd31b7F8f93Fd54EEBf2dA81ccEf797681',
				usdt: '0x817807eB931C1d55629C1010BDda4320e9988de7',
				'3crv': '0x81C0257A53341f9d9e679376804AF94F5B0e748F',
				weth: '0x3C54f058cD7EA85C4CE13d5d77A6Bb3AE0eF9910',
				mvlt: '0xF293DbBe39EDC5793Ed02d3731170f618538b0D9',
			},
			ERC677: {
				yaxis: '0x8624474F9E886b59A3317F3Ab598fFA63e050E96',
			},
		},
		pools: {
			'Uniswap YAXIS/ETH': {
				active: true,
				legacy: false,
				type: 'uniswap',
				liquidId: '0xCf424e898F63B699408e852f0B4Fa1123aC70653/ETH',
				lpAddress: '0x2C47923B589bCeb86d8897eBFECF3b7A0995cf1d',
				lpUrl: '',
				lpTokens: [
					{
						tokenId: 'yaxis',
					},
					{
						tokenId: 'eth',
					},
				],
				tokenAddress: '0xCf424e898F63B699408e852f0B4Fa1123aC70653',
				name: 'Uniswap YAXIS/ETH',
				symbol: 'YAXIS/ETH UNI-V2 LP',
				tokenSymbol: 'YAXIS_ETH_UNISWAP_LP',
				icon: '',
				rewards: 'Uniswap YAXIS/ETH',
			},
			'Uniswap YAX/ETH': {
				pid: 6,
				active: false,
				legacy: true,
				type: 'uniswap',
				liquidId: '0x78B267322aE686D7097eB963b661a4e598b9aa58/ETH',
				lpAddress: '0x3E2461587293851d27787BDF44B1D5F4e74B1dcF',
				lpUrl: '',
				lpTokens: [
					{
						tokenId: 'yax',
					},
					{
						tokenId: 'eth',
					},
				],
				tokenAddress: '0x78B267322aE686D7097eB963b661a4e598b9aa58',
				name: 'Uniswap YAX/ETH',
				symbol: 'YAX/ETH UNI-V2 LP',
				tokenSymbol: 'YAX_ETH_UNISWAP_LP',
				icon: '',
			},
			'Linkswap YAX/ETH': {
				pid: null,
				active: false,
				legacy: true,
				type: 'linkswap',
				liquidId: '0xb1dc9124c395c1e97773ab855d66e879f053a289/ETH',
				lpAddress: '0x21dee38170F1e1F26baFf2C30C0fc8F8362b6961',
				lpUrl: '',
				lpTokens: [
					{
						tokenId: 'yax',
					},
					{
						tokenId: 'eth',
					},
				],
				tokenAddress: '0xe0e3413740aAF1E2E23278c9692a6c3Bb728E9B0',
				name: 'Linkswap YAX/ETH',
				symbol: 'YAX/ETH LINKSWAP LP',
				tokenSymbol: 'YAX_ETH_LINKSWAP_LP',
				icon: '',
			},
		},
	},
	1: {
		internal: {
			// Current
			manager: '',
			controller: '',
			vaultHelper: '',
			minter: '',
			stableSwap3PoolConverter:
				'0x2eab685d85AA52E4d8b6699Ba5aAC3b0c3992C3B',
			votingEscrow: '',
			gaugeController: '',
			merkleDistributor: '0xd0c9432625a181c823b3e63d5e6656f87231ae96',
			// Legacy
			swap: '0xCdF398537adbF8617a8401B14DCEe7F67CF8c64b',
			yaxisChef: '0xc330e7e73717cd13fb6ba068ee871584cf8a194f',
			xYaxStaking: '0xeF31Cb88048416E301Fee1eA13e7664b887BA7e8',
			yAxisMetaVault: '0xBFbEC72F2450eF9Ab742e4A27441Fa06Ca79eA6a',
		},
		external: {
			multicall: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
			pickleChef: '0xbD17B1ce622d73bD438b9E658acA5996dc394b0d',
			pickleJar: '0x1BB74b5DdC1f4fC91D6f9E7906cf68bc93538e33',
			uniswapRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
			curve3pool: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
		},
		rewards: {
			MetaVault: '0x226f9954A1221cDe805C76CfB312A5d761630E14',
			Yaxis: '0x3b09B9ADFe11f92225b4C55De89fa81456595CD9',
			'Uniswap YAXIS/ETH': '0xEDaFe410e2f07ab9D7F1B04316D29C2F49dCb104',
		},
		currencies: {
			ERC20: {
				wbtc: '',
				link: '',
				mim: '',
				cvx: '',
				yax: '0xb1dc9124c395c1e97773ab855d66e879f053a289',
				usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
				dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
				usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
				'3crv': '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
				weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
				mvlt: '0xBFbEC72F2450eF9Ab742e4A27441Fa06Ca79eA6a',
			},
			ERC677: {
				yaxis: '0x0adA190c81b814548ddC2F6AdC4a689ce7C1FE73',
			},
		},
		vaults: {
			'3crv': {
				url: '',
				tokenPoolContract: '',
				token: 'MIM3CRV',
				tokenContract: '',
				vault: '',
				vaultToken: 'CV:3CRV',
				vaultTokenContract: '',
				gauge: '',
			},
			wbtc: {
				url: '',
				tokenPoolContract: '',
				token: 'RENCRV',
				tokenContract: '',
				vault: '',
				vaultToken: 'CV:WBTC',
				vaultTokenContract: '',
				gauge: '',
			},
			weth: {
				url: '',
				tokenPoolContract: '',
				token: 'ALETHCRV',
				tokenContract: '',
				vault: '',
				vaultToken: 'CV:WETH',
				vaultTokenContract: '',
				gauge: '',
			},
			link: {
				url: '',
				tokenPoolContract: '',
				token: 'LINKCRV',
				tokenContract: '',
				vault: '',
				vaultToken: 'CV:LINK',
				vaultTokenContract: '',
				gauge: '',
			},
			yaxis: {
				url: '',
				tokenPoolContract: '',
				token: '',
				tokenContract: '',
				vault: '',
				vaultToken: 'YAXIS',
				vaultTokenContract: '',
				gauge: '',
			},
		},
		pools: {
			'Uniswap YAXIS/ETH': {
				active: true,
				legacy: false,
				type: 'uniswap',
				liquidId: '0x0adA190c81b814548ddC2F6AdC4a689ce7C1FE73/ETH',
				lpAddress: '0xF0E3FdF48661CD10d56692f60BD4eCcd01E9CF64',
				lpUrl: 'https://app.uniswap.org/#/add/v2/ETH/0x0adA190c81b814548ddC2F6AdC4a689ce7C1FE73',
				lpTokens: [
					{
						tokenId: 'yaxis',
					},
					{
						tokenId: 'eth',
					},
				],
				tokenAddress: '0x0adA190c81b814548ddC2F6AdC4a689ce7C1FE73',
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
				liquidId: '0xb1dc9124c395c1e97773ab855d66e879f053a289/ETH',
				lpAddress: '0x1107b6081231d7f256269ad014bf92e041cb08df',
				lpUrl: 'https://app.uniswap.org/#/add/v2/ETH/0xb1dc9124c395c1e97773ab855d66e879f053a289',
				lpTokens: [
					{
						tokenId: 'yax',
					},
					{
						tokenId: 'eth',
					},
				],
				tokenAddress: '0xb1dc9124c395c1e97773ab855d66e879f053a289',
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
				liquidId: '0xb1dc9124c395c1e97773ab855d66e879f053a289/ETH',
				lpAddress: '0x21dee38170F1e1F26baFf2C30C0fc8F8362b6961',
				lpUrl: 'https://linkswap.app/#/add/0xb1dC9124c395c1e97773ab855d66E879f053A289/ETH',
				lpTokens: [
					{
						tokenId: 'yax',
					},
					{
						tokenId: 'eth',
					},
				],
				tokenAddress: '0xb1dc9124c395c1e97773ab855d66e879f053a289',
				name: 'Linkswap YAX/ETH',
				symbol: 'YAX/ETH LINKSWAP LP',
				tokenSymbol: 'YAX_ETH_LINKSWAP_LP',
				icon: '',
			},
		},
	},
}

export const currentConfig = (chainId = 1) => configs[chainId]

/** Curve.fi Gauges **/
export const CurvePools = <const>[
	'compound',
	'usdt',
	'y',
	'busd',
	'susdv2',
	'pax',
	'ren',
	'sbtc',
	'3crv',
]
export type TCurvePools = typeof CurvePools[number]

type PoolInfo = {
	[key in TCurvePools]: {
		swap: string
		swap_token: string
		name: string
		gauge: string
		gauge_relative_weight?: string
	}
}

export const poolInfo: PoolInfo = {
	compound: {
		swap: '0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56',
		swap_token: '0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2',
		name: 'compound',
		gauge: '0x7ca5b0a2910B33e9759DC7dDB0413949071D7575',
	},
	usdt: {
		swap: '0x52EA46506B9CC5Ef470C5bf89f17Dc28bB35D85C',
		swap_token: '0x9fC689CCaDa600B6DF723D9E47D84d76664a1F23',
		name: 'usdt',
		gauge: '0xBC89cd85491d81C6AD2954E6d0362Ee29fCa8F53',
	},
	y: {
		swap: '0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51',
		swap_token: '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8',
		name: 'y',
		gauge: '0xFA712EE4788C042e2B7BB55E6cb8ec569C4530c1',
	},
	busd: {
		swap: '0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F27',
		swap_token: '0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B',
		name: 'busd',
		gauge: '0x69Fb7c45726cfE2baDeE8317005d3F94bE838840',
	},
	susdv2: {
		swap: '0xA5407eAE9Ba41422680e2e00537571bcC53efBfD',
		swap_token: '0xC25a3A3b969415c80451098fa907EC722572917F',
		name: 'susdv2',
		gauge: '0xA90996896660DEcC6E997655E065b23788857849',
	},
	pax: {
		swap: '0x06364f10B501e868329afBc005b3492902d6C763',
		swap_token: '0xD905e2eaeBe188fc92179b6350807D8bd91Db0D8',
		name: 'pax',
		gauge: '0x64E3C23bfc40722d3B649844055F1D51c1ac041d',
	},
	ren: {
		swap: '0x93054188d876f558f4a66B2EF1d97d16eDf0895B',
		swap_token: '0x49849C98ae39Fff122806C06791Fa73784FB3675',
		name: 'ren',
		gauge: '0xB1F2cdeC61db658F091671F5f199635aEF202CAC',
	},
	sbtc: {
		swap: '0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714',
		swap_token: '0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3',
		name: 'sbtc',
		gauge: '0x705350c4BcD35c9441419DdD5d2f097d7a55410F',
	},
	'3crv': {
		swap: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
		swap_token: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
		name: '3crv',
		gauge: '0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A',
	},
}
export const decodedGauges = [
	'0x7ca5b0a2910B33e9759DC7dDB0413949071D7575',
	'0xBC89cd85491d81C6AD2954E6d0362Ee29fCa8F53',
	'0xFA712EE4788C042e2B7BB55E6cb8ec569C4530c1',
	'0x69Fb7c45726cfE2baDeE8317005d3F94bE838840',
	'0x64E3C23bfc40722d3B649844055F1D51c1ac041d',
	'0xB1F2cdeC61db658F091671F5f199635aEF202CAC',
	'0xA90996896660DEcC6E997655E065b23788857849',
	'0x705350c4BcD35c9441419DdD5d2f097d7a55410F',
	'0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A',
]
export const gaugeController_address =
	'0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB'
export const gauge_relative_weight = '0x6207d866000000000000000000000000'

import { Config } from './type'

export const configs: Record<number, Config> = {
	42: {
		vaults: {
			'3crv': {
				url: 'https://curve.fi/mim/deposit',
				tokenPoolContract: '0x5a6A4D54456819380173272A5E8E9B9904BdF41B',
				token: 'MIM3CRV',
				tokenContract: '0x7D91365bC65CF9caDC6aE1d86d35f5add750Fe37',
				vault: '0x631EB675F927ba765b6C6c02df0651144B9858e5',
				vaultToken: 'CV:3CRV',
				vaultTokenContract:
					'0x3cF8802D91C0560b54A5CeEC6da108B7b2946BdB',
				gauge: '0xEc8E054A174B38edC5894187A55AE2D47c1f04eD',
			},
			wbtc: {
				url: 'https://curve.fi/ren/deposit',
				tokenPoolContract: '0x93054188d876f558f4a66b2ef1d97d16edf0895b',
				token: 'RENCRV',
				tokenContract: '0xA8A28853C2CefF3f7B4EC75A07E7B84d637B9a88',
				vault: '0xF269F793F2a774d4019F22C7D519f1e748643C9a',
				vaultToken: 'CV:WBTC',
				vaultTokenContract:
					'0xb5b089B18a3EEFEf762484A279B72F666eFD4d31',
				gauge: '0x2CDD8dd06b6854ABDF1cD050356efEBfde0c9E7E',
			},
			weth: {
				url: 'https://curve.fi/factory/38/deposit',
				token: 'alETHCRV',
				tokenPoolContract: '0xC4C319E2D4d66CcA4464C0c2B32c9Bd23ebe784e',
				tokenContract: '0x1D854D30B656152C2467c4A679430Ae0c2B0BFe6',
				vault: '0xa39A76778ea9b693aF54f205419853938Cd87E08',
				vaultToken: 'CV:WETH',
				vaultTokenContract:
					'0x56b27181fa92DFC5909F1B537f0D5A5929Fbc765',
				gauge: '0xCD7C79e7A0678af31a3b5b0aFc5dd89aB734feD8',
			},
			link: {
				url: 'https://curve.fi/link/deposit',
				tokenPoolContract: '0xf178c0b5bb7e7abf4e12a4838c7b7c5ba2c623c0',
				token: 'LINKCRV',
				tokenContract: '0x540c8a922Cc7E186AA0fd63b0B6aEDd5B5F08007',
				vault: '0x41A757B13d49f56A69Ec78093a823730747D8D61',
				vaultToken: 'CV:LINK',
				vaultTokenContract:
					'0x8e71cB2Ca5E21DA64237E88e9ba5E52403341117',
				gauge: '0xf22940B7Ce3aF6a462F06657f78862CaC456D2F1',
			},
			yaxis: {
				url: '',
				tokenPoolContract: '',
				token: 'YAXIS',
				tokenContract: '',
				vault: '',
				vaultToken: 'YAXIS',
				vaultTokenContract:
					'0xDE78295b8a50413f5a6faBd1f4921E8449d2433C', // YAXIS token
				gauge: '0x9a6Bf749a57fDCDFf8cbD69B39202aAd5a73E4E1',
			},
		},
		internal: {
			// Current
			manager: '0x17CA30093a09C821321feCb67eC9C5c152BAd1ec',
			controller: '0x2998B1809115511A5856a74552a100E7599D282f',
			vaultHelper: '0x62a56BeBA6820ef698D2Cf21E18A7243c387C20E',
			minter: '0x8430b8840cFE3d5a6fE61D010d5B2ec3B32B776B',
			stableSwap3PoolConverter:
				'0x1A17D5dbBcdBe9E95c3110b2CAc35312Ed82909e',
			votingEscrow: '0x2721D6A92d52b655C6bdaC5648dC89483F6400E5',
			gaugeController: '0x6EAF4cEd8319881F7F1929A9b3f543F68e6238C2',
			merkleDistributor: '0x51A8F76b848E478e08B771DE55e5e17370DE1D25',
			// Legacy
			swap: '0x9eFe0a877dbDAce67a43211fCA441325c96C6323',
			yaxisChef: '0xf4aAEd33b7004AE67d3E51eea995E5891Fe5A96c',
			xYaxStaking: '0xc5598a5FE5aFFb55308ac06593Af31784606de4C',
			yAxisMetaVault: '0x5cDf227131880CFd6947A47cC903b40207834846',
		},
		external: {
			multicall: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
			pickleChef: '0x76f4A0CE3753F745e97e588F8423230B83f4a2F4',
			pickleJar: '0x13F4cc6C239aBaD03EbD2deAA6A7107E9c6c9BEB',
			uniswapRouter: '0xff363bdCfbc52C0d0fA93F23416Ae9A5e015d10f',
			curve3pool: '0x3A086Aa6c7bC25cC8BdfA915f6EfF6f8B80536c0',
		},
		rewards: {
			MetaVault: '0xFDAc13A5f54A7f1784FE2d1AA6fA30ee5C92fcb8',
			Yaxis: '0x361B4D521Cd9553e42af65985bb2038CcbbCEb96',
			'Uniswap YAXIS/ETH': '0x23eEE2ce498D9239a034a225d7Be91fb8D69EdBc',
		},
		currencies: {
			ERC20: {
				wbtc: '0xf9Bba2B6CD5ABA1F8023AA9B8C5b50Ef4666157c',
				link: '0xb364c348CC4B9600c2b2C0C19f7425D4f469594c',
				mim: '0x4B6444Aac176e6937A2f8eA712f75D4B8E2F9589',
				cvx: '0x3631944Bd99a426d628070d91CDC559ae4276a6d',
				yax: '0xf07C80993E9b27ae811b059E0FABD7539F8a1197',
				usdc: '0x2cae85b5aD02764ee3e804968A0fFe70c768917f',
				dai: '0xAFB9687A5121ea6152B8951453411B1bD45419C5',
				usdt: '0xDE52958f1c384Fc3F407f602F765eD2152FEE409',
				'3crv': '0xc968d40Abc8a0c365769309982D783825510641F',
				weth: '0xdC2f70dEd078e3f5F3dC6111978E38a4E38f2370',
				mvlt: '0x5cDf227131880CFd6947A47cC903b40207834846',
			},
			ERC677: {
				yaxis: '0xDE78295b8a50413f5a6faBd1f4921E8449d2433C',
			},
		},
		pools: {
			'Uniswap YAXIS/ETH': {
				active: true,
				legacy: false,
				type: 'uniswap',
				liquidId: '0xDE78295b8a50413f5a6faBd1f4921E8449d2433C/ETH',
				lpAddress: '0xf871732CB047909C375CF1E17fe3e3AC0d1fA05d',
				lpUrl: '',
				lpTokens: [
					{
						tokenId: 'yaxis',
					},
					{
						tokenId: 'eth',
					},
				],
				tokenAddress: '0xDE78295b8a50413f5a6faBd1f4921E8449d2433C',
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
				liquidId: '0xf07C80993E9b27ae811b059E0FABD7539F8a1197/ETH',
				lpAddress: '0xA5c9Eb48392d253EC7337f72af3b4d1a03666695',
				lpUrl: '',
				lpTokens: [
					{
						tokenId: 'yax',
					},
					{
						tokenId: 'eth',
					},
				],
				tokenAddress: '0xf07C80993E9b27ae811b059E0FABD7539F8a1197',
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
				liquidId: '0xf07C80993E9b27ae811b059E0FABD7539F8a1197/ETH',
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
				tokenAddress: '0xf07C80993E9b27ae811b059E0FABD7539F8a1197',
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

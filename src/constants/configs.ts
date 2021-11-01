import { Config } from './type'

export const configs: Record<number, Config> = {
	42: {
		vaults: {
			'3crv': {
				vault: '0xaf9F7B66dc8996a72890ef7aE662D514E0f79A07',
				token: 'CV:3CRV',
				tokenContract: '0xCeb5324a2f0B5D8bD25a70Ba5768b67D5dF5578E',
				gauge: '0x7B2bEFA84aD29DB691A714EAA2dd0F83396683c5',
			},
			wbtc: {
				vault: '0x46F807F583956A67A2502afA4ACDaE6a96fD49F2',
				token: 'CV:WBTC',
				tokenContract: '0x40319C212995e7dfaE1646f18e89615028C5f54A',
				gauge: '0xE7dE842bB9c20D06CD697B9199b2bDCCA22e5f82',
			},
			weth: {
				vault: '0xFD2506D8D1Aa621FFE00c2AA84b47Ba20e7B2Ca9',
				token: 'CV:WETH',
				tokenContract: '0x54CE5D9DD3CCA7AaA41F5D0E742b2B2eDa584885',
				gauge: '0x41f9d8079462FD6b1a2df23C50a8E0cEC3C1acdf',
			},
			link: {
				vault: '0x2947D5F0f5644eD20CA65C672b5A0cF97497162F',
				token: 'CV:LINK',
				tokenContract: '0xA85115D019905724CA6076C1a6f1cb784d207F9a',
				gauge: '0xB917ae2dd8d49caDF3e8d322b192834ba30A400a',
			},
			yaxis: {
				vault: '',
				gauge: '0xc6cF1665Cd2d81075464789d795b7cb8fB5Aa3D3',
				token: 'YAXIS',
				tokenContract: '0x8624474F9E886b59A3317F3Ab598fFA63e050E96',
			},
		},
		internal: {
			// Current
			controller: '0x9A1bad98A98591f05697D4770c4EF4C8F6E476DB',
			vaultHelper: '0x39f7a810f8D36fcC65fe6C8d539D55BaD8A9b50C',
			minter: '0xDef86CF671C842633F57e09e439e17a34236d6a0',
			stableSwap3PoolConverter:
				'0x08730602dce4F451766D9362405580C9D33105a1',
			votingEscrow: '0x7057f6fA594abA4C0a4f23A5FF2d9220db12F632',
			gaugeController: '0x7B7e1d1b44BEf6DDaD4AF20D9604692adffb2001',
			merkleDistributor: '0x51A8F76b848E478e08B771DE55e5e17370DE1D25',
			// Legacy
			swap: '0x68ED8AE5F7DBcA0208D197f0D59DB4c7D4a13758',
			yaxisChef: '0x9bE749cF55D933F3ffBfe9a8F06665E8600de183',
			xYaxStaking: '0xc5598a5FE5aFFb55308ac06593Af31784606de4C',
			yAxisMetaVault: '0x8b2E56c78Cb8a9bf8e00836B8baC22f5B779563E',
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
			Yaxis: '0x3d075CA6F631782F06d76bE8B014031B28a79b88',
			'Uniswap YAXIS/ETH': '0xDF0eE62F51080B0E3f8bDFef95FE191CD66CCF99',
		},
		currencies: {
			ERC20: {
				wbtc: '0x9582FC9Ae82ba6203df2bFE5Ce6F77C15a08CDF6',
				link: '0x28AAca872F220889ECBA3DB1f336f2ee99F9aA47',
				mim: '0x40d4ec95E3c4F24A5465ffB648d92fe07776FC25',
				cvx: '0x8c0dDFd1946E1252ceD33D9D87361195357b2BF2',
				yax: '0x78B267322aE686D7097eB963b661a4e598b9aa58', //
				usdc: '0xafa14C9a90903FFB4BA6b957Aa3737555571013d',
				dai: '0x20255E92B44cD44C560DCc58FE4c384ec198BCDC',
				usdt: '0x550132578B16a60FE6F7dda0963f927fE3965972',
				'3crv': '0x5DA448b03e6d3e0bc1fA7D2e133cc3043e9375Ea',
				weth: '0xDc8EBcc8776f114c7b01FcC39B726F52E086D244',
				mvlt: '0x8b2E56c78Cb8a9bf8e00836B8baC22f5B779563E',
			},
			ERC677: {
				yaxis: '0xCf424e898F63B699408e852f0B4Fa1123aC70653',
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
			// Curent
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
				vault: '',
				token: 'CV:3CRV',
				tokenContract: '',
				gauge: '',
			},
			wbtc: {
				vault: '',
				token: 'CV:WBTC',
				tokenContract: '',
				gauge: '',
			},
			weth: {
				vault: '',
				token: 'CV:WETH',
				tokenContract: '',
				gauge: '',
			},
			link: {
				vault: '',
				token: 'CV:LINK',
				tokenContract: '',
				gauge: '',
			},
			yaxis: {
				vault: '',
				gauge: '',
				token: 'YAXIS',
				tokenContract: '',
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
			// {
			// 	pid: 9,
			// 	active: false,
			// 	type: 'balancer',
			// 	liquidId: '0x7134263ef1e6a04f1a49aa03f8b939b97dbcba62',
			// 	lpAddress: '0x7134263ef1e6a04f1a49aa03f8b939b97dbcba62',
			// 	lpUrl: '',
			// 	lpTokens: [
			// 		{
			// 			symbol: 'YAX',
			// 			address: '0xb1dC9124c395c1e97773ab855d66E879f053A289',
			// 			weight: 90,
			// 			decimals: 18,
			// 		},
			// 		{
			// 			symbol: 'USDC',
			// 			address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			// 			weight: 10,
			// 			decimals: 6,
			// 		},
			// 	],
			// 	tokenAddress: '0xb1dc9124c395c1e97773ab855d66e879f053a289',
			// 	name: 'YAX/USDC (90/10) (1x)',
			// 	symbol: 'YAX-USDC 90/10 Balancer BPT',
			// 	tokenSymbol: 'YAX-USDC 90',
			// 	icon: '',
			// },
			// {
			// 	pid: 0,
			// 	active: false,
			// 	type: 'uniswap',
			// 	liquidId: 'ETH/0xe1237aa7f535b0cc33fd973d66cbf830354d16c7',
			// 	lpAddress: '0x29c356881D538e6Ebe32e28fA3d29e7233AE6347',
			// 	lpUrl: '',
			// 	lpTokens: [
			// 		{
			// 			symbol: 'ETH',
			// 			decimals: 18,
			// 		},
			// 		{
			// 			symbol: 'yWETH',
			// 			decimals: 18,
			// 		},
			// 	],
			// 	tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			// 	name: 'Ethereum',
			// 	symbol: 'WETH/yWETH UNI-V2 LP',
			// 	tokenSymbol: 'WETH',
			// 	icon: '',
			// },
			// {
			// 	pid: 1,
			// 	type: 'uniswap',
			// 	active: false,
			// 	liquidId:
			// 		'0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e/0xba2e7fed597fd0e3e70f5130bcdbbfe06bb94fe1',
			// 	lpAddress: '0x8f3496BCEaBA7E935550C8BBB526fc433Faa68B0',
			// 	lpUrl: '',
			// 	lpTokens: [
			// 		{
			// 			symbol: 'YFI',
			// 			decimals: 18,
			// 		},
			// 		{
			// 			symbol: 'yYFI',
			// 			decimals: 18,
			// 		},
			// 	],
			// 	tokenAddress: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
			// 	name: 'Yearn Finance',
			// 	symbol: 'YFI/yYFI UNI-V2 LP',
			// 	tokenSymbol: 'YFI',
			// 	icon: '',
			// },
			// {
			// 	pid: 2,
			// 	active: false,
			// 	type: 'uniswap',
			// 	liquidId:
			// 		'0x5dbcf33d8c2e976c6b560249878e6f1491bca25c/0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8',
			// 	lpAddress: '0x247103dE3B8b256560799b8F9b582C616b6b8B14',
			// 	lpUrl: '',
			// 	lpTokens: [
			// 		{
			// 			symbol: 'yCRV',
			// 			decimals: 18,
			// 		},
			// 		{
			// 			symbol: 'yyCRV',
			// 			decimals: 18,
			// 		},
			// 	],
			// 	tokenAddress: '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8',
			// 	name: 'Curve USD',
			// 	symbol: 'yCRV/yyCRV UNI-V2 LP',
			// 	tokenSymbol: 'yCRV',
			// 	icon: '',
			// },
			// {
			// 	pid: 3,
			// 	active: false,
			// 	type: 'uniswap',
			// 	liquidId:
			// 		'0x075b1bb99792c9e1041ba13afef80c91a1e70fb3/0x7ff566e1d69deff32a7b244ae7276b9f90e9d0f6',
			// 	lpAddress: '0xb608595A1e190174363BC800860E44b0799d6D2C',
			// 	lpUrl: '',
			// 	lpTokens: [
			// 		{
			// 			symbol: 'crvRenWSBTC',
			// 			decimals: 18,
			// 		},
			// 		{
			// 			symbol: 'ycrvRenWSBTC',
			// 			decimals: 18,
			// 		},
			// 	],
			// 	tokenAddress: '0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3',
			// 	name: 'Curve sBTC',
			// 	symbol: 'crvRenWSBTC/ycrvRenWSBTC UNI-V2 LP',
			// 	tokenSymbol: 'crvRenWSBTC',
			// 	icon: '',
			// },
			// {
			// 	pid: 4,
			// 	active: false,
			// 	type: 'uniswap',
			// 	liquidId:
			// 		'0x6b175474e89094c44da98b954eedeac495271d0f/0xacd43e627e64355f1861cec6d3a6688b31a6f952',
			// 	lpAddress: '0x94cDd18F53a8f3EC9A3Ec0CBE897aED5ea009c43',
			// 	lpUrl: '',
			// 	lpTokens: [
			// 		{
			// 			symbol: 'DAI',
			// 			decimals: 18,
			// 		},
			// 		{
			// 			symbol: 'yDAI',
			// 			decimals: 18,
			// 		},
			// 	],
			// 	tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
			// 	name: 'Dai',
			// 	symbol: 'DAI/yDAI UNI-V2 LP',
			// 	tokenSymbol: 'DAI',
			// 	icon: '',
			// },
			// {
			// 	pid: 5,
			// 	active: false,
			// 	type: 'uniswap',
			// 	liquidId:
			// 		'0x29E240CFD7946BA20895a7a02eDb25C210f9f324/0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84',
			// 	lpAddress: '0x321d87E1757C8c9B57e7af5aa3fE13d2ae774445',
			// 	lpUrl: '',
			// 	lpTokens: [
			// 		{
			// 			symbol: 'aLINK',
			// 			decimals: 18,
			// 		},
			// 		{
			// 			symbol: 'yaLINK',
			// 			decimals: 18,
			// 		},
			// 	],
			// 	tokenAddress: '0x29e240cfd7946ba20895a7a02edb25c210f9f324',
			// 	name: 'Aave Link',
			// 	symbol: 'aLINK/yaLINK UNI-V2 LP',
			// 	tokenSymbol: 'aLINK',
			// 	icon: '',
			// },
			// {
			// 	pid: 7,
			// 	active: false,
			// 	type: 'uniswap',
			// 	liquidId: '0x28cb7e841ee97947a86b06fa4090c8451f64c0be/ETH',
			// 	lpAddress: '0x1d6432aefeae2c0ff1393120541863822a4e6fa7',
			// 	lpUrl: '',
			// 	lpTokens: [
			// 		{
			// 			symbol: 'YFL',
			// 			decimals: 18,
			// 		},
			// 		{
			// 			symbol: 'ETH',
			// 			decimals: 18,
			// 		},
			// 	],
			// 	tokenAddress: '0x28cb7e841ee97947a86B06fA4090C8451f64c0be',
			// 	name: 'YFLink',
			// 	symbol: 'YFL/ETH UNI-V2 LP',
			// 	tokenSymbol: 'YFL',
			// 	icon: '',
			// },
			// {
			// 	pid: 8,
			// 	type: 'uniswap',
			// 	active: false,
			// 	liquidId: '0x45f24baeef268bb6d63aee5129015d69702bcdfa/ETH',
			// 	lpAddress: '0xcb4f983e705caeb7217c5c3785001cb138115f0b',
			// 	lpUrl: '',
			// 	lpTokens: [
			// 		{
			// 			symbol: 'YFV',
			// 			decimals: 18,
			// 		},
			// 		{
			// 			symbol: 'ETH',
			// 			decimals: 18,
			// 		},
			// 	],
			// 	tokenAddress: '0x45f24BaEef268BB6d63AEe5129015d69702BCDfa',
			// 	name: 'YFValue',
			// 	symbol: 'YFV/ETH UNI-V2 LP',
			// 	tokenSymbol: 'YFV',
			// 	icon: '',
			// },
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

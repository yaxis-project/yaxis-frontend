import { Config } from './type'

export const configs: Record<number, Config> = {
	42: {
		contractAddresses: {
			multicall: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
			yaxis: '0x29a0d41ad9069861976aFA6F3e6B0b5eC2381096',
			yaxisChef: '0xf74fd2daa87df8d99e1ea7df493a18b546957099',
			weth: '0x38e966C6F5562D628e70560726A7B7bCD6D1EC8A',
			xYaxStaking: '0x10dde3c84e066c15cc16b5d085dff8bb2bf960bf',
			yAxisMetaVault: '0x6e4BA66AD61610098E216991977a067F0680FC96',
			stableSwap3PoolConverter:
				'0x4981D4A898e1C503BFA06B751f932600E124108f',
			pickleChef: '0x0000000000000000000000000000000000000000',
			pickleJar: '0x0000000000000000000000000000000000000000',
		},
		vault: {
			usdc: '0xAE0e8B59555d83f3A83DFB258E637CFfEba77D3A',
			dai: '0x59Dd2C19F322f7457C34C73023cC7dA1fde4063d',
			usdt: '0x3631E53e320F072e53397Ab7717b4C4F90fd2183',
			threeCrv: '0xFe2517Ff8E95876EE29aD9f91Ee31fB5Bd1dc2a3',
			metaVaultOpenTime: 0,
		},
		staking: {
			openTime: 0,
			strategy: '20% of MetaVault farming rewards',
		},
		pools: [
			{
				pid: 6,
				active: true,
				type: 'uni',
				liquidId: '0x29a0d41ad9069861976aFA6F3e6B0b5eC2381096/ETH',
				lpAddress: '0xe1D13c665FFb8eB104c3dDa0c66341F22d336b1B',
				lpUrl: '',
				lpTokens: [
					{
						symbol: 'YAX',
						decimals: 18,
					},
					{
						symbol: 'ETH',
						decimals: 18,
					},
				],
				tokenAddress: '0x29a0d41ad9069861976aFA6F3e6B0b5eC2381096',
				name: 'Uniswap YAX/ETH',
				symbol: 'YAX/ETH UNI-V2 LP 111',
				tokenSymbol: 'YAX',
				icon: '',
			},
		],
	},
	1: {
		contractAddresses: {
			multicall: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
			yaxis: '0xb1dc9124c395c1e97773ab855d66e879f053a289',
			yaxisChef: '0xc330e7e73717cd13fb6ba068ee871584cf8a194f',
			pickleChef: '0xbD17B1ce622d73bD438b9E658acA5996dc394b0d',
			pickleJar: '0x1BB74b5DdC1f4fC91D6f9E7906cf68bc93538e33',
			weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
			xYaxStaking: '0xeF31Cb88048416E301Fee1eA13e7664b887BA7e8',
			yAxisMetaVault: '0xBFbEC72F2450eF9Ab742e4A27441Fa06Ca79eA6a',
			stableSwap3PoolConverter:
				'0xA5c16eb6eBD72BC72c70Fca3e4faCf389AD4aBE7',
		},
		vault: {
			usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
			usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
			threeCrv: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
			metaVaultOpenTime: 1604167200000,
			// startBlockNumber: 11163000,
		},
		staking: {
			openTime: 1604260800000,
			strategy: '20% of MetaVault farming rewards',
		},
		pools: [
			{
				pid: 6,
				active: true,
				type: 'uni',
				liquidId: '0xb1dc9124c395c1e97773ab855d66e879f053a289/ETH',
				lpAddress: '0x1107b6081231d7f256269ad014bf92e041cb08df',
				lpUrl:
					'https://app.uniswap.org/#/add/0xb1dc9124c395c1e97773ab855d66e879f053a289/ETH',
				lpTokens: [
					{
						symbol: 'YAX',
						decimals: 18,
					},
					{
						symbol: 'ETH',
						decimals: 18,
					},
				],
				tokenAddress: '0xb1dc9124c395c1e97773ab855d66e879f053a289',
				name: 'Uniswap YAX/ETH',
				symbol: 'YAX/ETH UNI-V2 LP',
				tokenSymbol: 'YAX',
				icon: '',
			},
			{
				pid: 9,
				active: false,
				type: 'balancer',
				liquidId: '0x7134263ef1e6a04f1a49aa03f8b939b97dbcba62',
				lpAddress: '0x7134263ef1e6a04f1a49aa03f8b939b97dbcba62',
				lpUrl: '',
				lpTokens: [
					{
						symbol: 'YAX',
						address: '0xb1dC9124c395c1e97773ab855d66E879f053A289',
						weight: 90,
						decimals: 18,
					},
					{
						symbol: 'USDC',
						address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						weight: 10,
						decimals: 6,
					},
				],
				tokenAddress: '0xb1dc9124c395c1e97773ab855d66e879f053a289',
				name: 'YAX/USDC (90/10) (1x)',
				symbol: 'YAX-USDC 90/10 Balancer BPT',
				tokenSymbol: 'YAX-USDC 90',
				icon: '',
			},
			{
				pid: 0,
				active: false,
				type: 'uni',
				liquidId: 'ETH/0xe1237aa7f535b0cc33fd973d66cbf830354d16c7',
				lpAddress: '0x29c356881D538e6Ebe32e28fA3d29e7233AE6347',
				lpUrl: '',
				lpTokens: [
					{
						symbol: 'ETH',
						decimals: 18,
					},
					{
						symbol: 'yWETH',
						decimals: 18,
					},
				],
				tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
				name: 'Ethereum',
				symbol: 'WETH/yWETH UNI-V2 LP',
				tokenSymbol: 'WETH',
				icon: '',
			},
			{
				pid: 1,
				type: 'uni',
				active: false,
				liquidId:
					'0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e/0xba2e7fed597fd0e3e70f5130bcdbbfe06bb94fe1',
				lpAddress: '0x8f3496BCEaBA7E935550C8BBB526fc433Faa68B0',
				lpUrl: '',
				lpTokens: [
					{
						symbol: 'YFI',
						decimals: 18,
					},
					{
						symbol: 'yYFI',
						decimals: 18,
					},
				],
				tokenAddress: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
				name: 'Yearn Finance',
				symbol: 'YFI/yYFI UNI-V2 LP',
				tokenSymbol: 'YFI',
				icon: '',
			},
			{
				pid: 2,
				active: false,
				type: 'uni',
				liquidId:
					'0x5dbcf33d8c2e976c6b560249878e6f1491bca25c/0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8',
				lpAddress: '0x247103dE3B8b256560799b8F9b582C616b6b8B14',
				lpUrl: '',
				lpTokens: [
					{
						symbol: 'yCRV',
						decimals: 18,
					},
					{
						symbol: 'yyCRV',
						decimals: 18,
					},
				],
				tokenAddress: '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8',
				name: 'Curve USD',
				symbol: 'yCRV/yyCRV UNI-V2 LP',
				tokenSymbol: 'yCRV',
				icon: '',
			},
			{
				pid: 3,
				active: false,
				type: 'uni',
				liquidId:
					'0x075b1bb99792c9e1041ba13afef80c91a1e70fb3/0x7ff566e1d69deff32a7b244ae7276b9f90e9d0f6',
				lpAddress: '0xb608595A1e190174363BC800860E44b0799d6D2C',
				lpUrl: '',
				lpTokens: [
					{
						symbol: 'crvRenWSBTC',
						decimals: 18,
					},
					{
						symbol: 'ycrvRenWSBTC',
						decimals: 18,
					},
				],
				tokenAddress: '0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3',
				name: 'Curve sBTC',
				symbol: 'crvRenWSBTC/ycrvRenWSBTC UNI-V2 LP',
				tokenSymbol: 'crvRenWSBTC',
				icon: '',
			},
			{
				pid: 4,
				active: false,
				type: 'uni',
				liquidId:
					'0x6b175474e89094c44da98b954eedeac495271d0f/0xacd43e627e64355f1861cec6d3a6688b31a6f952',
				lpAddress: '0x94cDd18F53a8f3EC9A3Ec0CBE897aED5ea009c43',
				lpUrl: '',
				lpTokens: [
					{
						symbol: 'DAI',
						decimals: 18,
					},
					{
						symbol: 'yDAI',
						decimals: 18,
					},
				],
				tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
				name: 'Dai',
				symbol: 'DAI/yDAI UNI-V2 LP',
				tokenSymbol: 'DAI',
				icon: '',
			},
			{
				pid: 5,
				active: false,
				type: 'uni',
				liquidId:
					'0x29E240CFD7946BA20895a7a02eDb25C210f9f324/0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84',
				lpAddress: '0x321d87E1757C8c9B57e7af5aa3fE13d2ae774445',
				lpUrl: '',
				lpTokens: [
					{
						symbol: 'aLINK',
						decimals: 18,
					},
					{
						symbol: 'yaLINK',
						decimals: 18,
					},
				],
				tokenAddress: '0x29e240cfd7946ba20895a7a02edb25c210f9f324',
				name: 'Aave Link',
				symbol: 'aLINK/yaLINK UNI-V2 LP',
				tokenSymbol: 'aLINK',
				icon: '',
			},
			{
				pid: 7,
				active: false,
				type: 'uni',
				liquidId: '0x28cb7e841ee97947a86b06fa4090c8451f64c0be/ETH',
				lpAddress: '0x1d6432aefeae2c0ff1393120541863822a4e6fa7',
				lpUrl: '',
				lpTokens: [
					{
						symbol: 'YFL',
						decimals: 18,
					},
					{
						symbol: 'ETH',
						decimals: 18,
					},
				],
				tokenAddress: '0x28cb7e841ee97947a86B06fA4090C8451f64c0be',
				name: 'YFLink',
				symbol: 'YFL/ETH UNI-V2 LP',
				tokenSymbol: 'YFL',
				icon: '',
			},
			{
				pid: null,
				active: true,
				type: 'link',
				liquidId: '0xb1dc9124c395c1e97773ab855d66e879f053a289/ETH',
				lpAddress: '0x21dee38170F1e1F26baFf2C30C0fc8F8362b6961',
				lpUrl:
					'https://linkswap.app/#/add/0x514910771af9ca656af840dff83e8264ecf986ca/0xb1dc9124c395c1e97773ab855d66e879f053a289',
				lpTokens: [
					{
						symbol: 'YAX',
						decimals: 18,
					},
					{
						symbol: 'ETH',
						decimals: 18,
					},
				],
				tokenAddress: '0xb1dc9124c395c1e97773ab855d66e879f053a289',
				name: 'Linkswap YAX/ETH',
				symbol: 'YAX/ETH LINKSWAP LP',
				tokenSymbol: 'YAX',
				icon: '',
			},
			{
				pid: 8,
				type: 'uni',
				active: false,
				liquidId: '0x45f24baeef268bb6d63aee5129015d69702bcdfa/ETH',
				lpAddress: '0xcb4f983e705caeb7217c5c3785001cb138115f0b',
				lpUrl: '',
				lpTokens: [
					{
						symbol: 'YFV',
						decimals: 18,
					},
					{
						symbol: 'ETH',
						decimals: 18,
					},
				],
				tokenAddress: '0x45f24BaEef268BB6d63AEe5129015d69702BCDfa',
				name: 'YFValue',
				symbol: 'YFV/ETH UNI-V2 LP',
				tokenSymbol: 'YFV',
				icon: '',
			},
		],
	},
}

export const NETWORK_NAME = process.env.REACT_APP_NETWORK
export const NETWORK_ID = NETWORK_NAME === 'kovan' ? 42 : 1
export const currentConfig = (chainId = 1) => configs[chainId]

export const tokensConfig = {
	share: {
		tokenId: 'mvlt',
		name: 'MVLT',
	},
	reward: {
		tokenId: 'yax',
		name: 'YAX',
	},
}

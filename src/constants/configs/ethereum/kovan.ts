import {
	EthereumConfig,
	EthereumCurrenciesConfig,
	EthereumExternalConfig,
	EthereumExternalPoolsConfig,
} from '../../type/ethereum'

const currencies: EthereumCurrenciesConfig = {
	ERC20: {
		crv: '0xDB0E1fe102Be9c0fD355100271283dF18bA4797F',
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
		spell: '0xc968d40Abc8a0c365769309982D783825510641F', // needs mock
		frax: '0x64C1d8cd206aF84f54eadb1cbD1E4c3643875Ee8', // needs mock
	},
	ERC677: {
		yaxis: '0xDE78295b8a50413f5a6faBd1f4921E8449d2433C',
	},
}

const external: EthereumExternalConfig = {
	multicall: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
	pickleChef: '0x76f4A0CE3753F745e97e588F8423230B83f4a2F4',
	pickleJar: '0x13F4cc6C239aBaD03EbD2deAA6A7107E9c6c9BEB',
	uniswapRouter: '0xff363bdCfbc52C0d0fA93F23416Ae9A5e015d10f',
	gaugeController: '0xff363bdCfbc52C0d0fA93F23416Ae9A5e015d10f', // needs mock
}

const externalPools: EthereumExternalPoolsConfig = {
	curve: {
		mim3crv: {
			currency: 'usd',
			pool: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
			token: '',
			gauge: '0xCD7C79e7A0678af31a3b5b0aFc5dd89aB734feD8',
			convexRewards: '0xFDAc13A5f54A7f1784FE2d1AA6fA30ee5C92fcb8', // needs mock
		},
		rencrv: {
			currency: 'btc',
			pool: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
			token: '',
			gauge: '0xCD7C79e7A0678af31a3b5b0aFc5dd89aB734feD8',
			convexRewards: '0xFDAc13A5f54A7f1784FE2d1AA6fA30ee5C92fcb8', // needs mock
		},
		alethcrv: {
			currency: 'eth',
			pool: '0x459416729cDC9345c20dd6D9eFC047e0CbB3842e',
			token: '0x59C9B21eDdBFC04Cb453f49b7f3dA18d0F573838',
			gauge: '0xCD7C79e7A0678af31a3b5b0aFc5dd89aB734feD8',
			convexRewards: '0xFDAc13A5f54A7f1784FE2d1AA6fA30ee5C92fcb8', // needs mock
		},
		linkcrv: {
			currency: 'link',
			pool: '0xF0cCAbb34899652eFea9751616fd94A73E4bD501',
			token: '',
			gauge: '0xCD7C79e7A0678af31a3b5b0aFc5dd89aB734feD8',
			convexRewards: '0xFDAc13A5f54A7f1784FE2d1AA6fA30ee5C92fcb8', // needs mock
		},
		'3pool': {
			currency: 'usd',
			pool: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
			token: '',
			gauge: '0xCD7C79e7A0678af31a3b5b0aFc5dd89aB734feD8',
			convexRewards: '0xFDAc13A5f54A7f1784FE2d1AA6fA30ee5C92fcb8', // needs mock
		},
		crvcvxeth: {
			currency: 'usd',
			pool: '0xF0cCAbb34899652eFea9751616fd94A73E4bD501',
			token: '0xd36C376154e770ea4f6596D7400ACe73b4f67916',
			gauge: '0xCD7C79e7A0678af31a3b5b0aFc5dd89aB734feD8',
			convexRewards: '0xFDAc13A5f54A7f1784FE2d1AA6fA30ee5C92fcb8', // needs mock
		},
		crv3crypto: {
			currency: 'usd',
			pool: '0xF0cCAbb34899652eFea9751616fd94A73E4bD501',
			token: '0x924CAf02657d1c98C31670A412b9672E6F42664c',
			gauge: '0xCD7C79e7A0678af31a3b5b0aFc5dd89aB734feD8',
			convexRewards: '0xFDAc13A5f54A7f1784FE2d1AA6fA30ee5C92fcb8', // needs mock
		},
		frax3crv: {
			currency: 'usd',
			pool: '0xF0cCAbb34899652eFea9751616fd94A73E4bD501',
			token: '0x64C1d8cd206aF84f54eadb1cbD1E4c3643875Ee8',
			gauge: '0xCD7C79e7A0678af31a3b5b0aFc5dd89aB734feD8',
			convexRewards: '0xFDAc13A5f54A7f1784FE2d1AA6fA30ee5C92fcb8', // needs mock
		},
	},
}

const kovan: EthereumConfig = {
	vaults: {
		usd: {
			url: 'https://curve.fi/mim/deposit',
			tokenPoolContract: '0xa2373Ffc62cA0CA01aE9edfFC19762E3fC75F99C',
			token: 'MIM3CRV',
			tokenContract: '0x7D91365bC65CF9caDC6aE1d86d35f5add750Fe37',
			vault: '0x631EB675F927ba765b6C6c02df0651144B9858e5',
			vaultToken: 'CV:USD',
			vaultTokenContract: '0x3cF8802D91C0560b54A5CeEC6da108B7b2946BdB',
			gauge: '0xEc8E054A174B38edC5894187A55AE2D47c1f04eD',
		},
		btc: {
			url: 'https://curve.fi/ren/deposit',
			tokenPoolContract: '0xa2373Ffc62cA0CA01aE9edfFC19762E3fC75F99C',
			token: 'RENCRV',
			tokenContract: '0xA8A28853C2CefF3f7B4EC75A07E7B84d637B9a88',
			vault: '0xF269F793F2a774d4019F22C7D519f1e748643C9a',
			vaultToken: 'CV:BTC',
			vaultTokenContract: '0xb5b089B18a3EEFEf762484A279B72F666eFD4d31',
			gauge: '0x2CDD8dd06b6854ABDF1cD050356efEBfde0c9E7E',
		},
		eth: {
			url: 'https://curve.fi/factory/38/deposit',
			token: 'alETHCRV',
			tokenPoolContract: '0xa2373Ffc62cA0CA01aE9edfFC19762E3fC75F99C',
			tokenContract: externalPools.curve.alethcrv.token,
			vault: '0x0596235bF475e1c16247D5E1f2C4e5B3bbb9279c',
			vaultToken: 'CV:ETH',
			vaultTokenContract: '0x56b27181fa92DFC5909F1B537f0D5A5929Fbc765',
			gauge: '0xCD7C79e7A0678af31a3b5b0aFc5dd89aB734feD8',
		},
		link: {
			url: 'https://curve.fi/link/deposit',
			tokenPoolContract: '0xa2373Ffc62cA0CA01aE9edfFC19762E3fC75F99C',
			token: 'LINKCRV',
			tokenContract: '0x540c8a922Cc7E186AA0fd63b0B6aEDd5B5F08007',
			vault: '0x41A757B13d49f56A69Ec78093a823730747D8D61',
			vaultToken: 'CV:LINK',
			vaultTokenContract: '0x8e71cB2Ca5E21DA64237E88e9ba5E52403341117',
			gauge: '0xf22940B7Ce3aF6a462F06657f78862CaC456D2F1',
		},
		yaxis: {
			url: '',
			tokenPoolContract: '',
			token: 'YAXIS',
			tokenContract: '',
			vault: '',
			vaultToken: 'YAXIS',
			vaultTokenContract: currencies.ERC677.yaxis,
			gauge: '0x9a6Bf749a57fDCDFf8cbD69B39202aAd5a73E4E1',
		},
		cvx: {
			url: 'https://curve.fi/cvxeth/',
			tokenPoolContract: externalPools.curve.crvcvxeth.pool,
			token: 'CRVCVXETH',
			tokenContract: externalPools.curve.crvcvxeth.token,
			vault: '0xB31dfBF39Ab56de5e847360018e48E11bb88Ed4e',
			vaultToken: 'CV:CVX',
			vaultTokenContract: '0xa71d40f9ebAaff20633489cD77E673c558dF487e',
			gauge: '0x88205736AFE9A5F49f6108b2A84892656194bE27',
		},
		tricrypto: {
			url: 'https://curve.fi/tricrypto2/',
			tokenPoolContract: externalPools.curve.crv3crypto.pool,
			token: 'CRV3CRYPTO',
			tokenContract: externalPools.curve.crv3crypto.token,
			vault: '0x73f05eA672299d2ff3D1FdFc662c5b09031950f3',
			vaultToken: 'CV:TRICRYPTO',
			vaultTokenContract: '0xa4eC591D88f52bDe13CFff81d9918e4bCD6cea65',
			gauge: '0x10BF38631ef414CE08D09ed33A7ABA9Ad58C7818',
		},
		frax: {
			url: 'https://curve.fi/frax',
			tokenPoolContract: externalPools.curve.frax3crv.pool,
			token: 'FRAX3CRV',
			tokenContract: externalPools.curve.frax3crv.token,
			vault: '0xdd507197D317ac2D17028d642bf6B875Ad9673fC',
			vaultToken: 'CV:FRAX',
			vaultTokenContract: '0x05d76F1F6a7528B455d3Bfb850B0eDFe2BF05878',
			gauge: '0xF7A88a99976A478D66FE59cb3c6E90c45E8F185B',
		},
	},
	internal: {
		// Current
		manager: '0x17CA30093a09C821321feCb67eC9C5c152BAd1ec',
		controller: '0x2998B1809115511A5856a74552a100E7599D282f',
		vaultHelper: '0x62a56BeBA6820ef698D2Cf21E18A7243c387C20E',
		minter: '0x8430b8840cFE3d5a6fE61D010d5B2ec3B32B776B',
		minterWrapper: '0xdf87daD061CD6460D18A171BCB9d50dd0F75Bcd3',
		stableSwap3PoolConverter: '0x1A17D5dbBcdBe9E95c3110b2CAc35312Ed82909e',
		votingEscrow: '0x2721D6A92d52b655C6bdaC5648dC89483F6400E5',
		gaugeController: '0x6EAF4cEd8319881F7F1929A9b3f543F68e6238C2',
		feeDistributor: '0x2e525f795FFf8E04df74F4F93DDC2Cd3990fF0C3',
		// Legacy
		merkleDistributor: '0x51A8F76b848E478e08B771DE55e5e17370DE1D25',
		swap: '0x9eFe0a877dbDAce67a43211fCA441325c96C6323',
		yaxisChef: '0xf4aAEd33b7004AE67d3E51eea995E5891Fe5A96c',
		xYaxStaking: '0xc5598a5FE5aFFb55308ac06593Af31784606de4C',
		yAxisMetaVault: '0x5cDf227131880CFd6947A47cC903b40207834846',
	},
	rewards: {
		MetaVault: '0xFDAc13A5f54A7f1784FE2d1AA6fA30ee5C92fcb8',
		Yaxis: '0x361B4D521Cd9553e42af65985bb2038CcbbCEb96',
		'Uniswap YAXIS/ETH': '0x23eEE2ce498D9239a034a225d7Be91fb8D69EdBc',
	},
	pools: {
		'Uniswap YAXIS/ETH': {
			active: true,
			legacy: false,
			type: 'uniswap',
			liquidId: `${currencies.ERC677.yaxis}/ETH`,
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
			tokenAddress: currencies.ERC677.yaxis,
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
			liquidId: `${currencies.ERC20.yax}/ETH`,
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
			tokenAddress: currencies.ERC20.yax,
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
			liquidId: `${currencies.ERC20.yax}/ETH`,
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

export default kovan

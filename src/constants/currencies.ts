import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { Ticker } from './type'
import crv3 from '../assets/img/currencies/3crv.svg'
import dai from '../assets/img/currencies/dai.svg'
import eth from '../assets/img/currencies/eth.svg'
import pickle from '../assets/img/currencies/pickle.svg'
import frax from '../assets/img/currencies/frax.svg'
import cvx from '../assets/img/currencies/cvx.svg'
import uni from '../assets/img/currencies/uni.svg'
import usdc from '../assets/img/currencies/usdc.svg'
import usdt from '../assets/img/currencies/usdt.svg'
import link from '../assets/img/currencies/link.svg'
import wbtc from '../assets/img/currencies/wbtc.svg'
import usd from '../assets/img/currencies/usd.svg'
import avax from '../assets/img/currencies/avax.svg'
import joe from '../assets/img/currencies/joe.svg'
import aave from '../assets/img/currencies/aave.svg'
import tricrypto from '../assets/img/currencies/tricrypto.svg'
import linkswap from '../assets/img/icons/pool-token.svg'
import yax from '../assets/img/logo-ui.svg'
import { ethers } from 'ethers'

export interface Currency {
	name: string
	tokenId: string
	icon: string
	childIcons?: string[]
	decimals: number
	priceMapKey?: Ticker
}

export interface CurrencyContract extends Currency {
	contract: Contract
}

export interface CurrencyValue extends CurrencyContract {
	value: BigNumber // The raw value read from on-chain
	amount: BigNumber // The  amount of tokens once converted using decimals
}

export interface CurrencyApproved extends CurrencyContract {
	approved: BigNumber // The raw value read from on-chain
	owner: string
	spender: string
}

export const DEFAULT_TOKEN_BALANCE: CurrencyValue = {
	value: new BigNumber(0),
	amount: new BigNumber(0),
	contract: new Contract(ethers.constants.AddressZero, '[]'),
	name: '',
	tokenId: '',
	icon: '',
	decimals: 18,
}

/**
 * Non-ETH currencies
 */

export const USD: Currency = {
	name: 'USD',
	tokenId: 'usd',
	icon: usd,
	decimals: 0,
}

export const BTC: Currency = {
	name: 'BTC',
	tokenId: 'btc',
	icon: wbtc,
	decimals: 0,
	priceMapKey: 'btc',
}

/**
 * ETH currencies
 */

export const ETH: Currency = {
	name: 'ETH',
	tokenId: 'eth',
	icon: eth,
	decimals: 18,
	priceMapKey: 'eth',
}

// Internal

export const YAX: Currency = {
	name: 'YAX',
	tokenId: 'yax',
	icon: yax,
	decimals: 18,
	priceMapKey: 'yaxis',
}

export const YAXIS: Currency = {
	name: 'YAXIS',
	tokenId: 'yaxis',
	icon: yax,
	decimals: 18,
	priceMapKey: 'yaxis',
}

export const MVLT: Currency = {
	name: 'MVLT',
	tokenId: 'mvlt',
	icon: yax,
	decimals: 18,
}

export const CVUSD: Currency = {
	name: 'CV:USD',
	tokenId: 'cv:usd',
	icon: usd,
	decimals: 18,
}

export const CVUSDgauge: Currency = {
	name: 'CV:USD-GAUGE',
	tokenId: 'cv:usd-gauge',
	icon: usd,
	decimals: 18,
}

export const CVBTC: Currency = {
	name: 'CV:BTC',
	tokenId: 'cv:btc',
	icon: wbtc,
	decimals: 18,
}

export const CVBTCgauge: Currency = {
	name: 'CV:BTC-GAUGE',
	tokenId: 'cv:btc-gauge',
	icon: wbtc,
	decimals: 18,
}

export const CVETH: Currency = {
	name: 'CV:ETH',
	tokenId: 'cv:eth',
	icon: eth,
	decimals: 18,
}

export const CVETHgauge: Currency = {
	name: 'CV:ETH-GAUGE',
	tokenId: 'cv:eth-gauge',
	icon: eth,
	decimals: 18,
}

export const CVLINK: Currency = {
	name: 'CV:LINK',
	tokenId: 'cv:link',
	icon: link,
	decimals: 18,
}

export const CVLINKgauge: Currency = {
	name: 'CV:LINK-GAUGE',
	tokenId: 'cv:link-gauge',
	icon: link,
	decimals: 18,
}

export const CVCVX: Currency = {
	name: 'CV:CVX',
	tokenId: 'cv:cvx',
	icon: cvx,
	decimals: 18,
}

export const CVCVXgauge: Currency = {
	name: 'CV:CVX-GAUGE',
	tokenId: 'cv:cvx-gauge',
	icon: cvx,
	decimals: 18,
}

export const CVTRICRYPTO: Currency = {
	name: 'CV:TRICRYPTO',
	tokenId: 'cv:tricrypto',
	icon: tricrypto,
	childIcons: [usdt, wbtc, eth],
	decimals: 18,
}

export const CVTRICRYPTOgauge: Currency = {
	name: 'CV:TRICRYPTO-GAUGE',
	tokenId: 'cv:tricrypto-gauge',
	icon: tricrypto,
	childIcons: [usdt, wbtc, eth],
	decimals: 18,
}

export const AV3CRV: Currency = {
	name: 'AV3CRV',
	tokenId: 'av3crv',
	icon: crv3,
	childIcons: [usdt, usdc, dai],
	decimals: 18,
}

export const CVAV3CRV: Currency = {
	name: 'CV:AV3CRV',
	tokenId: 'cv:av3crv',
	icon: crv3,
	childIcons: [usdt, usdc, dai],
	decimals: 18,
}

export const CVAV3CRVgauge: Currency = {
	name: 'CV:AV3CRV-GAUGE',
	tokenId: 'cv:av3crv-gauge',
	icon: crv3,
	childIcons: [usdt, usdc, dai],
	decimals: 18,
}

export const ATRICRYPTO: Currency = {
	name: 'ATRICRYPTO',
	tokenId: 'atricrypto',
	icon: tricrypto,
	childIcons: [usdt, wbtc, eth],
	decimals: 18,
}

export const CVATRICRYPTO: Currency = {
	name: 'CV:ATRICRYPTO',
	tokenId: 'cv:atricrypto',
	icon: tricrypto,
	childIcons: [usdt, wbtc, eth],
	decimals: 18,
}

export const CVATRICRYPTOgauge: Currency = {
	name: 'CV:ATRICRYPTO-GAUGE',
	tokenId: 'cv:atricrypto-gauge',
	icon: tricrypto,
	childIcons: [usdt, wbtc, eth],
	decimals: 18,
}

export const CVFRAX: Currency = {
	name: 'CV:FRAX',
	tokenId: 'cv:frax',
	icon: frax,
	decimals: 18,
}

export const CVFRAXgauge: Currency = {
	name: 'CV:FRAX-GAUGE',
	tokenId: 'cv:frax-gauge',
	icon: frax,
	decimals: 18,
}

export const YAXISgauge: Currency = {
	name: 'YAXIS-GAUGE',
	tokenId: 'yaxis-gauge',
	icon: yax,
	decimals: 18,
	priceMapKey: 'yaxis',
}

export const AVWAVAX: Currency = {
	name: 'AVWAVAX',
	tokenId: 'avwavax',
	icon: aave,
	decimals: 18,
}

export const CVAVAX: Currency = {
	name: 'CV:AVAX',
	tokenId: 'cv:avax',
	icon: avax,
	decimals: 18,
}

export const CVAVAXgauge: Currency = {
	name: 'CV:AVAX-GAUGE',
	tokenId: 'cv:avax-gauge',
	icon: avax,
	decimals: 18,
}

export const JOEWAVAX: Currency = {
	name: 'JOEWAVAX',
	tokenId: 'joewavax',
	icon: joe,
	decimals: 18,
}

export const CVJOEWAVAX: Currency = {
	name: 'CV:JOEWAVAX',
	tokenId: 'cv:joewavax',
	icon: joe,
	decimals: 18,
}

export const CVJOEWAVAXgauge: Currency = {
	name: 'CV:JOEWAVAX-GAUGE',
	tokenId: 'cv:joewavax-gauge',
	icon: joe,
	decimals: 18,
}

export const WETHAVAX: Currency = {
	name: 'WETHAVAX',
	tokenId: 'wethavax',
	icon: joe,
	decimals: 18,
}

export const CVWETHAVAX: Currency = {
	name: 'CV:WETHAVAX',
	tokenId: 'cv:wethavax',
	icon: joe,
	decimals: 18,
}

export const CVWETHAVAXgauge: Currency = {
	name: 'CV:WETHAVAX-GAUGE',
	tokenId: 'cv:wethavax-gauge',
	icon: joe,
	decimals: 18,
}

export const USDCUSDC: Currency = {
	name: 'USDCUSDC',
	tokenId: 'usdcusdc',
	icon: joe,
	decimals: 18,
}

export const CVUSDCUSDC: Currency = {
	name: 'CV:USDCUSDC',
	tokenId: 'cv:usdcusdc',
	icon: joe,
	decimals: 18,
}

export const CVUSDCUSDCgauge: Currency = {
	name: 'CV:USDCUSDC-GAUGE',
	tokenId: 'cv:usdcusdc-gauge',
	icon: joe,
	decimals: 18,
}

export const AVAXLINK: Currency = {
	name: 'AVAXLINK',
	tokenId: 'avaxlink',
	icon: joe,
	decimals: 18,
}

export const CVAVAXLINK: Currency = {
	name: 'CV:AVAXLINK',
	tokenId: 'cv:avaxlink',
	icon: joe,
	decimals: 18,
}

export const CVAVAXLINKgauge: Currency = {
	name: 'CV:AVAXLINK-GAUGE',
	tokenId: 'cv:avaxlink-gauge',
	icon: joe,
	decimals: 18,
}

export const AVAXUSDT: Currency = {
	name: 'AVAXUSDT',
	tokenId: 'avaxusdt',
	icon: joe,
	decimals: 18,
}

export const CVAVAXUSDT: Currency = {
	name: 'CV:AVAXUSDT',
	tokenId: 'cv:avaxusdt',
	icon: joe,
	decimals: 18,
}

export const CVAVAXUSDTgauge: Currency = {
	name: 'CV:AVAXUSDT-GAUGE',
	tokenId: 'cv:avaxusdt-gauge',
	icon: joe,
	decimals: 18,
}

export const AVAXPTP: Currency = {
	name: 'AVAXPTP',
	tokenId: 'avaxptp',
	icon: joe,
	decimals: 18,
}

export const CVAVAXPTP: Currency = {
	name: 'CV:AVAXPTP',
	tokenId: 'cv:avaxptp',
	icon: joe,
	decimals: 18,
}

export const CVAVAXPTPgauge: Currency = {
	name: 'CV:AVAXPTP-GAUGE',
	tokenId: 'cv:avaxptp-gauge',
	icon: joe,
	decimals: 18,
}

export const AVAXGOHM: Currency = {
	name: 'AVAXGOHM',
	tokenId: 'avaxgohm',
	icon: joe,
	decimals: 18,
}

export const CVAVAXGOHM: Currency = {
	name: 'CV:AVAXGOHM',
	tokenId: 'cv:avaxgohm',
	icon: joe,
	decimals: 18,
}

export const CVAVAXGOHMgauge: Currency = {
	name: 'CV:AVAXGOHM-GAUGE',
	tokenId: 'cv:avaxgohm-gauge',
	icon: joe,
	decimals: 18,
}

export const AVAXSAVAX: Currency = {
	name: 'AVAXSAVAX',
	tokenId: 'avaxsavax',
	icon: joe,
	decimals: 18,
}

export const CVAVAXSAVAX: Currency = {
	name: 'CV:AVAXSAVAX',
	tokenId: 'cv:avaxsavax',
	icon: joe,
	decimals: 18,
}

export const CVAVAXSAVAXgauge: Currency = {
	name: 'CV:AVAXSAVAX-GAUGE',
	tokenId: 'cv:avaxsavax-gauge',
	icon: joe,
	decimals: 18,
}

export const AVAXWBTC: Currency = {
	name: 'AVAXWBTC',
	tokenId: 'avaxwbtc',
	icon: joe,
	decimals: 18,
}

export const CVAVAXWBTC: Currency = {
	name: 'CV:AVAXWBTC',
	tokenId: 'cv:avaxwbtc',
	icon: joe,
	decimals: 18,
}

export const CVAVAXWBTCgauge: Currency = {
	name: 'CV:AVAXWBTC-GAUGE',
	tokenId: 'cv:avaxwbtc-gauge',
	icon: joe,
	decimals: 18,
}

export const USDCJOE: Currency = {
	name: 'USDCJOE',
	tokenId: 'usdcjoe',
	icon: joe,
	decimals: 18,
}

export const CVUSDCJOE: Currency = {
	name: 'CV:USDCJOE',
	tokenId: 'cv:usdcjoe',
	icon: joe,
	decimals: 18,
}

export const CVUSDCJOEgauge: Currency = {
	name: 'CV:USDCJOE-GAUGE',
	tokenId: 'cv:usdcjoe-gauge',
	icon: joe,
	decimals: 18,
}

export const AVAXUSDC: Currency = {
	name: 'AVAXUSDC',
	tokenId: 'avaxusdc',
	icon: joe,
	decimals: 18,
}

export const CVAVAXUSDC: Currency = {
	name: 'CV:AVAXUSDC',
	tokenId: 'cv:avaxusdc',
	icon: joe,
	decimals: 18,
}

export const CVAVAXUSDCgauge: Currency = {
	name: 'CV:AVAXUSDC-GAUGE',
	tokenId: 'cv:avaxusdc-gauge',
	icon: joe,
	decimals: 18,
}

// External

export const DAI: Currency = {
	name: 'DAI',
	tokenId: 'dai',
	icon: dai,
	decimals: 18,
	priceMapKey: 'dai',
}

export const CRV: Currency = {
	name: 'CRV',
	tokenId: 'crv',
	icon: crv3,
	decimals: 18,
	priceMapKey: 'crv',
}

export const WETH: Currency = {
	name: 'wETH',
	tokenId: 'weth',
	icon: eth,
	decimals: 18,
	priceMapKey: 'weth',
}

export const SPELL: Currency = {
	name: 'SPELL',
	tokenId: 'spell',
	icon: eth,
	decimals: 18,
	priceMapKey: 'spell',
}

export const JOE: Currency = {
	name: 'JOE',
	tokenId: 'joe',
	icon: joe,
	decimals: 18,
	priceMapKey: 'spell',
}

export const AVAX: Currency = {
	name: 'AVAX',
	tokenId: 'avax',
	icon: avax,
	decimals: 18,
	priceMapKey: 'avax',
}

export const WAVAX: Currency = {
	name: 'wAVAX',
	tokenId: 'wavax',
	icon: avax,
	decimals: 18,
	priceMapKey: 'wavax',
}

//

export const WBTC: Currency = {
	name: 'wBTC',
	tokenId: 'wbtc',
	icon: wbtc,
	decimals: 18,
	priceMapKey: 'wbtc',
}

export const LINK: Currency = {
	name: 'LINK',
	tokenId: 'link',
	icon: link,
	decimals: 18,
	priceMapKey: 'link',
}

export const MIM: Currency = {
	name: 'MIM',
	tokenId: 'mim',
	icon: eth,
	decimals: 18,
	priceMapKey: 'mim',
}

export const CVX: Currency = {
	name: 'CVX',
	tokenId: 'cvx',
	icon: cvx,
	decimals: 18,
	priceMapKey: 'cvx',
}

export const USDT: Currency = {
	name: 'USDT',
	tokenId: 'usdt',
	icon: usdt,
	decimals: 6,
	priceMapKey: 'usdt',
}

export const USDC: Currency = {
	name: 'USDC',
	tokenId: 'usdc',
	icon: usdc,
	decimals: 6,
	priceMapKey: 'usdc',
}

export const PICKLE: Currency = {
	name: 'Pickle',
	tokenId: 'pickle',
	icon: pickle,
	decimals: 18,
}

export const FRAX: Currency = {
	name: 'Frax',
	tokenId: 'frax',
	icon: frax,
	decimals: 18,
	priceMapKey: 'frax',
}

export const TRICRYPTO: Currency = {
	name: 'Tri-Crypto',
	tokenId: 'tricrypto',
	icon: tricrypto,
	childIcons: [usdt, wbtc, eth],
	decimals: 18,
}

// LP tokens

export const LINKCRV: Currency = {
	name: 'LINKCRV',
	tokenId: 'linkcrv',
	icon: link,
	childIcons: [LINK.icon],
	decimals: 18,
}

export const RENCRV: Currency = {
	name: 'RENCRV',
	tokenId: 'rencrv',
	icon: wbtc,
	childIcons: [WBTC.icon],
	decimals: 18,
}

export const threeCRV: Currency = {
	name: '3CRV',
	tokenId: '3crv',
	icon: crv3,
	childIcons: [USDC.icon, USDT.icon, DAI.icon],
	decimals: 18,
	priceMapKey: '3crv',
}

export const MIM3CRV: Currency = {
	name: 'MIM3CRV',
	tokenId: 'mim3crv',
	icon: crv3,
	childIcons: [MIM.icon, USDC.icon, USDT.icon, DAI.icon],
	decimals: 18,
}

export const ALETHCRV: Currency = {
	name: 'alETHCRV',
	tokenId: 'alethcrv',
	icon: eth,
	childIcons: [WETH.icon],
	decimals: 18,
}

export const CRVCVXETH: Currency = {
	name: 'crvCVXETH',
	tokenId: 'crvcvxeth',
	icon: cvx,
	childIcons: [CVX.icon, WETH.icon],
	decimals: 18,
}

export const CRV3CRYPTO: Currency = {
	name: 'crv3crypto',
	tokenId: 'crv3crypto',
	icon: tricrypto,
	childIcons: [USDT.icon, WBTC.icon, WETH.icon],
	decimals: 18,
}

export const FRAX3CRV: Currency = {
	name: 'FRAX3CRV',
	tokenId: 'frax3crv',
	icon: frax,
	childIcons: [FRAX.icon, USDC.icon, USDT.icon, DAI.icon],
	decimals: 18,
}

export const STETHCRV: Currency = {
	name: 'STETHCRV',
	tokenId: 'stethcrv',
	icon: eth,
	childIcons: [],
	decimals: 18,
}

export const STETH: Currency = {
	name: 'STETH',
	tokenId: 'steth',
	icon: eth,
	childIcons: [],
	decimals: 18,
}

export const CVSTETHgauge: Currency = {
	name: 'CV:STETH-GAUGE',
	tokenId: 'cv:avaxwbtc-gauge',
	icon: eth,
	decimals: 18,
}

export const UNISWAP_LP: Currency = {
	name: 'Uniswap LP token',
	tokenId: 'uni-v2',
	icon: uni,
	decimals: 18,
}

export const YAXIS_ETH_UNISWAP_LP = {
	...UNISWAP_LP,
	tokenId: 'YAXIS_ETH_UNISWAP_LP',
}

export const YAX_ETH_UNISWAP_LP = {
	...UNISWAP_LP,
	tokenId: 'YAX_ETH_UNISWAP_LP',
}

export const LINKSWAP_LP: Currency = {
	name: 'Linkswap LP token',
	tokenId: 'lslp',
	icon: linkswap,
	decimals: 18,
}

export const YAX_ETH_LINKSWAP_LP = {
	...LINKSWAP_LP,
	tokenId: 'YAX_ETH_LINKSWAP_LP',
}

export const TRADERJOE_LP = {
	name: 'TraderJoe LP token',
	tokenId: 'YAXIS_WAVAX_TRADERJOE_LP',
	icon: joe,
	decimals: 18,
}

export const Currencies = {
	USD,
	BTC,
	ETH,
	WETH,
	AVAX,
	WAVAX,
	YAX,
	YAXIS,
	'YAXIS-GAUGE': YAXISgauge,
	MVLT,
	'CV:USD': CVUSD,
	'CV:USD-GAUGE': CVUSDgauge,
	'CV:BTC': CVBTC,
	'CV:BTC-GAUGE': CVBTCgauge,
	'CV:ETH': CVETH,
	'CV:ETH-GAUGE': CVETHgauge,
	'CV:LINK': CVLINK,
	'CV:LINK-GAUGE': CVLINKgauge,
	'CV:CVX': CVCVX,
	'CV:CVX-GAUGE': CVCVXgauge,
	'CV:TRICRYPTO': CVTRICRYPTO,
	'CV:TRICRYPTO-GAUGE': CVTRICRYPTOgauge,
	'CV:FRAX': CVFRAX,
	'CV:FRAX-GAUGE': CVFRAXgauge,
	ATRICRYPTO,
	'CV:ATRICRYPTO': CVATRICRYPTO,
	'CV:ATRICRYPTO-GAUGE': CVATRICRYPTOgauge,
	AV3CRV,
	'CV:AV3CRV': CVAV3CRV,
	'CV:AV3CRV-GAUGE': CVAV3CRVgauge,
	AVWAVAX,
	'CV:AVAX': CVAVAX,
	'CV:AVAX-GAUGE': CVAVAXgauge,
	JOEWAVAX,
	'CV:JOEWAVAX': CVJOEWAVAX,
	'CV:JOEWAVAX-GAUGE': CVJOEWAVAXgauge,
	WETHAVAX,
	'CV:WETHAVAX': CVWETHAVAX,
	'CV:WETHAVAX-GAUGE': CVWETHAVAXgauge,
	USDCUSDC,
	'CV:USDCUSDC': CVUSDCUSDC,
	'CV:USDCUSDC-GAUGE': CVUSDCUSDCgauge,
	AVAXLINK,
	'CV:AVAXLINK': CVAVAXLINK,
	'CV:AVAXLINK-GAUGE': CVAVAXLINKgauge,
	AVAXUSDT,
	'CV:AVAXUSDT': CVAVAXUSDT,
	'CV:AVAXUSDT-GAUGE': CVAVAXUSDTgauge,
	AVAXPTP,
	'CV:AVAXPTP': CVAVAXPTP,
	'CV:AVAXPTP-GAUGE': CVAVAXPTPgauge,
	AVAXGOHM,
	'CV:AVAXGOHM': CVAVAXGOHM,
	'CV:AVAXGOHM-GAUGE': CVAVAXGOHMgauge,
	AVAXSAVAX,
	'CV:AVAXSAVAX': CVAVAXSAVAX,
	'CV:AVAXSAVAX-GAUGE': CVAVAXSAVAXgauge,
	AVAXWBTC,
	'CV:AVAXWBTC': CVAVAXWBTC,
	'CV:AVAXWBTC-GAUGE': CVAVAXWBTCgauge,
	USDCJOE,
	'CV:USDCJOE': CVUSDCJOE,
	'CV:USDCJOE-GAUGE': CVUSDCJOEgauge,
	AVAXUSDC,
	'CV:AVAXUSDC': CVAVAXUSDC,
	'CV:AVAXUSDC-GAUGE': CVAVAXUSDCgauge,
	FRAX,
	TRICRYPTO,
	MIM,
	SPELL,
	CVX,
	CRV,
	JOE,
	WBTC,
	LINK,
	DAI,
	USDC,
	USDT,
	RENCRV,
	MIM3CRV,
	ALETHCRV,
	LINKCRV,
	FRAX3CRV,
	CRV3CRYPTO,
	CRVCVXETH,
	'3CRV': threeCRV,
	PICKLE,
	UNISWAP_LP,
	YAX_ETH_UNISWAP_LP,
	YAXIS_ETH_UNISWAP_LP,
	LINKSWAP_LP,
	YAX_ETH_LINKSWAP_LP,
	TRADERJOE_LP,
	'STETHCRV': STETHCRV,
	'CV:STETH': STETH,
	STETH,
	'CV:STETH-GAUGE': CVSTETHgauge
}

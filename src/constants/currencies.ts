import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { Ticker } from './type'
import crv3 from '../assets/img/currencies/3crv.svg'
import dai from '../assets/img/currencies/dai.svg'
import eth from '../assets/img/currencies/eth.svg'
import pickle from '../assets/img/currencies/pickle.svg'
import uni from '../assets/img/currencies/uni.svg'
import usdc from '../assets/img/currencies/usdc.svg'
import usdt from '../assets/img/currencies/usdt.svg'
import linkswap from '../assets/img/icons/pool-token.svg'
import yax from '../assets/img/logo-ui.svg'

export interface Currency {
	name: string
	tokenId: string
	icon: any
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

export const MVLT: Currency = {
	name: 'MVLT',
	tokenId: 'mvlt',
	icon: yax,
	decimals: 18,
}

export const CVS: Currency = {
	name: 'CV:S',
	tokenId: 'cv:s',
	icon: yax,
	decimals: 18,
}

export const DAI: Currency = {
	name: 'DAI',
	tokenId: 'dai',
	icon: dai,
	decimals: 18,
	priceMapKey: 'dai',
}

export const threeCRV: Currency = {
	name: '3CRV',
	tokenId: '3crv',
	icon: crv3,
	decimals: 18,
	priceMapKey: '3crv',
}

export const WETH: Currency = {
	name: 'WETH',
	tokenId: 'weth',
	icon: eth,
	decimals: 18,
	priceMapKey: 'weth',
}

export const ETH: Currency = {
	name: 'ETH',
	tokenId: 'eth',
	icon: eth,
	decimals: 18,
	priceMapKey: 'eth',
}

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

export const Currencies = {
	ETH,
	WETH,
	YAX,
	YAXIS,
	MVLT,
	'CV:S': CVS,
	DAI,
	USDC,
	USDT,
	'3CRV': threeCRV,
	PICKLE,
	UNISWAP_LP,
	YAX_ETH_UNISWAP_LP,
	YAXIS_ETH_UNISWAP_LP,
	LINKSWAP_LP,
	YAX_ETH_LINKSWAP_LP,
}

/**
 * Settings for currencies used as investment collateral.
 */
export const InvestingDepositCurrencies = [DAI, USDC, USDT, threeCRV]

export const CurrenciesIn3Pool = <const>['dai', 'usdc', 'usdt']
export type TCurrencies3Pool = typeof CurrenciesIn3Pool[number]
export const Currencies3Pool: Currency[] = CurrenciesIn3Pool.map(
	(c) => Currencies[c.toUpperCase()],
)

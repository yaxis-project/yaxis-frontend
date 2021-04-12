import { Ticker } from '../contexts/Prices/utils'
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
	stakingTokenAddress?: string
	address?: string
	tokenId?: string
	icon: any
	decimals: number
	priceMapKey?: Ticker
}

export const MVLT: Currency = {
	name: 'MVLT',
	tokenId: 'mvlt',
	icon: yax,
	decimals: 18,
}

export const DAI: Currency = {
	name: 'DAI',
	tokenId: 'dai',
	icon: dai,
	decimals: 18,
	priceMapKey: 'DAI',
}

export const CRV3: Currency = {
	name: '3CRV',
	tokenId: '3crv',
	icon: crv3,
	decimals: 18,
	priceMapKey: 'YCURVE',
}

export const USD: Currency = {
	name: 'USD',
	tokenId: 'usd',
	icon: dai,
	decimals: 18,
}

export const ETH: Currency = {
	name: 'ETH',
	tokenId: 'eth',
	icon: eth,
	decimals: 18,
	priceMapKey: 'ETH',
}

export const YAX: Currency = {
	name: 'YAX',
	tokenId: 'yax',
	icon: yax,
	decimals: 18,
	priceMapKey: 'YAXIS',
}

export const YAXIS: Currency = {
	name: 'YAXIS',
	tokenId: 'yaxis',
	icon: yax,
	decimals: 18,
	priceMapKey: 'YAXIS',
}

export const USDT: Currency = {
	name: 'USDT',
	tokenId: 'usdt',
	icon: usdt,
	decimals: 6,
	priceMapKey: 'USDT',
}
export const USDC: Currency = {
	name: 'USDC',
	tokenId: 'usdc',
	icon: usdc,
	decimals: 6,
	priceMapKey: 'USDC',
}

export const PICKLE: Currency = {
	name: 'Pickle',
	tokenId: 'pickle',
	icon: pickle,
	decimals: 18,
	priceMapKey: 'PICKLE',
}

export const UNI_ETH_YAX_LP: Currency = {
	name: 'YAX/ETH UNI-V2 LP',
	icon: uni,
	decimals: 18,
}

export const UNI_LP: Currency = {
	name: 'YAX/ETH UNI-V2 LP',
	icon: uni,
	decimals: 18,
}

export const LINKSWAP_ETH_YAX_LP: Currency = {
	name: 'YAX/ETH LINKSWAP LP',
	icon: linkswap,
	decimals: 18,
}

export const LINKSWAP_LP: Currency = {
	name: 'YAX/ETH LINKSWAP LP',
	icon: linkswap,
	decimals: 18,
}

export const currencyMap = {
	'YAX/ETH UNI-V2 LP': UNI_ETH_YAX_LP,
	'YAX/ETH LINKSWAP LP': LINKSWAP_ETH_YAX_LP,
}

/**
 * Settings for currencies used as investment collateral.
 */
export const InvestingDepositCurrencies = [DAI, USDC, USDT, CRV3]

export enum Currencies {
	DAI,
	CRV3,
	USD,
	ETH,
	YAX,
	YAXIS,
	PICKLE,
	USDC,
	USDT,
}

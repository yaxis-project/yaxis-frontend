import dai from '../assets/img/currencies/dai.svg'
import crv3 from '../assets/img/currencies/3crv.svg'
import eth from '../assets/img/currencies/eth.svg'
import pickle from '../assets/img/currencies/pickle.svg'
import usdt from '../assets/img/currencies/usdt.svg'
import usdc from '../assets/img/currencies/usdc.svg'
import pool from '../assets/img/icons/pool-token.svg'
import yax from '../assets/img/logo-ui.svg'

import { currentConfig } from '../yaxis/configs'

export interface Currency {
	name: string
	stakingTokenAddress?: string
	address?: string
	tokenId?: string
	icon: any
	decimals: number
	priceMapKey?: string
}

export const Dai: Currency = {
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
	priceMapKey: 'ethereum',
}

export const YAX: Currency = {
	name: 'YAX',
	tokenId: 'yax',
	address: currentConfig.contractAddresses.yaxis,
	stakingTokenAddress: currentConfig.contractAddresses.xYaxStaking,
	icon: yax,
	decimals: 18,
	priceMapKey: 'YAX',
}

export const USDT: Currency = {
	name: 'USDT',
	tokenId: 'usdt',
	icon: usdt,
	decimals: 18,
	priceMapKey: 'USDT',
}
export const USDC: Currency = {
	name: 'USDC',
	tokenId: 'usdc',
	icon: usdc,
	decimals: 18,
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
	icon: pool,
	decimals: 18,
}

export const currencyMap = {
	'YAX/ETH UNI-V2 LP': UNI_ETH_YAX_LP,
}

/**
 * Settings for currencies used as investment collateral.
 */
export const InvestingDepositCurrencies = [Dai, CRV3, USDT, USDC]

export enum Currencies {
	Dai,
	CRV3,
	USD,
	ETH,
	YAX,
	PICKLE,
	USDC,
	USDT,
}

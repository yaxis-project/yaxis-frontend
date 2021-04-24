import {
	useState,
	useEffect,
	createContext,
	ReactElement,
	PropsWithChildren,
} from 'react'
import { getCoinGeckoPrices, Ticker } from './utils'
import useGlobal from '../../hooks/useGlobal'
import useContractRead from '../../hooks/useContractRead'
import BigNumber from 'bignumber.js'

export const defaultPriceMap: Record<Ticker, number> = {
	YFI: 0,
	PICKLE: 0,
	BTC: 0,
	ETH: 0,
	LINK: 0,
	USDT: 0,
	YFV: 0,
	USDC: 0,
	WBTC: 0,
	crvRenWSBTC: 0,
	vUSD: 0,
	DAI: 0,
	aLINK: 0,
	YCURVE: 0,
	yCRV: 0,
	YAXIS: 0,
	Cure3Crv: 0,
	CRV: 0,
}

export type PricesContext = typeof defaultPriceMap & {
	initialized: boolean
}

export const Context = createContext({ initialized: false, ...defaultPriceMap })

export function PricesProvider({
	children,
}: PropsWithChildren<any>): ReactElement {
	const [value, setValue] = useState(defaultPriceMap)
	const [isInitialized, setIsInitialized] = useState<boolean>(false)
	const { block } = useGlobal()

	const { data: reserves } = useContractRead({
		contractName: `pools.0.lpContract`,
		method: 'getReserves()',
	})

	useEffect(() => {
		;(async () => {
			if (reserves)
				try {
					const priceMap = await getCoinGeckoPrices()
					let yaxisPrice = new BigNumber(0)
					const { _reserve0, _reserve1 } = reserves
					let t0 = new BigNumber(_reserve0)
					let t1 = new BigNumber(_reserve1)
					if (t0.gt(0) && t1.gt(0)) {
						t0 = t0.dividedBy(10 ** 18)
						t1 = t1.dividedBy(10 ** 18)
						yaxisPrice = t1.dividedBy(t0).multipliedBy(priceMap.ETH)
					}
					// YAXIS price kludge
					priceMap.YAXIS = yaxisPrice.isZero()
						? 60
						: yaxisPrice.toNumber()
					setValue(priceMap)
					setIsInitialized(true)
				} catch (e) {
					console.log('Could net fetch prices', e)
				}
		})()
	}, [reserves, block])

	return (
		<Context.Provider value={{ initialized: isInitialized, ...value }}>
			{children}
		</Context.Provider>
	)
}

export default PricesProvider

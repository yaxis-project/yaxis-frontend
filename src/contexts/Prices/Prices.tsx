import {
	useState,
	useEffect,
	createContext,
	ReactElement,
	PropsWithChildren,
} from 'react'
import { getCoinGeckoPrices, Ticker } from './utils'
import useGlobal from '../../hooks/useGlobal'

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
	YAX: 0,
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
	useEffect(() => {
		(async () => {
			try {
				const priceMap = await getCoinGeckoPrices()
				setValue(priceMap)
				setIsInitialized(true)
			} catch (e) {
				console.log("Could net fetch prices", e)
			}
		})()
	}, [block])

	return (
		<Context.Provider
			value={{ initialized: isInitialized, ...value }}
		>
			{children}
		</Context.Provider>
	)
}

export default PricesProvider

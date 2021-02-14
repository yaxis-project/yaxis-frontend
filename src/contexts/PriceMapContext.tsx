import React, {
	useState,
	useEffect,
	createContext,
	ReactElement,
	PropsWithChildren,
} from 'react'
import { getCoinGeckoPrices } from '../yaxis/utils'
import useBlock from '../hooks/useBlock'

const PriceMapContext = createContext(null)

export function PriceMapContextComponent({
	children,
}: PropsWithChildren<any>): ReactElement {
	const [value, setValue] = useState({})
	const [isInitialized, setIsInitialized] = useState<boolean>(false)
	const block = useBlock()
	useEffect(() => {
		;(async () => {
			try {
				const priceMap = await getCoinGeckoPrices()
				setValue(priceMap)
				setIsInitialized(true)
			} catch (e) {
				// do nothings
			}
		})()
	}, [block])

	return (
		<PriceMapContext.Provider
			value={{ ...(value || {}), initialized: isInitialized }}
		>
			{children}
		</PriceMapContext.Provider>
	)
}

export default PriceMapContext

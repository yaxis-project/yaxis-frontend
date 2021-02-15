import React, { useCallback, useEffect, useState } from 'react'

import useYaxis from '../../hooks/useYaxis'

import {
	getFarms,
	getTotalLPWethValue,
	getWethContract,
	getYaxisChefContract,
} from '../../yaxis/utils'

import Context from './context'
import usePriceMap from '../../hooks/usePriceMap'
import { StakedValue } from './types'

const Farms: React.FC = ({ children }) => {
	const [unharvested, setUnharvested] = useState(0)

	const yaxis = useYaxis()

	const farms = getFarms(yaxis)
	const [stakedValues, setBalance] = useState([] as Array<StakedValue>)
	const yaxisChefContract = getYaxisChefContract(yaxis)
	const wethContact = getWethContract(yaxis)
	const priceMap = usePriceMap()
	const fetchStakedValue = useCallback(async () => {
		if (priceMap) {
			try {
				const balances: Array<StakedValue> = await Promise.all(
					farms.map((farm) =>
						getTotalLPWethValue(
							yaxisChefContract,
							wethContact,
							priceMap,
							farm,
						),
					),
				)
				setBalance(balances)
			} catch { }
		}
	}, [wethContact, yaxisChefContract, setBalance, priceMap])

	useEffect(() => {
		if (wethContact && yaxisChefContract) {
			fetchStakedValue()
		}
	}, [wethContact, yaxisChefContract, setBalance, priceMap])
	return (
		<Context.Provider
			value={{
				farms,
				stakedValues,
				unharvested,
			}}
		>
			{children}
		</Context.Provider>
	)
}

export default Farms

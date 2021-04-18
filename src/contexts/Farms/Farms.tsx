import React, { useCallback, useEffect, useState, useMemo } from 'react'

import useGlobal from '../../hooks/useGlobal'

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
	const [unharvested] = useState(0)

	const { yaxis } = useGlobal()
	const farms = useMemo(() => getFarms(yaxis), [yaxis])

	const [stakedValues, setBalance] = useState([] as Array<StakedValue>)

	const [yaxisChefContract, wethContact] = useMemo(
		() => [getYaxisChefContract(yaxis), getWethContract(yaxis)],
		[yaxis],
	)
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
							yaxis?.contracts,
						),
					),
				)
				setBalance(balances)
			} catch {}
		}
	}, [
		wethContact,
		yaxisChefContract,
		farms,
		setBalance,
		priceMap,
		yaxis?.contracts,
	])

	useEffect(() => {
		if (wethContact && yaxisChefContract) {
			fetchStakedValue()
		}
	}, [wethContact, yaxisChefContract, fetchStakedValue])

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

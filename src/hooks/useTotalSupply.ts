import { useEffect, useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import useYaxis from './useYaxis'
import { getYaxisChefContract, getYaxisSupply } from '../yaxis/utils'
import useBlock from './useBlock'

const useTotalSupply = () => {
	const [totalSupply, setTotalSupply] = useState<BigNumber>(new BigNumber(0))
	const { account } = useWeb3React()
	const yaxis = useYaxis()
	const yaxisChefContract = getYaxisChefContract(yaxis)
	const block = useBlock()

	const fetchTotalSupply = useCallback(async () => {
		if (yaxis) {
			const supply = await getYaxisSupply(yaxis)
			setTotalSupply(supply)
		}
	}, [yaxis])

	useEffect(() => {
		fetchTotalSupply()
	}, [block, account, yaxisChefContract, fetchTotalSupply])
	return totalSupply
}

export default useTotalSupply

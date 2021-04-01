import { useState, useEffect } from 'react'
import useGlobal from '../hooks/useGlobal'
import useYAXISStaking from './useYAXISStaking'
import useMetaVaultData from '../hooks/useMetaVaultData'
import useERC20Transactions from '../hooks/useERC20Transactions'
import usePriceMap from '../hooks/usePriceMap'
import BN from 'bignumber.js'

const defaultState = {
	metaVaultUSD: '0',
	stakingUSD: '0',
	totalUSD: '0',
}

const useReturns = () => {
	const { block } = useGlobal()
	const [state, setState] = useState(defaultState)
	const [loading, setLoading] = useState(true)

	const {
		loading: loadingStaking,
		balances: { stakedBalance },
	} = useYAXISStaking()
	const {
		metaVaultData: { totalBalance, mvltPrice },
		loading: loadingMetaVaultData,
	} = useMetaVaultData('v1')
	const { loading: loadingERC20, state: erc20 } = useERC20Transactions()
	const priceMap = usePriceMap()

	useEffect(() => {
		if (!loadingStaking && !loadingMetaVaultData && !loadingERC20) {
			const investingBalance = new BN(totalBalance || '0').multipliedBy(
				mvltPrice || '0',
			)
			const mvReUSD = erc20.metaVault.USD.plus(investingBalance)
			const mvReYAX = erc20.metaVault.YAX
			const mvReturn = mvReUSD.plus(mvReYAX.multipliedBy(priceMap?.YAX))
			const stReYAX = erc20.staking.YAX.plus(stakedBalance)
			const stReturn = stReYAX.multipliedBy(priceMap?.YAX)
			setState({
				metaVaultUSD: mvReturn.toFixed(2),
				stakingUSD: stReturn.toFixed(2),
				totalUSD: mvReturn.plus(stReturn).toFixed(2),
			})
			setLoading(false)
		}
	}, [
		block,
		loadingStaking,
		loadingMetaVaultData,
		loadingERC20,
		erc20,
		mvltPrice,
		totalBalance,
		stakedBalance,
		priceMap
	])

	return { loading, returns: state }
}

export default useReturns

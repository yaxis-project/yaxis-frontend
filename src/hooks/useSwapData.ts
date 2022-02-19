import { useMemo } from 'react'
import useWeb3Provider from './useWeb3Provider'
import { currentConfig } from '../constants/configs'
import { useAllTokenBalances, useLegacyReturns } from '../state/wallet/hooks'
import BigNumber from 'bignumber.js'

const useSwapData = () => {
	const { chainId } = useWeb3Provider()

	// Claim
	const config = useMemo(() => currentConfig(chainId), [chainId])
	const uniYaxEthLP = useMemo(
		() => config?.pools['Uniswap YAX/ETH'],
		[config],
	)
	const {
		loading,
		lp: { pendingYax: earnings, staked: stakedUniLP },
		metavault: { pendingYax: mvEarnings, staked: stakedMvlt },
		governance: { staked: stakedYAX },
	} = useLegacyReturns(uniYaxEthLP?.pid)

	// Swap
	const [balances] = useAllTokenBalances()

	// Stake
	return useMemo(() => {
		return {
			loading,
			earnings,
			mvEarnings,
			balances: {
				stakedBalance: stakedYAX,
				yaxBalance: balances?.['yax']?.amount || new BigNumber(0),
			},
			yaxisBalance: balances?.['yaxis']?.amount || new BigNumber(0),
			stakedUniLP,
			uniLPBalance: balances?.['Linkswap']?.amount || new BigNumber(0),
			linkLPBalance: balances?.['Linkswap']?.amount || new BigNumber(0),
			mvltBalance: balances?.['mvlt']?.amount || new BigNumber(0),
			stakedMvlt: new BigNumber(stakedMvlt),
		}
	}, [
		loading,
		balances,
		earnings,
		mvEarnings,
		stakedMvlt,
		stakedUniLP,
		stakedYAX,
	])
}

export default useSwapData

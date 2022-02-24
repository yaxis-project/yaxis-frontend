import React, { useMemo } from 'react'
import * as AllModals from './Modal'

import useWeb3Provider from '../../hooks/useWeb3Provider'
import { CHAIN_INFO } from '../../constants/chains'

const HIDDEN_MODALS = {
	ethereum: [],
	avalanche: [AllModals.MerkleDrop],
}

const Modals: React.FC = () => {
	const { chainId } = useWeb3Provider()

	const chain = useMemo(() => CHAIN_INFO[chainId], [chainId])

	const modals = useMemo(() => {
		if (!chain?.blockchain) return []
		return Object.values(AllModals)
			.filter(
				(modal) =>
					!(HIDDEN_MODALS[chain?.blockchain] || []).includes(modal),
			)
			.map((M, i) => <M key={`Modal-${i}`} />)
	}, [chain])

	return <>{modals}</>
}

export default Modals

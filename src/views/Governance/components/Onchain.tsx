import React from 'react'
import { GaugeWeight } from './GaugeWeight'
import { Vaults as VaultsEthereum } from '../../../constants/type/ethereum'
import { Vaults as VaultsAvalanche } from '../../../constants/type/avalanche'
import { useChainInfo } from '../../../state/user'

const Onchain: React.FC = () => {
	const chainInfo = useChainInfo()
	const vaults =
		chainInfo.blockchain === 'ethereum' ? VaultsEthereum : VaultsAvalanche
	return <GaugeWeight vaults={vaults} />
}

export { Onchain }

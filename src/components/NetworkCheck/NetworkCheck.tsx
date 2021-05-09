import React, { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Modal } from 'antd'
import { SUPPORTED_NETWORKS, NETWORK_NAMES } from '../../connectors'

const NetworkCheck: React.FC = ({ children }) => {
	const { chainId, active } = useWeb3React()
	const visible = useMemo(
		() => active && !SUPPORTED_NETWORKS.includes(chainId),
		[active, chainId],
	)

	return (
		<>
			{children}
			<Modal
				closable={false}
				visible={visible}
				title={'Unsupported Network'}
				footer={null}
			>
				<>
					<div>
						Please switch to one of the following Ethereum networks
					</div>
					{SUPPORTED_NETWORKS.map((n) => {
						const name = NETWORK_NAMES[n]
						return (
							<div key={n}>
								{name && name[0].toUpperCase() + name.slice(1)}
							</div>
						)
					})}
				</>
			</Modal>
		</>
	)
}

export default NetworkCheck

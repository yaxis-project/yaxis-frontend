import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Modal, Row, Col } from 'antd'
import { SUPPORTED_NETWORKS } from '../../../../connectors'
import { ApplicationModal } from '../../../../state/application/actions'
import {
	useOpenModal,
	useCloseModal,
	useIsModalOpen,
} from '../../../../state/application/hooks'
import useTranslation from '../../../../hooks/useTranslation'
import Typography from '../../../Typography'
import Button from '../../../Button'
import { switchToNetwork } from '../../../../utils/switchToNetwork'
import { CHAIN_INFO } from '../../../../constants/chains'
import { useSetChain } from '../../../../state/user'

const { Text } = Typography

export const NetworkCheck: React.FC = () => {
	const translate = useTranslation()
	const { chainId, active, library } = useWeb3React()
	const setChainId = useSetChain()

	const visible = useIsModalOpen(ApplicationModal['UNSUPPORTED_NETWORK'])
	const openModal = useOpenModal(ApplicationModal['UNSUPPORTED_NETWORK'])
	const closeModal = useCloseModal()

	useEffect(() => {
		if (active && !SUPPORTED_NETWORKS.includes(chainId)) openModal()
	}, [active, chainId, openModal])

	useEffect(() => {
		if (visible && SUPPORTED_NETWORKS.includes(chainId)) closeModal()
	}, [visible, chainId, closeModal])

	return (
		<Modal
			closable={false}
			visible={visible}
			title={translate('Unsupported Network')}
			footer={null}
		>
			<>
				<Text>
					{translate(
						'Please switch to one of the following networks',
					)}
					:
				</Text>
				<Row>
					{SUPPORTED_NETWORKS.map((chainId) => {
						return (
							<Col key={chainId}>
								<Button
									onClick={() => {
										try {
											switchToNetwork({
												library,
												chainId,
											})
											setChainId(chainId)
										} catch {
											//
										}
									}}
								>
									<img
										src={CHAIN_INFO[chainId].logoUrl}
										height="30"
										width="30"
										alt={`${CHAIN_INFO[chainId].label} logo`}
									/>{' '}
									{CHAIN_INFO[chainId].label}
								</Button>
							</Col>
						)
					})}
				</Row>
			</>
		</Modal>
	)
}

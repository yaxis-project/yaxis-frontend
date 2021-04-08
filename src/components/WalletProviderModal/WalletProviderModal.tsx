import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import Modal, { ModalProps } from '../Modal'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'
import WalletCard from './components/WalletCard'
import { Col, Row } from 'antd'

import { SUPPORTED_WALLETS } from '../../connectors'
import { getErrorMessage } from '../../connectors/errors'
import { handleInjected, filterByDevice } from './utils'

const WalletProviderModal: React.FC<ModalProps> = ({ onDismiss }) => {
	const { account, error } = useWeb3Provider()
	useEffect(() => {
		if (account) {
			onDismiss()
		}
	}, [account, onDismiss])

	const wallets = useMemo(() => {
		const options = Object.values(SUPPORTED_WALLETS)
		const byDevice = filterByDevice(options)
		return handleInjected(byDevice)
	}, [])

	return (
		<Modal>
			<CloseButton
				shape="circle"
				icon={<CloseOutlined style={{ fontSize: '25px' }} />}
				onClick={onDismiss}
			/>
			<ModalTitle text="Select a wallet provider." />
			{error && <ErrorText>{getErrorMessage(error)}</ErrorText>}
			<ModalContent>
				<StyledWalletsWrapper
					gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
				>
					{wallets.map((config, i) => {
						return (
							<StyledWalletCard
								key={`${i}-${config.name}`}
								className="gutter-row"
								span={
									wallets.length
										? 24 * ((100 / wallets.length) * 0.01)
										: 24
								}
							>
								<WalletCard config={config} />
							</StyledWalletCard>
						)
					})}
				</StyledWalletsWrapper>
			</ModalContent>
		</Modal>
	)
}

const StyledWalletsWrapper = styled(Row)``

const StyledWalletCard = styled(Col)``

const ErrorText = styled.div`
	color: red;
	font-weight: 600;
	text-align: center;
`

const CloseButton = styled(Button)`
	position: absolute;
	top: 5%;
	right: 5%;
	border: none;
`

export default WalletProviderModal

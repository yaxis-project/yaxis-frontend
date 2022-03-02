import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Pagination } from 'antd'
import WalletCard from './components/WalletCard'
import { Modal, Col, Row } from 'antd'
import { SUPPORTED_NETWORKS, SUPPORTED_WALLETS } from '../../../../connectors'
import { getErrorMessage } from '../../../../connectors/errors'
import { handleInjected, filterByDevice } from './utils'
import { ApplicationModal } from '../../../../state/application/actions'
import {
	useIsModalOpen,
	useCloseModal,
} from '../../../../state/application/hooks'
import useTranslation from '../../../../hooks/useTranslation'
import { useWeb3React } from '@web3-react/core'

export const Wallet: React.FC = () => {
	const translate = useTranslation()

	const visible = useIsModalOpen(ApplicationModal['WALLET'])
	const closeModal = useCloseModal()

	const [page, setPage] = useState(1)

	const { account, error: walletError, chainId } = useWeb3React()

	const [error, setError] = useState(getErrorMessage(walletError))

	const unsupportedNetwork = useMemo(
		() => chainId && !SUPPORTED_NETWORKS.includes(chainId),
		[chainId],
	)

	useEffect(() => {
		if (account && visible) closeModal()
	}, [account, visible, closeModal])

	useEffect(() => {
		if (unsupportedNetwork)
			setError('Your wallet is connected to an unsupported network.')
		else if (walletError) setError(getErrorMessage(walletError))
	}, [setError, walletError, unsupportedNetwork])

	const wallets = useMemo(() => {
		const options = Object.values(SUPPORTED_WALLETS)
		const byDevice = filterByDevice(options)
		return handleInjected(byDevice)
	}, [])

	return (
		<Modal
			visible={visible}
			title={translate('Select a wallet provider.')}
			footer={null}
			onCancel={closeModal}
		>
			{error && <ErrorText>{error}</ErrorText>}
			<ModalContent>
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					{wallets
						.slice((page - 1) * 3, (page - 1) * 3 + 3)
						.map((config, i) => {
							return (
								<Col
									key={`${i}-${config.name}`}
									className="gutter-row"
									span={wallets.length ? 8 : 24}
								>
									<WalletCard
										config={config}
										error={!!unsupportedNetwork}
									/>
								</Col>
							)
						})}
				</Row>
				<Row justify="center" style={{ marginTop: '40px' }}>
					<StyledPagination
						current={page}
						onChange={(page) => setPage(page)}
						total={wallets.length}
						pageSize={3}
					/>
				</Row>
			</ModalContent>
		</Modal>
	)
}

const StyledPagination = styled(Pagination)`
	&&& {
		svg {
			fill: black;
		}
	}
`

const ErrorText = styled.div`
	color: red;
	font-weight: 600;
	text-align: center;
`
const ModalContent = styled.div`
	padding: ${(props) => props.theme.spacing[4]}px;
	@media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
		flex: 1;
		overflow: auto;
	}
`

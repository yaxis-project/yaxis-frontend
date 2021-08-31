import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import useWeb3Provider from '../../../../hooks/useWeb3Provider'
import { Pagination } from 'antd'
import WalletCard from './components/WalletCard'
import { Modal, Col, Row } from 'antd'
import { SUPPORTED_WALLETS } from '../../../../connectors'
import { getErrorMessage } from '../../../../connectors/errors'
import { handleInjected, filterByDevice } from './utils'
import { ApplicationModal } from '../../../../state/application/actions'
import {
	useIsModalOpen,
	useCloseModals,
} from '../../../../state/application/hooks'

export const Wallet: React.FC<any> = () => {
	const visible = useIsModalOpen(ApplicationModal['WALLET'])
	const closeModal = useCloseModals()

	const [page, setPage] = useState(1)

	const { account, error } = useWeb3Provider()

	useEffect(() => {
		if (account && visible) closeModal()
	}, [account, visible, closeModal])

	const wallets = useMemo(() => {
		const options = Object.values(SUPPORTED_WALLETS)
		const byDevice = filterByDevice(options)
		return handleInjected(byDevice)
	}, [])

	return (
		<Modal
			visible={visible}
			title={'Select a wallet provider.'}
			footer={null}
			onCancel={closeModal}
		>
			{error && <ErrorText>{getErrorMessage(error)}</ErrorText>}
			<ModalContent>
				<StyledWalletsWrapper
					gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
				>
					{wallets
						.slice((page - 1) * 3, (page - 1) * 3 + 3)
						.map((config, i) => {
							return (
								<StyledWalletCard
									key={`${i}-${config.name}`}
									className="gutter-row"
									span={wallets.length ? 8 : 24}
								>
									<WalletCard config={config} />
								</StyledWalletCard>
							)
						})}
				</StyledWalletsWrapper>
				<Row justify="center" style={{ marginTop: '40px' }}>
					<Pagination
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

const StyledWalletsWrapper = styled(Row)``

const StyledWalletCard = styled(Col)``

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

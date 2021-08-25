import React, { useEffect } from 'react'
import { Modal, Row, Col, Typography } from 'antd'
import { ApplicationModal } from '../../../../state/application/actions'
import {
	useOpenModal,
	useCloseModals,
	useIsModalOpen,
} from '../../../../state/application/hooks'
import { useUserUnclaimedAmount } from '../../../../state/internal/merkleDrop'
import useWeb3Provider from '../../../../hooks/useWeb3Provider'
import useContractWrite from '../../../../hooks/useContractWrite'
import Button from '../../../Button'
import vault from '../../../../assets/img/merkle_drop_vault.gif'
const { Title } = Typography

export const MerkleDrop: React.FC = () => {
	const { account } = useWeb3Provider()

	const { call: handleClaim, loading } = useContractWrite({
		contractName: 'internal.merkleDistributor',
		method: 'claim',
		description: `claimed Merkle Drop rewards`,
	})

	const visible = useIsModalOpen(ApplicationModal['MERKLE_DROP'])
	const openModal = useOpenModal(ApplicationModal['MERKLE_DROP'])
	const closeModal = useCloseModals()

	const userUnclaimedAmount = useUserUnclaimedAmount(account)

	useEffect(() => {
		if (userUnclaimedAmount && userUnclaimedAmount.amountBN.gt(0))
			openModal()
	}, [openModal, userUnclaimedAmount])

	return (
		<Modal
			title={null}
			visible={visible}
			onCancel={closeModal}
			footer={null}
		>
			<Row justify="center" style={{ marginTop: '30px' }}>
				<Col>
					<Title level={4}>
						Your strong hands have been rewarded.
					</Title>
				</Col>
			</Row>
			<Row justify="center">
				<Col>
					<img
						src={vault}
						alt={'Vault safe opening fille with money animation'}
						height={'auto'}
						width={'100%'}
						style={{ maxWidth: '400px' }}
					/>
				</Col>
			</Row>
			<Row justify="center" style={{ margin: '26px 20px 20px 20px' }}>
				<Col span={16}>
					<Button
						loading={loading}
						onClick={() => {
							if (userUnclaimedAmount)
								handleClaim({
									args: [
										userUnclaimedAmount.index,
										account,
										userUnclaimedAmount.amount,
										userUnclaimedAmount.proof,
									],
									cb: () => closeModal(),
									descriptionExtra: `claimed ${userUnclaimedAmount.amountBN.toNumber()} YAXIS`,
								})
						}}
					>
						Claim{' '}
						{userUnclaimedAmount &&
							userUnclaimedAmount.amountBN
								.div(10 ** 18)
								.toNumber()}{' '}
						YAXIS
					</Button>
				</Col>
			</Row>
		</Modal>
	)
}

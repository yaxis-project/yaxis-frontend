import React, { useEffect, useMemo } from 'react'
import { Modal } from 'antd'
import Typography from '../../../Typography'
import { ApplicationModal } from '../../../../state/application/actions'
import {
	useOpenModal,
	useCloseModal,
	useIsModalOpen,
} from '../../../../state/application/hooks'
import { setLastSeenUpdate, getLastSeenUpdate } from './util'
import * as Updates from './Updates'
import useTranslation from '../../../../hooks/useTranslation'

const { Title } = Typography

const LATEST_VERSION: Updates.UpdateVersion = 'V3_0_0'

export const Update: React.FC = () => {
	const translate = useTranslation()

	const visible = useIsModalOpen(ApplicationModal['UPDATE'])
	const openModal = useOpenModal(ApplicationModal['UPDATE'])
	const closeModal = useCloseModal()

	useEffect(() => {
		const lastSeenUpdate = getLastSeenUpdate()
		if (lastSeenUpdate !== LATEST_VERSION) openModal()
	}, [openModal])

	const { title, Body } = useMemo(() => Updates.Updates[LATEST_VERSION], [])

	return (
		<Modal
			title={
				<Title style={{ marginTop: '10px', padding: 0 }} level={3}>
					{translate(title)}
				</Title>
			}
			visible={visible}
			onCancel={() => {
				setLastSeenUpdate(LATEST_VERSION)
				closeModal()
			}}
			footer={null}
		>
			<Body />
		</Modal>
	)
}

import React, { useEffect, useMemo } from 'react'
import { Row, Col, Modal } from 'antd'
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
import logo from '../../../../assets/img/yaxisLogoFull.svg'

const { Title } = Typography

const LATEST_VERSION: Updates.UpdateVersion = 'V3_1_0'

export const Update: React.FC = () => {
	const translate = useTranslation()

	const visible = useIsModalOpen(ApplicationModal['UPDATE'])
	const openModal = useOpenModal(ApplicationModal['UPDATE'])
	const closeModal = useCloseModal()

	useEffect(() => {
		const lastSeenUpdate = getLastSeenUpdate()
		if (lastSeenUpdate !== LATEST_VERSION) openModal()
	}, [openModal])

	const { Body } = useMemo(() => Updates.Updates[LATEST_VERSION], [])

	return (
		<Modal
			title={
				<Row
					align="bottom"
					gutter={10}
					style={{ padding: 0, margin: 0 }}
				>
					<Col>
						<img
							src={logo}
							height={42}
							alt={`yAxis logo`}
							style={{ marginBottom: '6px' }}
						/>
					</Col>
					<Col>
						<Title style={{ padding: 0, margin: 0 }} level={4}>
							version{' '}
							{LATEST_VERSION.slice(1).replaceAll('_', '.')}
						</Title>
					</Col>
				</Row>
			}
			visible={visible}
			onCancel={() => {
				setLastSeenUpdate(LATEST_VERSION)
				closeModal()
			}}
			footer={null}
		>
			<Row justify="center" style={{ marginBottom: '10px' }}>
				<Col>
					<Title level={3}>{translate("What's new") + ':'}</Title>
				</Col>
			</Row>
			<Body />
		</Modal>
	)
}

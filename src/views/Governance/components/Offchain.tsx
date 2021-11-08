import React from 'react'
import { Row } from 'antd'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'

const { Text } = Typography

const Offchain: React.FC = () => (
	<>
		<Row style={{ margin: '7%' }}>
			<Text>Participate in the DAO by voting on YIPs.</Text>
		</Row>
		<Row style={{ margin: '5% 10% 5% 10%' }} justify="center">
			<Button
				style={{ width: '100%' }}
				target="_blank"
				href="https://gov.yaxis.io/#/"
				rel="noopener noreferrer"
			>
				<div style={{ marginTop: '8px' }}>
					<span
						style={{
							position: 'relative',
							fontSize: '20px',
							top: '3px',
						}}
					>
						⚡️
					</span>
					Snapshot
				</div>
			</Button>
		</Row>
	</>
)

export { Offchain }

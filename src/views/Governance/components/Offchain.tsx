import React from 'react'
import { Row, Col } from 'antd'
import Typography from '../../../components/Typography'

const { Text } = Typography

const Offchain: React.FC = () => (
	<>
		<Row style={{ margin: '2% 0' }} justify="center">
			<Text style={{ fontSize: '18px' }}>
				Participate in the DAO by voting on yAxis Improvement Proposals.
			</Text>
		</Row>
		<Row style={{ height: '500px', width: '100%' }} justify="center">
			<Col style={{ height: '100%', width: '100%' }}>
				<iframe
					title="snapshot"
					width="100%"
					height="100%"
					src="https://gov.yaxis.io/#/"
				/>
			</Col>
		</Row>
	</>
)

export { Offchain }

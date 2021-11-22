import React from 'react'
import Page from '../../components/Page/Page'
import { Row } from 'antd'
import MigrationCard from './components/MigrationCard'

const V3: React.FC = () => {
	return (
		<Page>
			<Row gutter={16}>
				<MigrationCard />
			</Row>
		</Page>
	)
}

export default V3

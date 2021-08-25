import React from 'react'
import Page from '../../components/Page/Page'
import { Row } from 'antd'
import SwapCard from './components/SwapCard'

const Staking: React.FC = () => {
	return (
		<Page>
			<Row gutter={16} style={{ paddingTop: '20px' }}>
				<SwapCard />
			</Row>
		</Page>
	)
}

export default Staking

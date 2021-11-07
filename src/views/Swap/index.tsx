import React from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import SwapCard from './components/SwapCard'
import SwapInfo from './components/SwapInfo'

const StyledCol = styled(Col)`
	@media only screen and (max-width: 1199px) {
		margin-top: 16px;
	}
`

const Staking: React.FC = () => {
	return (
		<Page>
			<Row gutter={16}>
				<Col md={24} lg={24} xl={16}>
					<SwapInfo />
				</Col>
				<StyledCol xs={24} sm={24} md={24} lg={24} xl={8}>
					<SwapCard />
				</StyledCol>
			</Row>
		</Page>
	)
}

export default Staking

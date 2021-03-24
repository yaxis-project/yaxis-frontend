import React, { useContext } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import { LanguageContext } from '../../contexts/Language'
import SwapCard from "./components/SwapCard"
import SwapInfo from "./components/SwapInfo"

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

const Staking: React.FC = () => {

	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	return (
		<div className="savings-view">
			<Page>
				<Row gutter={16}>
					<Col md={24} lg={16} >
						<SwapInfo />
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<SwapCard />
					</StyledCol>
				</Row>
			</Page>
		</div>
	)
}

export default Staking

import React, { useMemo } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import useTranslation from '../../hooks/useTranslation'
import {
	Deposit,
	Borrow,
	Repay,
	Withdraw,
	CollateralOverview,
	LoanOverview,
} from './components'

const Alchemix: React.FC = () => {
	const translate = useTranslation()

	return (
		<Page
			loading={false}
			mainTitle={translate('Borrow')}
			secondaryText="Future Yield Loans"
			value={'0.00'}
			valueInfo="Availalbe To Borrow"
		>
			<Row gutter={16}>
				<Col xs={24} sm={24} md={24} lg={16}>
					<Deposit />
					<Borrow />
					<Repay />
					<Withdraw />
				</Col>
				<StyledCol xs={24} sm={24} md={24} lg={8}>
					<CollateralOverview />
					<LoanOverview />
				</StyledCol>
			</Row>
		</Page>
	)
}

export default Alchemix

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

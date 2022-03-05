import styled from 'styled-components'
import { Row, Col } from 'antd'
import { useContracts } from '../../../contexts/Contracts'
import Value from '../../../components/Value'
import { ExpandableSidePanel } from '../../../components/ExpandableSidePanel'
import CardRow from '../../../components/CardRow'
import Divider from '../../../components/Divider'
import Typography from '../../../components/Typography'

const { SecondaryText } = Typography

/**
 * Generates an expandable side panel that shows basic overview data for the home page.
 */
export function LoanOverview() {
	return (
		<ExpandableSidePanel header="Loans" icon="lineup">
			<CardRow
				main={<SecondaryText>Remaining debt</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value value="0.000 MIM" />
						</Col>
					</Row>
				}
			/>
			<CardRow
				main={<SecondaryText>Your LTV (Loan-To-Value)</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value value="0%" />
						</Col>
					</Row>
				}
			/>
			<CardRow
				main={<SecondaryText>Your XAXIS wallet balance</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value value="0.000 XAXIS" />
						</Col>
					</Row>
				}
			/>
			<CardRow
				main={<SecondaryText>Est. Date of Maturity</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value value="2/22/2023" />
						</Col>
					</Row>
				}
				last
			/>
		</ExpandableSidePanel>
	)
}

import styled from 'styled-components'
import { Row, Col } from 'antd'
import Value from '../../../components/Value'
import { ExpandableSidePanel } from '../../../components/ExpandableSidePanel'
import CardRow from '../../../components/CardRow'
import Typography from '../../../components/Typography'
import { useAllTokenBalances, useAlchemist } from '../../../state/wallet/hooks'

const { SecondaryText } = Typography

/**
 * Generates an expandable side panel that shows basic overview data for the home page.
 */
export function LoanOverview() {
	const [balances] = useAllTokenBalances()
	const { debt, deposited } = useAlchemist()
	console.log(balances)

	return (
		<ExpandableSidePanel header="Loans" icon="lineup">
			<CardRow
				main={<SecondaryText>Remaining debt</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value value={`${debt?.toNumber()} USDY`} />
						</Col>
					</Row>
				}
			/>
			<CardRow
				main={<SecondaryText>Your LTV (Loan-To-Value)</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value
								value={`${debt
									?.div(deposited)
									.times(100)
									.toFixed(3)} %`}
							/>
						</Col>
					</Row>
				}
			/>
			<CardRow
				main={<SecondaryText>Your USDY wallet balance</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value
								value={`${
									balances?.usdy?.amount
										? balances?.usdy?.amount.toNumber()
										: '0'
								} USDY`}
							/>
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

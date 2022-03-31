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
export function CollateralOverview() {
	const [balances] = useAllTokenBalances()
	const { deposited, debt, free, totalAPR } = useAlchemist()

	return (
		<ExpandableSidePanel header="Collateral" icon="lineup">
			<CardRow
				main={<SecondaryText>Your wallet balance</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value
								value={`${
									balances?.mim3crv?.amount
										? balances?.mim3crv?.amount.toNumber()
										: '0'
								} MIMcrv`}
							/>
						</Col>
					</Row>
				}
			/>
			<CardRow
				main={<SecondaryText>Your collateral balance</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value value={`${deposited?.toNumber()} MIMcrv`} />
						</Col>
					</Row>
				}
			/>
			<CardRow
				main={<SecondaryText>Your locked collateral</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value value={`${debt?.toNumber()} MIMcrv`} />
						</Col>
					</Row>
				}
			/>
			<CardRow
				main={<SecondaryText>Available to withdraw</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value value={`${free?.toNumber()} MIMcrv`} />
						</Col>
					</Row>
				}
			/>
			<CardRow
				main={<SecondaryText>MIMcrv APY</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value
								value={`${
									totalAPR.isNaN()
										? 0
										: totalAPR.multipliedBy(100).toFormat(2)
								} %`}
							/>
						</Col>
					</Row>
				}
				last
			/>
		</ExpandableSidePanel>
	)
}

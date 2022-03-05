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
export function CollateralOverview() {
	return (
		<ExpandableSidePanel header="Collateral" icon="lineup">
			<CardRow
				main={<SecondaryText>Your wallet balance</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value value="0.000 MIM" />
						</Col>
					</Row>
				}
			/>
			<CardRow
				main={<SecondaryText>Your locked collateral</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value value="0.000 MIM" />
						</Col>
					</Row>
				}
			/>
			<CardRow
				main={<SecondaryText>Available to withdraw</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value value="0.000 MIM" />
						</Col>
					</Row>
				}
			/>
			<CardRow
				main={<SecondaryText>MIM APY</SecondaryText>}
				secondary={
					<Row gutter={3}>
						<Col>
							<Value value="0.000 %" />
						</Col>
					</Row>
				}
				last
			/>
		</ExpandableSidePanel>
	)
}

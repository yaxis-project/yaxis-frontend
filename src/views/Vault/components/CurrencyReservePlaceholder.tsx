import React from 'react'
import { Row, Col } from 'antd'

import BalanceCard from '../../../components/Card/BalanceCard'

function CurrencyReservePlaceholder(): React.ReactElement {
	return (
		<Row gutter={8}>
			{[1, 2, 3, 4].map((c) => (
				<Col span={6} key={c}>
					<BalanceCard
						title="-----"
						balance={0}
						loading
						percent={0}
					/>
				</Col>
			))}
		</Row>
	)
}

export default CurrencyReservePlaceholder

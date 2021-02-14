import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, Tabs } from 'antd'
import DepositTable from './DepositTable'
import WithdrawTable from './WithdrawTable'

const { TabPane } = Tabs

const ContentWrapper = styled.div`
	width: 100%;
	height: 165px;
	background: #eff9ff;
	position: relative;
`

/**
 * Generates the component that contains tabs for deposit and withdrawal investment tokens.
 */
export default function InvestmentAccountActionCard() {
	const [loading, setLoading] = useState(true)

	setTimeout(() => setLoading(false), 1000)

	return (
		<Card className="investment-account-action-card">
			<Tabs defaultActiveKey="1">
				<TabPane tab="Deposit" key="1">
					<DepositTable />
				</TabPane>
				<TabPane tab="Withdraw" key="2">
					<WithdrawTable />
				</TabPane>
			</Tabs>
		</Card>
	)
}

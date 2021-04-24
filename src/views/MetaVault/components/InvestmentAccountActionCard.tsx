import { Card, Tabs } from 'antd'
import DepositTable from './DepositTable'
import WithdrawTable from './WithdrawTable'

const { TabPane } = Tabs

/**
 * Generates the component that contains tabs for deposit and withdrawal investment tokens.
 */
export default function InvestmentAccountActionCard() {
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

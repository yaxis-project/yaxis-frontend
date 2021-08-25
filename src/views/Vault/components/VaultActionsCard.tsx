import styled from 'styled-components'
import Tabs from '../../../components/Tabs'
import DepositTable from './DepositTable'
import StakeTable from './StakeTable'
import UnstakeTable from './UnstakeTable'
import WithdrawTable from './WithdrawTable'
import Card from '../../../components/Card'
import Tooltip from '../../../components/Tooltip'
import { Dropdown, Menu, Button, Checkbox, Row, Col } from 'antd'
import { useLocation, useHistory, Redirect } from 'react-router-dom'
import { SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import {
	useHasVaultTokenBalance,
	useHasGaugeTokenBalance,
} from '../../../state/wallet/hooks'
import {
	useVaultAutoStake,
	useSetVaultAutoStake,
} from '../../../state/user/hooks'

const { TabPane } = Tabs

const DEFAULT_TAB = '#deposit'

const TABS = {
	'#deposit': '#deposit',
	'#stake': '#stake',
	'#unstake': '#unstake',
	'#withdraw': '#withdraw',
}

const StyledButton = styled(Button)`
	background: ${(props) => props.theme.secondary.background};
	border: none;
	&:hover {
		background: ${(props) => props.theme.secondary.background};
	}
	&:active {
		background: ${(props) => props.theme.secondary.background};
	}
	&:focus {
		background: ${(props) => props.theme.secondary.background};
	}
`

const StyledIcon = styled(SettingOutlined)`
	color: ${(props) => props.theme.primary.font};
`

const SettingsMenu = () => {
	const autoStake = useVaultAutoStake()
	const setAutoStake = useSetVaultAutoStake()
	return (
		<Menu>
			<Row style={{ padding: '20px' }} align="middle">
				<Col>
					<Checkbox
						checked={autoStake}
						onClick={() => setAutoStake(!autoStake)}
					>
						Auto Stake
					</Checkbox>
				</Col>
				<Col>
					<Tooltip
						title={
							'Using Auto Staking allows for one click deposit & stake or unstake & withdraws, but requires an separate contract approval.'
						}
					>
						<QuestionCircleOutlined />
					</Tooltip>
				</Col>
			</Row>
		</Menu>
	)
}

const Operations = () => (
	<div style={{ padding: '0 10px' }}>
		<Dropdown
			overlay={<SettingsMenu />}
			placement="bottomLeft"
			trigger={['click']}
		>
			<StyledButton icon={<StyledIcon />} />
		</Dropdown>
	</div>
)

export default function VaultActionsCard() {
	const history = useHistory()
	const location = useLocation()

	const hasVaultTokenBalance = useHasVaultTokenBalance()
	const hasGaugeTokenBalance = useHasGaugeTokenBalance()

	const autoStake = useVaultAutoStake()

	if (location.hash && !TABS[location.hash]) return <Redirect to="/vault" />

	const showStake = hasVaultTokenBalance || location.hash === `#stake`
	const showUnstake = hasGaugeTokenBalance || location.hash === `#unstake`

	return (
		<StyledCard>
			<Tabs
				activeKey={location.hash || DEFAULT_TAB}
				onTabClick={(key) => history.push(`${location.pathname}${key}`)}
				tabBarExtraContent={<Operations />}
			>
				<TabPane tab="Deposit" key="#deposit">
					<DepositTable />
				</TabPane>
				{(showStake || !autoStake) && (
					<TabPane tab="Stake" key="#stake">
						<StakeTable />
					</TabPane>
				)}
				{(showUnstake || !autoStake) && (
					<TabPane tab="Unstake" key="#unstake">
						<UnstakeTable />
					</TabPane>
				)}
				<TabPane tab="Withdraw" key="#withdraw">
					<WithdrawTable />
				</TabPane>
			</Tabs>
		</StyledCard>
	)
}

const StyledCard = styled(Card)`
	.ant-card-body {
		padding: 0;
	}
`

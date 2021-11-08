import styled from 'styled-components'
import Tabs from '../../../components/Tabs'
import DepositTable from './DepositTable'
import DepositHelperTable from './DepositHelperTable'
import StakeTable from './StakeTable'
import UnstakeTable from './UnstakeTable'
import WithdrawTable from './WithdrawTable'
import WithdrawHelperTable from './WithdrawHelperTable'
import Card from '../../../components/Card'
import Tooltip from '../../../components/Tooltip'
import { Dropdown, Menu, Button, Checkbox, Row, Col } from 'antd'
import { useLocation, useHistory, Redirect } from 'react-router-dom'
import { SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import {
	useVaultAutoStake,
	useSetVaultAutoStake,
} from '../../../state/user/hooks'
import { TYaxisManagerData } from '../../../state/internal/hooks'
import useTranslation from '../../../hooks/useTranslation'

const { TabPane } = Tabs

const DEFAULT_TAB = '#deposit'

const TABS = {
	'#deposit': '#deposit',
	'#stake': '#stake',
	'#unstake': '#unstake',
	'#withdraw': '#withdraw',
}

const TABS_AUTOSTAKE = {
	'#deposit': '#deposit',
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
	const translate = useTranslation()

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
						{translate('Auto Stake')}
					</Checkbox>
				</Col>
				<Col>
					<Tooltip
						title={translate(
							'Auto Staking allows for one click deposit & stake or unstake & withdraw, but requires additional contract approvals to set up.',
						)}
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

interface VaultActionsCardProps {
	fees: TYaxisManagerData
}

const VaultActionsCard: React.FC<VaultActionsCardProps> = ({ fees }) => {
	const translate = useTranslation()

	const history = useHistory()
	const location = useLocation()

	const autoStake = useVaultAutoStake()

	if (
		location.hash &&
		(autoStake ? !TABS_AUTOSTAKE[location.hash] : !TABS[location.hash])
	)
		return <Redirect to="/vault" />

	return (
		<StyledCard>
			<Tabs
				activeKey={location.hash || DEFAULT_TAB}
				onTabClick={(key) => history.push(`${location.pathname}${key}`)}
				tabBarExtraContent={<Operations />}
			>
				<TabPane tab={translate('Deposit')} key="#deposit">
					{autoStake ? (
						<DepositHelperTable fees={fees} />
					) : (
						<DepositTable fees={fees} />
					)}
				</TabPane>
				{!autoStake && (
					<TabPane tab={translate('Stake')} key="#stake">
						<StakeTable fees={fees} />
					</TabPane>
				)}
				{!autoStake && (
					<TabPane tab={translate('Unstake')} key="#unstake">
						<UnstakeTable fees={fees} />
					</TabPane>
				)}
				<TabPane tab={translate('Withdraw')} key="#withdraw">
					{autoStake ? (
						<WithdrawHelperTable fees={fees} />
					) : (
						<WithdrawTable fees={fees} />
					)}
				</TabPane>
			</Tabs>
		</StyledCard>
	)
}

export default VaultActionsCard

const StyledCard = styled(Card)`
	.ant-card-body {
		padding: 0;
	}
`

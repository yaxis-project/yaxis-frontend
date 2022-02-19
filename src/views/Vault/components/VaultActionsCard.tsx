import { useMemo } from 'react'
import styled from 'styled-components'
import { Currencies, Currency } from '../../../constants/currencies'
import Tabs from '../../../components/Tabs'
import DepositTable from './DepositTable'
import DepositHelperTable from './DepositHelperTable'
import StakeTable from './StakeTable'
import UnstakeTable from './UnstakeTable'
import WithdrawTable from './WithdrawTable'
import WithdrawHelperTable from './WithdrawHelperTable'
import Card from '../../../components/Card'
import Icon from '../../../components/Icon'
import Tooltip from '../../../components/Tooltip'
import { LPVaults } from '../../../constants/type/ethereum'
import { Dropdown, Menu, Button, Checkbox, Row, Col } from 'antd'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { QuestionCircleOutlined } from '@ant-design/icons'
import {
	useVaultAutoStake,
	useSetVaultAutoStake,
} from '../../../state/user/hooks'
import { TYaxisManagerData } from '../../../state/internal/hooks'
import useTranslation from '../../../hooks/useTranslation'

const { TabPane } = Tabs

const DEFAULT_TAB = '#deposit'
const DEFAULT_TAB_YAXIS_DETAILS = '#unstake'

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

const TABS_YAXIS_DETAILS = {
	'#unstake': '#unstake',
}

const StyledButton = styled(Button)`
	background: ${(props) => props.theme.secondary.background};
	border: none;
	padding: 0;
	margin-right: 20px;

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
	<Dropdown
		overlay={<SettingsMenu />}
		placement="bottomLeft"
		trigger={['click']}
	>
		<StyledButton shape="round">
			<Icon type="gear" />
		</StyledButton>
	</Dropdown>
)

interface VaultActionsCardProps {
	fees: TYaxisManagerData
	currencies: Currency[]
	type: 'overview' | 'details'
}

const VaultActionsCard: React.FC<VaultActionsCardProps> = ({
	fees,
	currencies,
	type,
}) => {
	const translate = useTranslation()

	const navigate = useNavigate()
	const location = useLocation()

	const autoStake = useVaultAutoStake()
	const isYaxisDetails = currencies.every(
		(currency) => currency.tokenId === 'yaxis',
	)

	const showDepositTab = useMemo(() => !isYaxisDetails, [isYaxisDetails])
	const showStakeTab = useMemo(
		() => !autoStake && !isYaxisDetails,
		[autoStake, isYaxisDetails],
	)
	const showUnstakeTab = useMemo(
		() => !autoStake || isYaxisDetails,
		[autoStake, isYaxisDetails],
	)
	const showWithdrawTab = useMemo(() => !isYaxisDetails, [isYaxisDetails])

	const activeKey = useMemo(() => {
		if (location.hash) return location.hash
		if (isYaxisDetails) return DEFAULT_TAB_YAXIS_DETAILS
		return DEFAULT_TAB
	}, [location.hash, isYaxisDetails])

	const allowedRoutes = useMemo(() => {
		if (type === 'details' && isYaxisDetails) return TABS_YAXIS_DETAILS
		if (autoStake) return TABS_AUTOSTAKE
		return TABS
	}, [type, isYaxisDetails, autoStake])

	if (location.hash && !allowedRoutes[location.hash])
		return <Navigate to="/vault" />

	return (
		<StyledCard>
			<Tabs
				activeKey={activeKey}
				onTabClick={(key) => navigate(`${location.pathname}${key}`)}
				tabBarExtraContent={<Operations />}
			>
				{showDepositTab && (
					<TabPane tab={translate('Deposit')} key="#deposit">
						{autoStake ? (
							<DepositHelperTable
								fees={fees}
								currencies={
									// NOTE: YAXIS vault deprecated in YIP-14
									currencies.filter(
										(currency) =>
											currency.tokenId !== 'yaxis',
									)
								}
							/>
						) : (
							<DepositTable
								fees={fees}
								currencies={currencies
									// YAXIS only has a gauge, so we filter it out
									.filter(
										(currency) =>
											currency.tokenId !== 'yaxis',
									)}
							/>
						)}
					</TabPane>
				)}
				{showStakeTab && (
					<TabPane tab={translate('Stake')} key="#stake">
						<StakeTable
							fees={fees}
							currencies={
								// NOTE: YAXIS vault deprecated in YIP-14
								currencies.filter(
									(currency) => currency.tokenId !== 'yaxis',
								)
							}
						/>
					</TabPane>
				)}
				{showUnstakeTab && (
					<TabPane tab={translate('Unstake')} key="#unstake">
						<UnstakeTable
							fees={fees}
							currencies={currencies.map((currency) => {
								const [, vault] = LPVaults.find(
									([lpToken]) => lpToken === currency.tokenId,
								)
								const vaultToken =
									vault === 'yaxis' ? 'yaxis' : `cv:${vault}`
								const gaugeToken = `${vaultToken}-gauge`
								return Currencies[gaugeToken.toUpperCase()]
							})}
						/>
					</TabPane>
				)}
				{showWithdrawTab && (
					<TabPane tab={translate('Withdraw')} key="#withdraw">
						{autoStake ? (
							<WithdrawHelperTable
								fees={fees}
								currencies={currencies}
							/>
						) : (
							<WithdrawTable
								fees={fees}
								currencies={currencies
									// YAXIS only has a gauge, so we filter it out
									.filter(
										(currency) =>
											currency.tokenId !== 'yaxis',
									)
									.map((currency) => {
										const [, vault] = LPVaults.find(
											([lpToken]) =>
												lpToken === currency.tokenId,
										)
										return Currencies[
											`CV:${vault.toUpperCase()}`
										]
									})}
							/>
						)}
					</TabPane>
				)}
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

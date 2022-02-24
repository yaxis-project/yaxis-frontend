import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col, Checkbox } from 'antd'
import Select from '../../../components/Select'
import Input from '../../../components/Input'
import Slider from '../../../components/Slider'
import Divider from '../../../components/Divider'
import Typography from '../../../components/Typography'
import { Currencies } from '../../../constants/currencies'
import { currentConfig } from '../../../constants/configs'
import { TVaults } from '../../../constants/type'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import useTranslation from '../../../hooks/useTranslation'
import { ExpandableSidePanel } from '../../../components/ExpandableSidePanel'
import { useVaultsBalances, useVotingPower } from '../../../state/wallet/hooks'
import BigNumber from 'bignumber.js'

const MAX_TIME = 1 * 365 * 24 * 60 * 60
const TOKENLESS_PRODUCTION = 40

const { Option } = Select
const { Title, Text } = Typography

const BoostCalculator: React.FC = () => {
	const { chainId } = useWeb3Provider()

	const vaults = useMemo(() => currentConfig(chainId).vaults, [chainId])

	const translate = useTranslation()

	const votingEscrow = useVotingPower()

	const { balances } = useVaultsBalances()

	const [selectedVault, setSelectedVault] = useState<TVaults>(null)

	const selectedVaultBalance = useMemo(() => {
		if (!selectedVault) return null
		const amount = balances[selectedVault]?.gaugeToken?.amount
		if (!amount) return 0
		return amount.toFixed(2)
	}, [selectedVault, balances])

	const [inputVaultBalance, setInputVaultBalance] = useState('')

	const [useVaultBalance, setUseVaultBalance] = useState(true)

	const selectedVaultTotal = useMemo(() => {
		if (!selectedVault) return null
		const amount = balances[selectedVault]?.totalSupply.dividedBy(10 ** 18)
		if (!amount) return 0
		return amount.toFixed(2)
	}, [selectedVault, balances])

	const [inputVaultTotal, setInputVaultTotal] = useState('')

	const [useVaultTotal, setUseVaultTotal] = useState(true)

	const [yaxisLocked, setYaxisLocked] = useState('')

	const [duration, setDuration] = useState(1)

	const [vp, setVp] = useState(new BigNumber(0))
	useEffect(() => {
		const yaxisLockedBN = new BigNumber(yaxisLocked)
		setVp(
			yaxisLockedBN.isNaN()
				? new BigNumber(0)
				: yaxisLockedBN
						.multipliedBy(10 ** 18)
						.dividedBy(MAX_TIME)
						.multipliedBy(duration * 7 * 86400),
		)
	}, [yaxisLocked, duration])

	const vpPercentage = useMemo(
		() =>
			vp.isZero()
				? new BigNumber(0)
				: vp.dividedBy(
						votingEscrow.totalSupply
							.minus(votingEscrow.balance)
							.plus(vp),
				  ),
		[vp, votingEscrow],
	)

	const [boost, setBoost] = useState('1')
	useEffect(() => {
		const vaultBalance = useVaultBalance
			? balances[selectedVault]?.gaugeToken?.value || new BigNumber(0)
			: new BigNumber(inputVaultBalance || 0).multipliedBy(10 ** 18)

		const vaultTotal = useVaultTotal
			? balances[selectedVault]?.totalSupply || new BigNumber(0)
			: new BigNumber(inputVaultTotal || 0).multipliedBy(10 ** 18)

		const unboostedMinimum = vaultBalance
			.multipliedBy(TOKENLESS_PRODUCTION)
			.dividedBy(100)

		const unboostedBalance = unboostedMinimum.lt(vaultBalance)
			? unboostedMinimum
			: vaultBalance

		const workingBalance = unboostedMinimum.plus(
			vaultTotal
				.multipliedBy(vpPercentage)
				.multipliedBy(100 - TOKENLESS_PRODUCTION)
				.dividedBy(100),
		)

		const boostedBalance = workingBalance.lt(vaultBalance)
			? workingBalance
			: vaultBalance

		const boost = unboostedBalance.isZero()
			? new BigNumber(1)
			: boostedBalance.dividedBy(unboostedBalance)
		setBoost(boost.toString())
	}, [
		selectedVault,
		vpPercentage,
		balances,
		useVaultBalance,
		inputVaultBalance,
		useVaultTotal,
		selectedVaultTotal,
		inputVaultTotal,
	])

	return (
		<ExpandableSidePanel
			header={translate('Boost Calculator')}
			icon="calculator"
		>
			<Background>
				<Select
					size={'large'}
					showArrow={true}
					placeholder={'Select a vault'}
					value={selectedVault}
					onChange={(value) => setSelectedVault(value)}
				>
					{/* // TODO CHECK */}
					{Object.keys(vaults)
						.filter((v) => v !== 'yaxis')
						.map((vault) => (
							<Option value={vault} key={vault}>
								<img
									src={Currencies[vault.toUpperCase()].icon}
									height="30"
									width="30"
									alt="logo"
								/>
								<span style={{ marginLeft: '10px' }}>
									{vault.toUpperCase()}
								</span>
							</Option>
						))}
				</Select>
				<Row style={{ marginTop: '15px' }}>
					<Title level={5}>Amount Deposited:</Title>
				</Row>
				<Input
					value={
						useVaultBalance
							? selectedVaultBalance
							: inputVaultBalance
					}
					suffix={selectedVault ? vaults[selectedVault].token : '-'}
					disabled={!selectedVault || useVaultBalance}
					onChange={(e) =>
						!isNaN(Number(e.target.value)) &&
						setInputVaultBalance(e.target.value)
					}
				/>
				<Checkbox
					disabled={!selectedVault}
					style={{ marginTop: '5px' }}
					checked={useVaultBalance}
					onChange={() => setUseVaultBalance(!useVaultBalance)}
				>
					<Text>Use your current balance</Text>
				</Checkbox>
				<Row style={{ marginTop: '15px' }}>
					<Title level={5}>Total in Vault:</Title>
				</Row>
				<Input
					value={useVaultTotal ? selectedVaultTotal : inputVaultTotal}
					suffix={selectedVault ? vaults[selectedVault].token : '-'}
					disabled={!selectedVault || useVaultTotal}
					onChange={(e) =>
						!isNaN(Number(e.target.value)) &&
						setInputVaultTotal(e.target.value)
					}
				/>
				<Checkbox
					disabled={!selectedVault}
					style={{ marginTop: '5px' }}
					checked={useVaultTotal}
					onChange={() => setUseVaultTotal(!useVaultTotal)}
				>
					<Text>Use the current total</Text>
				</Checkbox>
				<Row style={{ marginTop: '15px' }}>
					<Title level={5}>YAXIS locked:</Title>
				</Row>
				<Input
					value={yaxisLocked}
					suffix={'YAXIS'}
					onChange={(e) => {
						!isNaN(Number(e.target.value)) &&
							setYaxisLocked(e.target.value)
					}}
				/>
				<Row style={{ marginTop: '15px' }}>
					<Title level={5}>Lock duration:</Title>
				</Row>
				<Slider
					value={duration}
					min={1}
					max={52}
					tooltipPlacement="left"
					tooltipVisible={false}
					onChange={(value) => {
						setDuration(value)
					}}
				/>
				<Row justify="center">
					<Text>
						{duration > 1
							? `${duration} weeks`
							: `${duration} week`}
					</Text>
				</Row>
				<>
					<Divider />

					<Row style={{ marginTop: '15px' }}>
						<Title level={4}>Results in:</Title>
					</Row>
					<Row gutter={4} style={{ marginTop: '5px' }}>
						<Col>
							<Text
								style={{
									fontSize: '16px',
									padding: 0,
									margin: 0,
								}}
							>
								Rewards to this Vault boosted by{' '}
								<span
									style={{
										fontSize: '17px',
										fontWeight: 900,
									}}
								>
									x{new BigNumber(boost).toFormat(2)}
								</span>
								.
							</Text>
						</Col>
					</Row>
					<Row style={{ marginTop: '10px' }}>
						<Text
							style={{
								fontSize: '16px',
								padding: 0,
								margin: 0,
							}}
						>
							Controlling{' '}
							<span
								style={{
									fontSize: '17px',
									fontWeight: 900,
								}}
							>
								{vpPercentage.multipliedBy(100).toFormat(2) +
									'%'}
							</span>{' '}
							of total Voting Power.
						</Text>
					</Row>
				</>
			</Background>
		</ExpandableSidePanel>
	)
}

export { BoostCalculator }

const Background = styled.div`
	padding: 20px;

	&&& {
		background: ${(props) => props.theme.secondary.background};
		border-color: ${(props) => props.theme.secondary.border};
	}
`

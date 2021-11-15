import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { Row, Checkbox } from 'antd'
import Select from '../../../components/Select'
import Input from '../../../components/Input'
import Slider from '../../../components/Slider'
import Divider from '../../../components/Divider'
import Typography from '../../../components/Typography'
import { Currencies } from '../../../constants/currencies'
import { currentConfig } from '../../../constants/configs'
import { Vaults, TVaults } from '../../../constants/type'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import useTranslation from '../../../hooks/useTranslation'
import { ExpandableSidePanel } from '../../../components/ExpandableSidePanel'
import { useUserBoost, useVaultsBalances } from '../../../state/wallet/hooks'

const WEEK_TIME = 60 * 60 * 24 * 7

const { Option } = Select
const { Title, Text } = Typography

const BoostCalculator: React.FC = () => {
	const { chainId } = useWeb3Provider()

	const vaults = useMemo(() => currentConfig(chainId).vaults, [chainId])

	const translate = useTranslation()

	const { loading: loadingBalances, balances } = useVaultsBalances()

	const boosts = useUserBoost('3crv')

	const [selectedVault, setSelectedVault] = useState<TVaults>(null)

	const selectedVaultBalance = useMemo(() => {
		if (!selectedVault) return null
		const amount = balances[selectedVault]?.gaugeToken?.amount
		if (!amount) return null
		return amount.toFixed(2)
	}, [selectedVault, balances])

	const [inputVaultBalance, setInputVaultBalance] = useState('')

	const [useVaultBalance, setUseVaultBalance] = useState(true)

	const [yaxisLocked, setYaxisLocked] = useState('')

	const [duration, setDuration] = useState(1)

	return (
		<ExpandableSidePanel header={translate('Boost Calculator')}>
			<Background>
				<Select
					size={'large'}
					showArrow={true}
					placeholder={'Select a vault'}
					value={selectedVault}
					onChange={(value) => setSelectedVault(value)}
				>
					{Vaults.map((vault) => (
						<Option value={vault}>
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
					<Title level={5}>Voting Power % for 2.5x boost:</Title>
				</Row>
				<Row justify="center">
					{/* TODO */}
					<Text>{selectedVault ? '0.00%' : '-.--%'}</Text>
				</Row>
				<Divider />
				<Row>
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
					onChange={(e) => setInputVaultBalance(e.target.value)}
				/>
				<Checkbox
					disabled={!selectedVault}
					style={{ marginTop: '5px' }}
					checked={useVaultBalance}
					onChange={() => setUseVaultBalance(!useVaultBalance)}
				>
					<Text>Use current balance</Text>
				</Checkbox>

				<Row style={{ marginTop: '15px' }}>
					<Title level={5}>YAXIS locked:</Title>
				</Row>
				<Input
					value={yaxisLocked}
					suffix={'YAXIS'}
					onChange={(e) => setYaxisLocked(e.target.value)}
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

				<Divider />

				<Row style={{ marginTop: '15px' }}>
					<Title level={4}>Results in:</Title>
				</Row>
				<Row style={{ marginTop: '15px' }} justify="center">
					{/* TODO */}
					<Title level={5}>0.00% of total Voting Power</Title>
				</Row>
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

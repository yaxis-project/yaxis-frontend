import { useState, useMemo, useCallback } from 'react'
import { Currencies, Currency } from '../../../constants/currencies'
import {
	useVaultsAPRWithBoost,
	useVaultsBalances,
	VaultsAPRWithBoost,
} from '../../../state/wallet/hooks'
import { usePrices } from '../../../state/prices/hooks'
import useTranslation from '../../../hooks/useTranslation'
import { Row, Col, Grid, Form, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import styled from 'styled-components'
import { numberToDecimal } from '../../../utils/number'
import useContractWrite from '../../../hooks/useContractWrite'
import { useContracts } from '../../../contexts/Contracts'
import { NavLink } from 'react-router-dom'
import Button from '../../../components/Button'
import Table from '../../../components/Table'
import Typography from '../../../components/Typography'
import Divider from '../../../components/Divider'
import {
	CurrencyValues,
	handleFormInputChange,
	computeInsufficientBalance,
} from '../utils'
import BigNumber from 'bignumber.js'
import Value from '../../../components/Value'
import Input from '../../../components/Input'
import ApprovalCover from '../../../components/ApprovalCover'
import { TYaxisManagerData } from '../../../state/internal/hooks'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Contracts, VaultC } from '../../../constants/contracts'
import { useChainInfo } from '../../../state/user'
import { TVaults } from '../../../constants/type'

const { Text, Title } = Typography

type SortOrder = 'descend' | 'ascend' | null

const makeColumns = (
	loading: boolean,
	translate: ReturnType<typeof useTranslation>,
	onChange: ReturnType<typeof handleFormInputChange>,
	contracts: Contracts,
): ColumnsType<TableDataEntry> => {
	return [
		{
			title: translate('Vault'),
			key: 'vault',
			width: '150px',
			sorter: (a, b) => a.vault.localeCompare(b.vault),
			render: (text, record) => (
				<Row align="middle">
					<img src={record.icon} height="36" width="36" alt="logo" />
					<StyledText>{record.vault.toUpperCase()}</StyledText>
				</Row>
			),
		},
		{
			title: translate('Wallet Balance'),
			key: 'balance',
			defaultSortOrder: 'descend' as SortOrder,
			sorter: (a, b) =>
				new BigNumber(a.balanceUSD).minus(b.balanceUSD).toNumber(),
			render: (text, record) => (
				<>
					<Value
						value={new BigNumber(record.balanceUSD).toFormat(2)}
						numberPrefix="$"
					/>
					<Text type="secondary">
						{record.balance.toFormat(2)} {record.name}
					</Text>
				</>
			),
		},
		{
			title: translate('Amount'),
			key: 'amount',
			render: (text, record) => {
				const key = record.key

				return (
					<ApprovalCover
						contractName={`vaults.${key}.vaultToken.contract`}
						approvee={contracts?.vaults[key].gauge.address}
						noWrapper
						buttonText={'Approve Gauge'}
					>
						<Form.Item
							validateStatus={
								new BigNumber(record.value).gt(
									new BigNumber(record.balance),
								) && 'error'
							}
							style={{ marginBottom: 0 }}
						>
							<Input
								onChange={(e) =>
									onChange(record.tokenId, e.target.value)
								}
								value={record.inputValue}
								min={'0'}
								max={`${record.balance}`}
								placeholder="0"
								disabled={loading || record.balance.isZero()}
								suffix={record.name}
								onClickMax={() =>
									onChange(
										record.tokenId,
										record.balance.toString() || '0',
									)
								}
							/>
						</Form.Item>
					</ApprovalCover>
				)
			},
		},
		{
			title: translate('Current APR'),
			key: 'apy',
			sorter: (a, b) => a.apr.totalAPR.minus(b.apr.totalAPR).toNumber(),
			render: (text, record) => (
				<>
					<Row style={{ fontWeight: 'bolder' }}>
						<Text type="secondary">
							{record.apr.totalAPR.isNaN()
								? 0
								: record.apr.totalAPR
										.multipliedBy(100)
										.toFormat(2)}
							%
							<Tooltip
								style={{ minWidth: '350px' }}
								placement="topLeft"
								title={
									<div style={{ padding: '5px' }}>
										{record.apr.strategy &&
											record.apr.strategy.totalAPR && (
												<TooltipRow
													main={'Strategy APR'}
													value={
														record.apr.strategy &&
														record.apr.strategy.totalAPR
															.multipliedBy(100)
															.toNumber()
													}
												/>
											)}
										<TooltipRow
											main={'Rewards APR'}
											value={record.apr.yaxisAPR
												.multipliedBy(100)
												.toNumber()}
											boost={record.apr.boost}
										/>
										<Divider
											style={{
												borderColor: 'white',
												margin: '10px 0',
											}}
										/>
										{record.apr.boost.lt(2.5) && (
											<>
												<Row justify="center">
													<Button height="30px">
														<NavLink to="/governance">
															Lock & Boost
														</NavLink>
													</Button>
												</Row>
												<Row
													style={{
														fontWeight: 800,
														marginTop: '5px',
													}}
												>
													Get{' '}
													{record.apr.maxYaxisAPR
														.minus(
															record.apr.yaxisAPR,
														)
														.multipliedBy(100)
														.toFormat(2)}
													% extra APR!
												</Row>
											</>
										)}
									</div>
								}
							>
								<StyledInfoIcon />
							</Tooltip>
						</Text>
					</Row>
				</>
			),
		},
	]
}

const { useBreakpoint } = Grid

interface TableDataEntry extends Currency {
	balance: BigNumber
	balanceUSD: string
	value: BigNumber
	vault: string
	inputValue: string
	key: string
	apr: VaultsAPRWithBoost
}

interface StakeTableProps {
	fees: TYaxisManagerData
	vaults: [TVaults, VaultC][]
}

/**
 * Creates a stake table for the Vault account.
 */
const StakeTable: React.FC<StakeTableProps> = ({ fees, vaults }) => {
	const translate = useTranslation()

	const { loading, balances } = useVaultsBalances()

	const { contracts } = useContracts()
	const { md } = useBreakpoint()

	const apr = useVaultsAPRWithBoost()
	const { blockchain } = useChainInfo()

	const { call: handleStakeETH, loading: isSubmittingETH } = useContractWrite(
		{
			contractName: 'vaults.eth.gauge',
			method: 'deposit(uint256)',
			description: `staked in ETH Gauge`,
		},
	)

	const { call: handleStakeBTC, loading: isSubmittingBTC } = useContractWrite(
		{
			contractName: 'vaults.btc.gauge',
			method: 'deposit(uint256)',
			description: `staked in BTC Gauge`,
		},
	)

	const { call: handleStakeUSD, loading: isSubmittingUSD } = useContractWrite(
		{
			contractName: 'vaults.usd.gauge',
			method: 'deposit(uint256)',
			description: `staked in USD Gauge`,
		},
	)

	const { call: handleStakeLINK, loading: isSubmittingLINK } =
		useContractWrite({
			contractName: 'vaults.link.gauge',
			method: 'deposit(uint256)',
			description: `staked in LINK Gauge`,
		})

	const { call: handleStakeYAXIS, loading: isSubmittingYAXIS } =
		useContractWrite({
			contractName: 'vaults.yaxis.gauge',
			method: 'deposit(uint256)',
			description: `staked in YAXIS Gauge`,
		})

	const { call: handleStakeFRAX, loading: isSubmittingFRAX } =
		useContractWrite({
			contractName: 'vaults.frax.gauge',
			method: 'deposit(uint256)',
			description: `staked in FRAX Gauge`,
		})

	const { call: handleStakeTRICRYPTO, loading: isSubmittingTRICRYPTO } =
		useContractWrite({
			contractName: 'vaults.tricrypto.gauge',
			method: 'deposit(uint256)',
			description: `staked in TRICRYPTO Gauge`,
		})

	const { call: handleStakeCVX, loading: isSubmittingCVX } = useContractWrite(
		{
			contractName: 'vaults.cvx.gauge',
			method: 'deposit(uint256)',
			description: `staked in CVX Gauge`,
		},
	)

	const { call: handleStakeAV3CRV, loading: isSubmittingAV3CRV } =
		useContractWrite({
			contractName: 'vaults.av3crv.gauge',
			method: 'deposit(uint256)',
			description: `AV3CRV Vault stake`,
		})

	const { call: handleStakeATRICRYPTO, loading: isSubmittingATRICRYPTO } =
		useContractWrite({
			contractName: 'vaults.atricrypto.gauge',
			method: 'deposit(uint256)',
			description: `ATRICRYPTO Vault stake`,
		})

	const { call: handleStakeAVAX, loading: isSubmittingAVAX } =
		useContractWrite({
			contractName: 'vaults.avax.gauge',
			method: 'deposit(uint256)',
			description: `AVAX Vault stake`,
		})

	const { call: handleStakeJOEWAVAX, loading: isSubmittingJOEWAVAX } =
		useContractWrite({
			contractName: 'vaults.joewavax.gauge',
			method: 'deposit(uint256)',
			description: `JOEWAVAX Vault stake`,
		})

	const callsLookup = useMemo(() => {
		return {
			handleStakeETH,
			isSubmittingETH,
			handleStakeBTC,
			isSubmittingBTC,
			handleStakeUSD,
			isSubmittingUSD,
			handleStakeLINK,
			isSubmittingLINK,
			handleStakeYAXIS,
			isSubmittingYAXIS,
			handleStakeFRAX,
			isSubmittingFRAX,
			handleStakeTRICRYPTO,
			isSubmittingTRICRYPTO,
			handleStakeCVX,
			isSubmittingCVX,
			handleStakeAV3CRV,
			isSubmittingATRICRYPTO,
			handleStakeATRICRYPTO,
			isSubmittingAV3CRV,
			handleStakeAVAX,
			isSubmittingAVAX,
			handleStakeJOEWAVAX,
			isSubmittingJOEWAVAX,
		}
	}, [
		handleStakeETH,
		isSubmittingETH,
		handleStakeBTC,
		isSubmittingBTC,
		handleStakeUSD,
		isSubmittingUSD,
		handleStakeLINK,
		isSubmittingLINK,
		handleStakeYAXIS,
		isSubmittingYAXIS,
		handleStakeFRAX,
		isSubmittingFRAX,
		handleStakeTRICRYPTO,
		isSubmittingTRICRYPTO,
		handleStakeCVX,
		isSubmittingCVX,
		handleStakeAV3CRV,
		isSubmittingATRICRYPTO,
		handleStakeATRICRYPTO,
		isSubmittingAV3CRV,
		handleStakeAVAX,
		isSubmittingAVAX,
		handleStakeJOEWAVAX,
		isSubmittingJOEWAVAX,
	])

	const { prices } = usePrices()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>({})

	const disabled = useMemo(() => {
		return computeInsufficientBalance(
			currencyValues,
			Object.fromEntries(
				vaults.map(([vault, { vaultToken }]) => [
					vaultToken.tokenId,
					balances[vault.toLowerCase()].vaultToken,
				]),
			),
		)
	}, [vaults, currencyValues, balances])

	const totalDepositing = useMemo(
		() =>
			vaults
				.reduce(
					(
						total,
						[
							vault,
							{
								vaultToken: { tokenId },
							},
						],
					) => {
						const inputValue = currencyValues[tokenId]
						const inputNumber = Number(inputValue)
						const current = new BigNumber(
							isNaN(inputNumber) ? 0 : inputNumber,
						).times(balances[vault].vaultTokenPrice)
						return total.plus(current)
					},
					new BigNumber(0),
				)
				.toFormat(2),
		[vaults, currencyValues, balances],
	)

	const handleSubmit = useCallback(async () => {
		const transactions = vaults.reduce<[string, string][]>(
			(previous, [vault]) => {
				const vaultToken = vault === 'yaxis' ? 'yaxis' : `cv:${vault}`
				const _v = currencyValues[vaultToken]

				if (_v)
					previous.push([
						vault.toUpperCase(),
						numberToDecimal(
							_v,
							Currencies[vaultToken.toUpperCase()].decimals,
						),
					])

				return previous
			},
			[],
		)

		if (transactions.length > 0) {
			await Promise.allSettled(
				transactions.map(([token, amount]) =>
					callsLookup[`handleStake${token}`]({
						args: [amount],
						descriptionExtra: totalDepositing,
					}),
				),
			)
			setCurrencyValues(
				vaults.reduce(
					(prev, [, contracts]) => ({
						...prev,
						[contracts.token.tokenId]: '',
					}),
					{},
				),
			)
		}
	}, [vaults, currencyValues, callsLookup, totalDepositing])

	const data = useMemo(
		() =>
			vaults.map<TableDataEntry>(([vault, contracts]) => {
				const lpTokenCurrency = contracts.token
				const lpToken = lpTokenCurrency.tokenId
				const vaultToken = contracts.vaultToken.name.toLowerCase()
				const currency = Currencies[vaultToken.toUpperCase()]
				const balance =
					balances[vault].vaultToken?.amount || new BigNumber(0)
				return {
					...currency,
					vault,
					balance,
					balanceUSD: new BigNumber(prices[lpToken])
						.times(balance)
						.toFixed(2),
					value: currencyValues
						? new BigNumber(currencyValues[vaultToken] || 0)
						: new BigNumber(0),
					inputValue: currencyValues[vaultToken],
					key: vault,
					apr: apr[blockchain][vault],
				}
			}),
		[vaults, prices, balances, currencyValues, apr, blockchain],
	)

	const onUpdate = useMemo(() => handleFormInputChange(setCurrencyValues), [])

	const columns = useMemo(
		() => makeColumns(loading, translate, onUpdate, contracts),
		[translate, onUpdate, loading, contracts],
	)

	return (
		<>
			<Table<TableDataEntry>
				columns={columns}
				dataSource={data}
				pagination={false}
			/>
			<div
				style={
					md
						? { padding: '2% 30%' }
						: { padding: '0 10%', margin: '10px' }
				}
			>
				<Text type="secondary">{translate('Total')}</Text>
				<Title level={3} style={{ margin: '0 0 10px 0' }}>
					${totalDepositing}
				</Title>
				<Button
					disabled={disabled}
					loading={
						callsLookup.isSubmittingETH ||
						callsLookup.isSubmittingBTC ||
						callsLookup.isSubmittingLINK ||
						callsLookup.isSubmittingUSD
					}
					onClick={handleSubmit}
					style={{ fontSize: '18px', width: '100%' }}
				>
					{translate('Stake')}
				</Button>
				<Text
					type="secondary"
					style={{ marginTop: '10px', display: 'block' }}
				>
					{translate('Withdraw Fee')}:{' '}
					{fees.withdrawalProtectionFee.dividedBy(100).toNumber()}%
				</Text>
			</div>
		</>
	)
}

export default StakeTable

const StyledText = styled(Text)`
	margin-left: 16px;
	font-size: 18px;
	line-height: 1em;
`

const StyledInfoIcon = styled(InfoCircleOutlined)`
	margin-left: 5px;
	color: ${(props) => props.theme.secondary.font};
	font-size: 15px;
`

interface TooltipRowProps {
	main: string
	value: any
	boost?: BigNumber
}

const TooltipRow = ({
	main,
	value,
	boost = new BigNumber(0),
}: TooltipRowProps) => (
	<>
		<Row
			style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
		>
			{main}
		</Row>
		<Row gutter={8}>
			<Col>
				<Value
					value={value}
					numberSuffix={'%'}
					decimals={2}
					color={'white'}
				/>
			</Col>
			{boost.gt(1) && <Col>[{boost.toFormat(2)} Boost]</Col>}
		</Row>
	</>
)

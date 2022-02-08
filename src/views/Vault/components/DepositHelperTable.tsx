import { useState, useMemo, useCallback } from 'react'
import { LPVaults } from '../../../constants/type/ethereum'
import { Currencies, Currency } from '../../../constants/currencies'
import {
	useAllTokenBalances,
	useVaultsAPRWithBoost,
} from '../../../state/wallet/hooks'
import { usePrices } from '../../../state/prices/hooks'
import useTranslation from '../../../hooks/useTranslation'
import { NavLink } from 'react-router-dom'
import { Row, Col, Grid, Form, Tooltip } from 'antd'
import styled from 'styled-components'
import { numberToDecimal } from '../../../utils/number'
import useContractWrite from '../../../hooks/useContractWrite'
import { useContracts } from '../../../contexts/Contracts'
import Button from '../../../components/Button'
import Table from '../../../components/Table'
import Value from '../../../components/Value'
import Divider from '../../../components/Divider'
import Typography from '../../../components/Typography'
import {
	CurrencyValues,
	handleFormInputChange,
	computeInsufficientBalance,
	computeTotalDepositing,
} from '../utils'
import BigNumber from 'bignumber.js'
import Input from '../../../components/Input'
import ApprovalCover from '../../../components/ApprovalCover'
import { DoubleApprovalCover } from '../../../components/ApprovalCover/DoubleApprovalCover'
import { TYaxisManagerData } from '../../../state/internal/hooks'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Contracts } from '../../../constants/contracts'

const { Text, Title } = Typography

type SortOrder = 'descend' | 'ascend' | null

const makeColumns = (
	loading: boolean,
	translate: any,
	onChange: ReturnType<typeof handleFormInputChange>,
	contracts: Contracts
) => {
	return [
		{
			title: translate('Vault'),
			key: 'vault',
			width: '135px',
			sorter: (a, b) => a.vault.localeCompare(b.vault),
			render: (text, record) => (
				<Row align="middle">
					<NavLink to={`/vault/${record.vault}`}>
						<img
							src={record.icon}
							height="36"
							width="36"
							alt="logo"
						/>
						<StyledText>{record.vault.toUpperCase()}</StyledText>
					</NavLink>
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
				if (key === 'yaxis') return <ApprovalCover
					contractName={`currencies.ERC677.${key}.contract`}
					approvee={
						contracts?.vaults[key].gauge.address
					}
					noWrapper
					// Note: We display "Vault" to the user,
					// but it is really interacting with the Gauge
					buttonText={'Deposit'}
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
								onChange(record.tokenId, record.balance || '0')
							}
						/>
					</Form.Item>
				</ApprovalCover>

				return (
					<DoubleApprovalCover
						noWrapper
						contractName1={`vaults.${key}.token.contract`}
						approvee1={contracts?.vaults[key].vault.address}
						buttonText1={'Deposit'}
						contractName2={`vaults.${key}.token.contract`}
						approvee2={
							contracts?.internal.vaultHelper.address
						}
						buttonText2={'Automatic Staking'}
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
									onChange(record.tokenId, record.balance || '0')
								}
							/>
						</Form.Item>
					</DoubleApprovalCover>

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
										{record.apr.strategy.totalAPR && (
											<TooltipRow
												main={'Strategy APR'}
												value={record.apr.strategy.totalAPR
													.multipliedBy(100)
													.toNumber()}
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
}

interface DepositHelperTableProps {
	fees: TYaxisManagerData
	currencies: Currency[]
}

/**
 * Creates a deposit and stake table for the Vault account.
 */
const DepositHelperTable: React.FC<DepositHelperTableProps> = ({
	fees,
	currencies,
}) => {
	const translate = useTranslation()

	const [balances, loading] = useAllTokenBalances()

	const apr = useVaultsAPRWithBoost()

	const { contracts } = useContracts()
	const { md } = useBreakpoint()

	const { call: handleDeposit, loading: isSubmitting } = useContractWrite({
		contractName: 'internal.vaultHelper',
		method: 'depositVault',
		description: `Vault deposit`,
	})

	const { call: handleStakeYAXIS, loading: isSubmittingYAXIS } =
		useContractWrite({
			contractName: 'vaults.yaxis.gauge',
			method: 'deposit(uint256)',
			description: `staked in YAXIS Gauge`,
		})

	const { prices } = usePrices()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		currencies.reduce(
			(prev, curr) => ({
				...prev,
				[curr.tokenId]: '',
			}),
			{},
		),
	)

	const disabled = useMemo(
		() => computeInsufficientBalance(currencyValues, balances),
		[currencyValues, balances],
	)

	const totalDepositing = useMemo(
		() => computeTotalDepositing(currencies, currencyValues, prices),
		[currencies, currencyValues, prices],
	)

	const handleSubmit = useCallback(async () => {
		const transactions = LPVaults.reduce<[string, [string, string]][]>(
			(previous, [lpToken, vault]) => {
				const _v = currencyValues[lpToken]
				if (_v)
					previous.push([
						vault,
						[
							contracts.vaults[vault].vault.address,
							numberToDecimal(
								_v,
								Currencies[lpToken.toUpperCase()].decimals,
							),
						],
					])
				return previous
			},
			[],
		)

		if (transactions.length > 0) {
			await Promise.allSettled(
				transactions.map(([vault, args]) => {
					// Stake YAXIS into gauge
					if (vault === 'yaxis')
						return handleStakeYAXIS({ args: [args[1]] })

					// Deposit others using Vault Helper
					return handleDeposit({
						args,
						descriptionExtra: totalDepositing,
					})
				}),
			)
			setCurrencyValues(
				currencies.reduce(
					(prev, curr) => ({
						...prev,
						[curr.tokenId]: '',
					}),
					{},
				),
			)
		}
	}, [
		currencies,
		currencyValues,
		handleDeposit,
		totalDepositing,
		contracts,
		handleStakeYAXIS,
	])

	const data = useMemo(
		() =>
			currencies.map<TableDataEntry>((c) => {
				const [lpToken, vault] = LPVaults.find(
					([lpToken]) => lpToken === c.tokenId,
				)
				const currency = Currencies[lpToken.toUpperCase()]
				const balance = balances[lpToken]?.amount || new BigNumber(0)
				return {
					...currency,
					key: vault,
					vault,
					inputValue: currencyValues[lpToken],
					balance,
					balanceUSD: new BigNumber(prices[lpToken])
						.times(balance)
						.toFixed(2),
					value: currencyValues
						? new BigNumber(currencyValues[lpToken] || 0)
						: new BigNumber(0),
					apr: apr[vault],
				}
			}),
		[currencies, prices, balances, currencyValues, apr],
	)

	const onUpdate = useMemo(() => handleFormInputChange(setCurrencyValues), [])

	const columns = useMemo(
		() => makeColumns(loading, translate, onUpdate, contracts),
		[translate, onUpdate, loading, contracts],
	)

	return (
		<>
			<Table
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
					loading={isSubmitting || isSubmittingYAXIS}
					onClick={handleSubmit}
					style={{ fontSize: '18px', width: '100%' }}
				>
					{translate('Deposit')}
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

export default DepositHelperTable

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

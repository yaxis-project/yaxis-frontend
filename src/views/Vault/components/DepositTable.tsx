import { useState, useMemo, useCallback } from 'react'
import { LPVaults } from '../../../constants/type'
import { Currencies, Currency } from '../../../constants/currencies'
import {
	useAllTokenBalances,
	useVaultsAPRWithBoost,
} from '../../../state/wallet/hooks'
import { usePrices } from '../../../state/prices/hooks'
import useTranslation from '../../../hooks/useTranslation'
import { Row, Col, Grid, Form, Tooltip } from 'antd'
import styled from 'styled-components'
import { numberToDecimal } from '../../../utils/number'
import useContractWrite from '../../../hooks/useContractWrite'
import { useContracts } from '../../../contexts/Contracts'
import Button from '../../../components/Button'
import Table from '../../../components/Table'
import Divider from '../../../components/Divider'
import Typography from '../../../components/Typography'
import {
	CurrencyValues,
	handleFormInputChange,
	computeInsufficientBalance,
	computeTotalDepositing,
} from '../utils'
import { NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import Value from '../../../components/Value'
import Input from '../../../components/Input'
import ApprovalCover from '../../../components/ApprovalCover'
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
			width: '150px',
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

				return (
					<ApprovalCover
						contractName={`vaults.${key}.token.contract`}
						approvee={contracts?.vaults[key].vault.address}
						noWrapper
						buttonText={'Vault'}
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

const LPVaultsNoYAXIS = LPVaults.filter(([LPVault]) => LPVault !== 'yaxis')

interface TableDataEntry extends Currency {
	balance: BigNumber
	balanceUSD: string
	value: BigNumber
	vault: string
}

interface DepositTableProps {
	fees: TYaxisManagerData
	currencies: Currency[]
}

/**
 * Creates a deposit table for the Vault account.
 */
const DepositTable: React.FC<DepositTableProps> = ({ fees, currencies }) => {
	const translate = useTranslation()

	const [balances, loading] = useAllTokenBalances()

	const { contracts } = useContracts()
	const { md } = useBreakpoint()

	const apr = useVaultsAPRWithBoost()

	const { call: handleDepositETH, loading: isSubmittingETH } =
		useContractWrite({
			contractName: 'vaults.eth.vault',
			method: 'deposit',
			description: `deposit ETH Vault`,
		})

	const { call: handleDepositBTC, loading: isSubmittingBTC } =
		useContractWrite({
			contractName: 'vaults.btc.vault',
			method: 'deposit',
			description: `deposit BTC Vault`,
		})

	const { call: handleDepositUSD, loading: isSubmittingUSD } =
		useContractWrite({
			contractName: 'vaults.usd.vault',
			method: 'deposit',
			description: `deposit USD Vault`,
		})

	const { call: handleDepositLINK, loading: isSubmittingLINK } =
		useContractWrite({
			contractName: 'vaults.link.vault',
			method: 'deposit',
			description: `deposit LINK Vault`,
		})

	const { call: handleDepositFRAX, loading: isSubmittingFRAX } =
		useContractWrite({
			contractName: 'vaults.frax.vault',
			method: 'deposit',
			description: `deposit FRAX Vault`,
		})

	const { call: handleDepositTRICRYPTO, loading: isSubmittingTRICRYPTO } =
		useContractWrite({
			contractName: 'vaults.tricrypto.vault',
			method: 'deposit',
			description: `deposit TRICRYPTO Vault`,
		})

	const { call: handleDepositCVX, loading: isSubmittingCVX } =
		useContractWrite({
			contractName: 'vaults.cvx.vault',
			method: 'deposit',
			description: `deposit CVX Vault`,
		})

	const callsLookup = useMemo(() => {
		return {
			handleDepositETH,
			isSubmittingETH,
			handleDepositBTC,
			isSubmittingBTC,
			handleDepositUSD,
			isSubmittingUSD,
			handleDepositLINK,
			isSubmittingLINK,
			handleDepositFRAX,
			isSubmittingFRAX,
			handleDepositTRICRYPTO,
			isSubmittingTRICRYPTO,
			handleDepositCVX,
			isSubmittingCVX,
		}
	}, [
		handleDepositETH,
		isSubmittingETH,
		handleDepositBTC,
		isSubmittingBTC,
		handleDepositUSD,
		isSubmittingUSD,
		handleDepositLINK,
		isSubmittingLINK,
		handleDepositFRAX,
		isSubmittingFRAX,
		handleDepositTRICRYPTO,
		isSubmittingTRICRYPTO,
		handleDepositCVX,
		isSubmittingCVX,
	])

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
		const transactions = LPVaultsNoYAXIS.reduce<[string, string][]>(
			(previous, [lpToken, vault]) => {
				const _v = currencyValues[lpToken]
				if (_v)
					previous.push([
						vault.toUpperCase(),
						numberToDecimal(
							_v,
							Currencies[lpToken.toUpperCase()].decimals,
						),
					])

				return previous
			},
			[],
		)

		if (transactions.length > 0) {
			await Promise.allSettled(
				transactions.map(([token, amount]) =>
					callsLookup[`handleDeposit${token}`]({
						args: [amount],
						descriptionExtra: totalDepositing,
					}),
				),
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
	}, [currencies, currencyValues, callsLookup, totalDepositing])

	const data = useMemo(
		() =>
			currencies.map<TableDataEntry>((c) => {
				const [lpToken, vault] = LPVaultsNoYAXIS.find(
					([lpToken]) => lpToken === c.tokenId,
				)
				const currency = Currencies[lpToken.toUpperCase()]
				const balance = balances[lpToken]?.amount || new BigNumber(0)
				return {
					...currency,
					vault,
					balance,
					balanceUSD: new BigNumber(prices[lpToken])
						.times(balance)
						.toFixed(2),
					value: currencyValues
						? new BigNumber(currencyValues[lpToken] || 0)
						: new BigNumber(0),
					inputValue: currencyValues[lpToken],
					key: vault,
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
					loading={
						callsLookup.isSubmittingETH ||
						callsLookup.isSubmittingBTC ||
						callsLookup.isSubmittingLINK ||
						callsLookup.isSubmittingUSD
					}
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

export default DepositTable

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

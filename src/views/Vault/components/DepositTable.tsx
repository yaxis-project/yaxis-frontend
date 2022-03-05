import { useState, useMemo, useCallback } from 'react'
import { Currencies, Currency } from '../../../constants/currencies'
import {
	useAllTokenBalances,
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
import Button from '../../../components/Button'
import Table from '../../../components/Table'
import Divider from '../../../components/Divider'
import Typography from '../../../components/Typography'
import {
	CurrencyValues,
	handleFormInputChange,
	computeInsufficientBalance,
} from '../utils'
import { NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import Value from '../../../components/Value'
import Input from '../../../components/Input'
import ApprovalCover from '../../../components/ApprovalCover'
import { TYaxisManagerData } from '../../../state/internal/hooks'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Contracts, VaultC } from '../../../constants/contracts'
import { TVaults } from '../../../constants/type'
import { useChainInfo } from '../../../state/user'

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
						buttonText={'Approve Vault'}
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
			sorter: (a, b) => a.apr?.totalAPR.minus(b.apr?.totalAPR).toNumber(),
			render: (text, record) => (
				<>
					<Row style={{ fontWeight: 'bolder' }}>
						<Text type="secondary">
							{record?.apr?.totalAPR.isNaN()
								? 0
								: record?.apr?.totalAPR
										.multipliedBy(100)
										.toFormat(2)}
							%
							<Tooltip
								style={{ minWidth: '350px' }}
								placement="topLeft"
								title={
									<div style={{ padding: '5px' }}>
										{record?.apr?.strategy &&
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
											value={record?.apr?.yaxisAPR
												.multipliedBy(100)
												.toNumber()}
											boost={record?.apr?.boost}
										/>
										<Divider
											style={{
												borderColor: 'white',
												margin: '10px 0',
											}}
										/>
										{record?.apr?.boost.lt(2.5) && (
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
													{record?.apr?.maxYaxisAPR
														.minus(
															record?.apr
																?.yaxisAPR,
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

interface DepositTableProps {
	fees: TYaxisManagerData
	vaults: [TVaults, VaultC][]
}

/**
 * Creates a deposit table for the Vault account.
 */
const DepositTable: React.FC<DepositTableProps> = ({ fees, vaults }) => {
	const translate = useTranslation()

	const [balances, loading] = useAllTokenBalances()
	const { blockchain } = useChainInfo()

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

	const { call: handleDepositAV3CRV, loading: isSubmittingAV3CRV } =
		useContractWrite({
			contractName: 'vaults.av3crv.vault',
			method: 'deposit',
			description: `deposit AV3CRV Vault`,
		})

	const { call: handleDepositATRICRYPTO, loading: isSubmittingATRICRYPTO } =
		useContractWrite({
			contractName: 'vaults.atricrypto.vault',
			method: 'deposit',
			description: `deposit ATRICRYPTO Vault`,
		})

	const { call: handleDepositAVAX, loading: isSubmittingAVAX } =
		useContractWrite({
			contractName: 'vaults.avax.vault',
			method: 'deposit',
			description: `deposit AVAX Vault`,
		})

	const { call: handleDepositJOEWAVAX, loading: isSubmittingJOEWAVAX } =
		useContractWrite({
			contractName: 'vaults.joewavax.vault',
			method: 'deposit',
			description: `deposit JOEWAVAX Vault`,
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
			handleDepositAV3CRV,
			isSubmittingATRICRYPTO,
			handleDepositATRICRYPTO,
			isSubmittingAV3CRV,
			handleDepositAVAX,
			isSubmittingAVAX,
			handleDepositJOEWAVAX,
			isSubmittingJOEWAVAX,
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
		handleDepositAV3CRV,
		isSubmittingATRICRYPTO,
		handleDepositATRICRYPTO,
		isSubmittingAV3CRV,
		handleDepositAVAX,
		isSubmittingAVAX,
		handleDepositJOEWAVAX,
		isSubmittingJOEWAVAX,
	])

	const { prices } = usePrices()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>({})

	const disabled = useMemo(() => {
		return computeInsufficientBalance(
			currencyValues,
			Object.fromEntries(
				vaults.map(([vault, { token }]) => [
					token.tokenId,
					balances[token.tokenId],
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
								token: { tokenId },
							},
						],
					) => {
						const inputValue = currencyValues[tokenId]
						const inputNumber = Number(inputValue)
						const current = new BigNumber(
							isNaN(inputNumber) ? 0 : inputNumber,
						).times(prices[tokenId])
						return total.plus(current)
					},
					new BigNumber(0),
				)
				.toFormat(2),
		[vaults, currencyValues, balances, prices],
	)

	const handleSubmit = useCallback(async () => {
		const transactions = vaults.reduce<[string, string][]>(
			(previous, [vault, contracts]) => {
				const lpToken = contracts.token
				const _v = currencyValues[lpToken.tokenId]
				if (_v)
					previous.push([
						vault.toUpperCase(),
						numberToDecimal(
							_v,
							Currencies[lpToken.tokenId.toUpperCase()].decimals,
						),
					])

				return previous
			},
			[],
		)
		if (transactions.length > 0) {
			await Promise.allSettled(
				transactions.map(([token, amount]) => {
					return callsLookup[`handleDeposit${token}`]({
						args: [amount],
						descriptionExtra: totalDepositing,
					})
				}),
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

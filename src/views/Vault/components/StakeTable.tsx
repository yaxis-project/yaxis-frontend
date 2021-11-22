import { useState, useMemo, useCallback } from 'react'
import { Vaults, LPVaults } from '../../../constants/type'
import { Currencies, Currency } from '../../../constants/currencies'
import {
	useAllTokenBalances,
	useVaultsAPRWithBoost,
} from '../../../state/wallet/hooks'
import { usePrices } from '../../../state/prices/hooks'
import useTranslation from '../../../hooks/useTranslation'
import { Row, Grid, Form, Tooltip } from 'antd'
import styled from 'styled-components'
import { numberToDecimal } from '../../../utils/number'
import useContractWrite from '../../../hooks/useContractWrite'
import { useContracts } from '../../../contexts/Contracts'
import Button from '../../../components/Button'
import Table from '../../../components/Table'
import Typography from '../../../components/Typography'
import {
	CurrencyValues,
	handleFormInputChange,
	computeInsufficientBalance,
	computeTotalDepositing,
} from '../utils'
import BigNumber from 'bignumber.js'
import Value from '../../../components/Value'
import Input from '../../../components/Input'
import ApprovalCover from '../../../components/ApprovalCover'
import { TYaxisManagerData } from '../../../state/internal/hooks'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

type SortOrder = 'descend' | 'ascend' | null

const makeColumns = (
	loading: boolean,
	translate: any,
	onChange: ReturnType<typeof handleFormInputChange>,
) => {
	return [
		{
			title: translate('Vault'),
			key: 'asset',
			width: '150px',
			sorter: (a, b) => a.vault.length - b.vault.length,
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
						{record.balance.toFixed(2)} {record.name}
					</Text>
				</>
			),
		},
		{
			title: translate('Amount'),
			key: 'amount',
			render: (text, record) => {
				return (
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
				)
			},
		},
		{
			title: translate('Current APR'),
			key: 'apy',
			sorter: (a, b) => a.name.length - b.name.length,
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
									<>
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
										/>
									</>
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

interface StakeTableProps {
	fees: TYaxisManagerData
	currencies: Currency[]
}

/**
 * Creates a stake table for the Vault account.
 */
const StakeTable: React.FC<StakeTableProps> = ({ fees, currencies }) => {
	const translate = useTranslation()

	const [balances, loading] = useAllTokenBalances()

	const { contracts } = useContracts()
	const { md } = useBreakpoint()

	const apr = useVaultsAPRWithBoost()

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

	const disabled = useMemo(() => {
		return computeInsufficientBalance(currencyValues, balances)
	}, [currencyValues, balances])

	const totalDepositing = useMemo(
		() => computeTotalDepositing(currencies, currencyValues, prices),
		[currencies, currencyValues, prices],
	)

	const handleSubmit = useCallback(async () => {
		const transactions = Vaults.reduce<[string, string][]>(
			(previous, vault) => {
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
				transactions.map(([token, amount]) => {
					callsLookup[`handleStake${token}`]({
						args: [amount],
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
	}, [currencies, currencyValues, callsLookup, totalDepositing])

	const data = useMemo(
		() =>
			currencies.map<TableDataEntry>((c) => {
				const [lpToken, vault] = LPVaults.find(
					([lpToken]) => c.tokenId === lpToken,
				)
				const vaultToken = vault === 'yaxis' ? 'yaxis' : `cv:${vault}`
				const currency = Currencies[vaultToken.toUpperCase()]
				const balance = balances[vaultToken]?.amount || new BigNumber(0)
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
					apr: apr[vault],
				}
			}),
		[currencies, prices, balances, currencyValues, apr],
	)

	const onUpdate = useMemo(() => handleFormInputChange(setCurrencyValues), [])

	const columns = useMemo(
		() => makeColumns(loading, translate, onUpdate),
		[translate, onUpdate, loading],
	)

	const components = useMemo(() => {
		return {
			body: {
				row: ({ children, className, ...props }) => {
					const key = props['data-row-key']

					return (
						<tr
							key={key}
							className={className}
							style={{
								transform: 'translateY(0)',
							}}
						>
							<ApprovalCover
								contractName={`vaults.${key}.vaultToken.contract`}
								approvee={contracts?.vaults[key].gauge.address}
								noWrapper
								buttonText={'Gauge'}
							>
								{children}
							</ApprovalCover>
						</tr>
					)
				},
			},
		}
	}, [contracts?.vaults])

	return (
		<>
			<Table
				components={components}
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
	prefix?: string
}

const TooltipRow = ({ main, value, prefix }: TooltipRowProps) => (
	<>
		<div
			style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
		>
			{main}
		</div>
		<div>
			<Value
				value={value}
				numberSuffix={'%'}
				decimals={2}
				color={'white'}
			/>
		</div>
	</>
)

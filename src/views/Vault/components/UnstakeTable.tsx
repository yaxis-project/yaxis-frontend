import { useState, useMemo, useCallback } from 'react'
import { Currencies, Currency } from '../../../constants/currencies'
import { useVaultsBalances } from '../../../state/wallet/hooks'
import { usePrices } from '../../../state/prices/hooks'
import { Vaults } from '../../../constants/type'
import { reduce } from 'lodash'
import { Row, Grid, Form } from 'antd'
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
	computeTotalDepositing,
} from '../utils'
import BigNumber from 'bignumber.js'
import Value from '../../../components/Value'
import Input from '../../../components/Input'
import ApprovalCover from '../../../components/ApprovalCover'
import useTranslation from '../../../hooks/useTranslation'

const { Text, Title } = Typography

const StyledText = styled(Text)`
	margin-left: 16px;
	font-size: 18px;
	line-height: 1em;
`
type SortOrder = 'descend' | 'ascend' | null

const makeColumns = (
	loading: boolean,
	translate: any,
	onChange: ReturnType<typeof handleFormInputChange>,
) => {
	return [
		{
			title: translate('Asset'),
			key: 'asset',
			sorter: (a, b) => a.name.length - b.name.length,
			render: (text, record) => (
				<Row align="middle">
					<img src={record.icon} height="36" alt="logo" />
					<StyledText>{record.name}</StyledText>
				</Row>
			),
		},
		{
			title: translate('Vault Balance'),
			key: 'balance',
			defaultSortOrder: 'descend' as SortOrder,
			sorter: (a, b) =>
				new BigNumber(a.balanceUSD).minus(b.balanceUSD).toNumber(),
			render: (text, record) => (
				<>
					<Value
						value={record.balanceUSD}
						numberPrefix="$"
						decimals={2}
					/>
					<Text type="secondary">
						{record.balance.toFixed(2)} {record.vaultCurrency}
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
							onChange={(e) => {
								onChange(record.tokenId, e.target.value)
							}}
							value={record.inputValue}
							min={'0'}
							max={`${record.balance}`}
							placeholder="0"
							disabled={loading || record.balance.isZero()}
							suffix={`${record.name}-G`}
							onClickMax={() =>
								onChange(record.tokenId, record.balance || '0')
							}
						/>
					</Form.Item>
				)
			},
		},
	]
}

const { useBreakpoint } = Grid

const SUPPORTED_CURRENCIES: Currency[] = Vaults.map(
	(c) => Currencies[c.toUpperCase()],
)

const initialCurrencyValues: CurrencyValues = reduce(
	SUPPORTED_CURRENCIES,
	(prev, curr) => ({
		...prev,
		[curr.tokenId]: '',
	}),
	{},
)

interface TableDataEntry extends Currency {
	balance: BigNumber
	balanceUSD: string
	value: BigNumber
	vault: string
}

/**
 * Creates a deposit table for the savings account.
 */
export default function WithdrawTable() {
	const translate = useTranslation()

	const { loading: loadingBalances, ...balances } = useVaultsBalances()

	const { contracts } = useContracts()
	const { md } = useBreakpoint()

	const { call: handleUnstakeWETH, loading: isSubmittingWETH } =
		useContractWrite({
			contractName: 'vaults.weth.gauge',
			method: 'withdraw(uint256)',
			description: `unstaked from WETH Gauge`,
		})

	const { call: handleUnstakeWBTC, loading: isSubmittingWBTC } =
		useContractWrite({
			contractName: 'vaults.wbtc.gauge',
			method: 'withdraw(uint256)',
			description: `unstaked from WBTC Gauge`,
		})

	const { call: handleUnstake3CRV, loading: isSubmitting3CRV } =
		useContractWrite({
			contractName: 'vaults.3crv.gauge',
			method: 'withdraw(uint256)',
			description: `unstaked from 3CRV Gauge`,
		})

	const { call: handleUnstakeLINK, loading: isSubmittingLINK } =
		useContractWrite({
			contractName: 'vaults.link.gauge',
			method: 'withdraw(uint256)',
			description: `unstaked from LINK Gauge`,
		})

	const callsLookup = useMemo(() => {
		return {
			handleUnstakeWETH,
			isSubmittingWETH,
			handleUnstakeWBTC,
			isSubmittingWBTC,
			handleUnstake3CRV,
			isSubmitting3CRV,
			handleUnstakeLINK,
			isSubmittingLINK,
		}
	}, [
		handleUnstakeWETH,
		isSubmittingWETH,
		handleUnstakeWBTC,
		isSubmittingWBTC,
		handleUnstake3CRV,
		isSubmitting3CRV,
		handleUnstakeLINK,
		isSubmittingLINK,
	])

	const { prices } = usePrices()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		initialCurrencyValues,
	)

	const totalWithdrawing = useMemo(
		() =>
			computeTotalDepositing(
				SUPPORTED_CURRENCIES,
				currencyValues,
				prices,
			),
		[currencyValues, prices],
	)

	const handleSubmit = useCallback(async () => {
		const transactions = SUPPORTED_CURRENCIES.reduce<[string, string][]>(
			(previous, current) => {
				const _v = currencyValues[current.tokenId]
				if (_v)
					previous.push([
						current.tokenId.toUpperCase(),
						numberToDecimal(_v, current.decimals),
					])

				return previous
			},
			[],
		)
		if (transactions.length > 0) {
			await Promise.allSettled(
				transactions.map(([token, amount]) =>
					callsLookup[`handleUnstake${token}`]({
						args: [amount],
						descriptionExtra: totalWithdrawing,
					}),
				),
			)
			setCurrencyValues(initialCurrencyValues)
		}
	}, [currencyValues, callsLookup, totalWithdrawing])

	const data = useMemo(() => {
		return SUPPORTED_CURRENCIES.map<TableDataEntry>((currency) => {
			const token = `${currency.tokenId}`
			const balance = balances[token] || new BigNumber(0)
			return {
				...currency,
				vault: currency.tokenId,
				vaultCurrency: `${currency.name}-G`,
				balance: balance?.gaugeToken?.amount || new BigNumber(0),
				balanceUSD: balance?.usd || new BigNumber(0),
				value: currencyValues
					? new BigNumber(
							currencyValues[currency.name.toLowerCase()] || 0,
					  )
					: new BigNumber(0),
				inputValue: currencyValues[currency.name.toLowerCase()],
				key: currency.tokenId,
			}
		})
	}, [balances, currencyValues])

	const columns = useMemo(
		() =>
			makeColumns(
				loadingBalances,
				translate,
				handleFormInputChange(setCurrencyValues),
			),
		[translate, loadingBalances],
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
								contractName={`vaults.${key}.gaugeToken.contract`}
								approvee={contracts?.vaults[key].gauge.address}
								noWrapper
								buttonText={'Vault'}
							>
								<ApprovalCover
									contractName={`vaults.${key}.gaugeToken.contract`}
									approvee={
										contracts?.internal.vaultHelper.address
									}
									noWrapper
									buttonText={'Automatic Staking'}
								>
									{children}
								</ApprovalCover>
							</ApprovalCover>
						</tr>
					)
				},
			},
		}
	}, [contracts?.internal.vaultHelper.address, contracts?.vaults])

	return (
		<>
			<Table
				columns={columns}
				dataSource={data}
				pagination={false}
				onRow={(record, rowIndex) => {
					return {
						// onClick: (event) => {
						// 	history.push(
						// 		`/vault/${(record as TableDataEntry).vault}`,
						// 	)
						// },
						// click row
						onDoubleClick: (event) => {}, // double click row
						onContextMenu: (event) => {}, // right button click row
						onMouseEnter: (event) => {}, // mouse enter row
						onMouseLeave: (event) => {}, // mouse leave row
					}
				}}
				components={components}
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
					${totalWithdrawing}
				</Title>
				<Button
					// disabled={disabled}
					loading={
						callsLookup.isSubmittingWETH ||
						callsLookup.isSubmittingWBTC ||
						callsLookup.isSubmittingLINK ||
						callsLookup.isSubmitting3CRV
					}
					onClick={handleSubmit}
					style={{ fontSize: '18px' }}
				>
					{translate('Withdraw')}
				</Button>
				<Text
					type="secondary"
					style={{ marginTop: '10px', display: 'block' }}
				>
					{translate('Withdraw Fee')}: 0.1%
				</Text>
			</div>
		</>
	)
}

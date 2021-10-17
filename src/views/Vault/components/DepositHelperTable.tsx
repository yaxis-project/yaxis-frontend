import { useState, useMemo, useCallback } from 'react'
import { Vaults } from '../../../constants/type'
import { Currencies, Currency } from '../../../constants/currencies'
import { useAllTokenBalances } from '../../../state/wallet/hooks'
import { usePrices } from '../../../state/prices/hooks'
import useTranslation from '../../../hooks/useTranslation'
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
	computeInsufficientBalance,
	computeTotalDepositing,
} from '../utils'
import BigNumber from 'bignumber.js'
import Value from '../../../components/Value'
import Input from '../../../components/Input'
import ApprovalCover from '../../../components/ApprovalCover'

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
			title: translate('APY'),
			key: 'apy',
			sorter: (a, b) => a.name.length - b.name.length,
			render: (text, record) => (
				<>
					<Row style={{ fontWeight: 'bolder' }} justify="center">
						<Text type="secondary">{record.minApy}%</Text>
					</Row>
					<Row justify="center">
						<Text type="secondary">to</Text>
					</Row>
					<Row style={{ fontWeight: 'bolder' }} justify="center">
						<Text type="secondary">{record.maxApy}%</Text>
					</Row>
				</>
			),
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
 * Creates a deposit and stake table for the Vault account.
 */
export default function DepositHelperTable() {
	const translate = useTranslation()

	const [balances, loading] = useAllTokenBalances()

	const { contracts } = useContracts()
	const { md } = useBreakpoint()

	const { call: handleDeposit, loading: isSubmitting } = useContractWrite({
		contractName: 'internal.vaultHelper',
		method: 'depositVault',
		description: `Vault deposit`,
	})

	const { prices } = usePrices()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		initialCurrencyValues,
	)

	const disabled = useMemo(
		() => computeInsufficientBalance(currencyValues, balances),
		[currencyValues, balances],
	)

	const totalDepositing = useMemo(
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
						contracts.vaults[current.tokenId].vault.address,
						numberToDecimal(_v, current.decimals),
					])

				return previous
			},
			[],
		)
		if (transactions.length > 0) {
			await Promise.allSettled(
				transactions.map((args) =>
					handleDeposit({ args, descriptionExtra: totalDepositing }),
				),
			)
			setCurrencyValues(initialCurrencyValues)
		}
	}, [currencyValues, handleDeposit, totalDepositing, contracts])

	const data = useMemo(
		() =>
			SUPPORTED_CURRENCIES.map<TableDataEntry>((currency) => {
				const balance =
					balances[currency.tokenId]?.amount || new BigNumber(0)
				return {
					...currency,
					vault: currency.tokenId,
					balance,
					balanceUSD: new BigNumber(prices[currency.priceMapKey])
						.times(balance)
						.toFixed(2),
					value: currencyValues
						? new BigNumber(
								currencyValues[currency.name.toLowerCase()] ||
									0,
						  )
						: new BigNumber(0),
					inputValue: currencyValues[currency.name.toLowerCase()],
					key: currency.tokenId,
					//  TODO
					minApy: 0,
					maxApy: 0,
				}
			}),
		[prices, balances, currencyValues],
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
								contractName={`currencies.ERC20.${key}.contract`}
								approvee={contracts?.vaults[key].vault.address}
								noWrapper
								buttonText={'Vault'}
							>
								<ApprovalCover
									contractName={`currencies.ERC20.${key}.contract`}
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
				components={components}
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
					loading={isSubmitting}
					onClick={handleSubmit}
					style={{ fontSize: '18px' }}
				>
					{translate('Deposit')}
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

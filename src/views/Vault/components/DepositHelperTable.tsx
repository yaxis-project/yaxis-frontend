import { useState, useMemo, useCallback } from 'react'
import { Currencies3Pool, Currency } from '../../../constants/currencies'
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
import { useHistory } from 'react-router-dom'
import { AutoStakeCover } from '../../../components/ApprovalCover/AutoStakeCover'

const { Text, Title } = Typography

const StyledText = styled(Text)`
	margin-left: 16px;
	font-size: 18px;
	line-height: 1em;
`

const makeColumns = (
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
			sorter: (a, b) => a.balance.minus(b.balance).toNumber(),
			render: (text, record) => (
				<>
					<Value
						value={record.balanceUSD}
						numberPrefix="$"
						decimals={2}
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
							onChange={(e) => {
								onChange(record.tokenId, e.target.value)
							}}
							value={record.value}
							min={'0'}
							placeholder="0"
							disabled={record.balance.isZero()}
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

const initialCurrencyValues: CurrencyValues = reduce(
	Currencies3Pool,
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
export default function DepositTable() {
	const translate = useTranslation()

	const history = useHistory()

	const [balances] = useAllTokenBalances()

	const { contracts } = useContracts()
	const { md } = useBreakpoint()

	const { call: handleDepositAll, loading: isSubmitting } = useContractWrite({
		contractName: 'internal.vaultHelper',
		method: 'depositMultipleVault',
		description: `Vault deposit`,
	})

	const currencyMap = useMemo(() => {
		return {
			...contracts?.currencies.ERC20,
			...contracts?.currencies.ERC677,
		}
	}, [contracts])

	const { prices } = usePrices()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		initialCurrencyValues,
	)

	const disabled = useMemo(
		() => computeInsufficientBalance(currencyValues, balances),
		[currencyValues, balances],
	)

	const totalDepositing = useMemo(
		() => computeTotalDepositing(Currencies3Pool, currencyValues, prices),
		[currencyValues, prices],
	)

	const handleSubmit = useCallback(async () => {
		const args = Currencies3Pool.reduce<[string, string[], string[]]>(
			(previous, current) => {
				const _v = currencyValues[current.tokenId]
				if (_v) {
					previous[1].push(
						currencyMap[current.tokenId].contract.address,
					)
					previous[2].push(numberToDecimal(_v, current.decimals))
				}
				return previous
			},
			[contracts.vaults.stables.vault.address, [], []],
		)
		if (args[1].length > 0) {
			await handleDepositAll({ args, descriptionExtra: totalDepositing })
			setCurrencyValues(initialCurrencyValues)
		}
	}, [
		contracts,
		currencyValues,
		handleDepositAll,
		totalDepositing,
		currencyMap,
	])

	const data = useMemo(() => {
		return Currencies3Pool.map<TableDataEntry>((currency) => {
			const balance =
				balances[currency.name.toLowerCase()]?.amount ||
				new BigNumber(0)
			return {
				...currency,
				vault: 'stables',
				balance,
				balanceUSD: new BigNumber(prices[currency.priceMapKey])
					.times(balance)
					.toFixed(2),
				value: currencyValues
					? new BigNumber(
							currencyValues[currency.name.toLowerCase()] || 0,
					  )
					: new BigNumber(0),
				key: currency.tokenId,
				//  TODO
				minApy: 0,
				maxApy: 0,
			}
		})
	}, [prices, balances, currencyValues])

	const columns = useMemo(
		() => makeColumns(translate, handleFormInputChange(setCurrencyValues)),
		[translate],
	)

	return (
		<>
			<Table
				components={{
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
									<AutoStakeCover
										contractName={`currencies.ERC20.${key}.contract`}
										approvee={
											contracts?.vaults.stables.vault
												.address
										}
										hidden={false}
										noWrapper
										buttonText={translate('Vault')}
									>
										<AutoStakeCover
											contractName={`currencies.ERC20.${key}.contract`}
											approvee={
												contracts?.internal.vaultHelper
													.address
											}
											hidden={false}
											noWrapper
											buttonText={translate(
												'Automatic Staking',
											)}
										>
											{children}
										</AutoStakeCover>
									</AutoStakeCover>
								</tr>
							)
						},
					},
				}}
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

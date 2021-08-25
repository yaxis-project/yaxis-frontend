import { useState, useContext, useMemo, useCallback } from 'react'
import { Currencies3Pool, Currency } from '../../../constants/currencies'
import { useVaultsBalances } from '../../../state/wallet/hooks'
import { usePrices } from '../../../state/prices/hooks'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { keyBy, reduce } from 'lodash'
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
import { MAX_UINT } from '../../../utils/number'
import BigNumber from 'bignumber.js'
import Value from '../../../components/Value'
import Input from '../../../components/Input'
import { useHistory } from 'react-router-dom'
import ApprovalCover from '../../../components/ApprovalCover'

const { Text, Title } = Typography

const StyledText = styled(Text)`
	margin-left: 16px;
	font-size: 18px;
	line-height: 1em;
`

const makeColumns = (
	onChange: ReturnType<typeof handleFormInputChange>,
	onMaxWithdraw: () => void,
) => {
	return [
		{
			title: 'Asset',
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
			title: 'Vault Balance',
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
						{record.balance.toFixed(2)} {record.vaultCurrency}
					</Text>
				</>
			),
		},
		{
			title: 'Amount',
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
	const history = useHistory()

	const balances = useVaultsBalances()

	const { contracts } = useContracts()
	const { md } = useBreakpoint()

	const { call: withdraw, loading: isSubmitting } = useContractWrite({
		contractName: 'vaults.stables.vault',
		method: 'withdraw',
		description: `Vault withdraw`,
	})

	// const contract = useMemo(
	// 	() => contracts?.internal.yAxisMetaVault,
	// 	[contracts],
	// )

	const currencyMap = useMemo(() => {
		return {
			...contracts?.currencies.ERC20,
			...contracts?.currencies.ERC677,
		}
	}, [contracts])

	// const calcMinTokenAmount = useCallback(
	// 	async (amounts: string[]) => {
	// 		const threeCrvIndex = 3 // Index from InvestingDepositCurrencies that DepositAll expects
	// 		const defaultSlippage = 0.001 // 0.1%

	// 		try {
	// 			if (contract) {
	// 				const params = [...amounts]
	// 				params.splice(threeCrvIndex, 1)
	// 				const tokensDeposit = await contract.methods
	// 					.calc_token_amount_deposit(params)
	// 					.call()
	// 				const threeCrvDeposit = amounts[threeCrvIndex] || '0'
	// 				return new BigNumber(tokensDeposit)
	// 					.plus(threeCrvDeposit)
	// 					.times(1 - defaultSlippage)
	// 					.integerValue(BigNumber.ROUND_DOWN)
	// 					.toFixed()
	// 			}
	// 		} catch (e) {}
	// 		return '0'
	// 	},
	// 	[contract],
	// )

	const { prices } = usePrices()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		initialCurrencyValues,
	)

	// const {
	// 	metavault: {
	// 		deposit: allowance3crv,
	// 		loadingDeposit: loading3crvAllowance,
	// 	},
	// } = useApprovals()

	// TODO: this
	// const disabled = useMemo(
	// 	() => computeInsufficientBalance(currencyValues, balances),
	// 	[currencyValues, balances],
	// )

	const totalDepositing = useMemo(
		() => computeTotalDepositing(Currencies3Pool, currencyValues, prices),
		[currencyValues, prices],
	)

	const handleSubmit = useCallback(async () => {
		// const args = Currencies3Pool.reduce(
		// 	(previous, current) => {
		// 		const _v = currencyValues[current.tokenId]
		// 		if (_v) {
		// 			previous[0].push(
		// 				currencyMap[current.tokenId].contract.address,
		// 			)
		// 			previous[1].push()
		// 		}
		// 		return previous
		// 	},
		// 	[[], []],
		// )
		for (const [currency, value] of Object.entries(currencyValues)) {
			if (value) {
				console.log(numberToDecimal(value, 18))
				await withdraw({
					args: [
						numberToDecimal(value, 18),
						currencyMap[currency].contract.address,
					],
					descriptionExtra: totalDepositing,
				})
			}
		}
		setCurrencyValues(initialCurrencyValues)
	}, [currencyValues, withdraw, totalDepositing, currencyMap])

	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const data = useMemo(() => {
		return Currencies3Pool.map<TableDataEntry>((currency) => {
			const balance = balances['stables']
			return {
				...currency,
				vault: 'stables',
				vaultCurrency: 'CV:S',
				balance: new BigNumber(
					balance.vaultToken?.amount.toString() || '0',
				),
				balanceUSD: balance.usd.toFixed(2),
				value: currencyValues
					? new BigNumber(
							currencyValues[currency.name.toLowerCase()] || 0,
					  )
					: new BigNumber(0),
				key: currency.tokenId,
			}
		})
	}, [balances, currencyValues])

	const columns = useMemo(
		() => makeColumns(handleFormInputChange(setCurrencyValues), () => {}),
		[],
	)

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
			/>
			<div
				style={
					md
						? { padding: '2% 30%' }
						: { padding: '0 10%', margin: '10px' }
				}
			>
				<Text type="secondary">{phrases['Total'][language]}</Text>
				<Title level={3} style={{ margin: '0 0 10px 0' }}>
					${totalDepositing}
				</Title>
				<Button
					// disabled={disabled}
					loading={isSubmitting}
					onClick={handleSubmit}
					style={{ fontSize: '18px' }}
				>
					{phrases['Withdraw'][language]}
				</Button>
				<Text
					type="secondary"
					style={{ marginTop: '10px', display: 'block' }}
				>
					{phrases['Withdraw Fee'][language]}: 0.1%
				</Text>
			</div>
		</>
	)
}

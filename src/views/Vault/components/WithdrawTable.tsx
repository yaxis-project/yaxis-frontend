import { useState, useMemo, useCallback } from 'react'
import { Currencies, Currency } from '../../../constants/currencies'
import { useAllTokenBalances } from '../../../state/wallet/hooks'
import { usePrices } from '../../../state/prices/hooks'
import { Vaults, LPVaults } from '../../../constants/type'
import { Row, Grid, Form } from 'antd'
import styled from 'styled-components'
import { numberToDecimal } from '../../../utils/number'
import useContractWrite from '../../../hooks/useContractWrite'
import Button from '../../../components/Button'
import Table from '../../../components/Table'
import Typography from '../../../components/Typography'
import {
	CurrencyValues,
	handleFormInputChange,
	computeTotalDepositing,
	computeInsufficientBalance,
} from '../utils'
import BigNumber from 'bignumber.js'
import Value from '../../../components/Value'
import Input from '../../../components/Input'
import useTranslation from '../../../hooks/useTranslation'
import { TYaxisManagerData } from '../../../state/internal/hooks'

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
						{record.balance.toFormat(2)} {record.name}
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
							suffix={`${record.name}`}
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

const VaultsNoYAXIS = Vaults.filter((vault) => vault !== 'yaxis')

interface TableDataEntry extends Currency {
	balance: BigNumber
	balanceUSD: string
	value: BigNumber
	vault: string
}

interface WithdrawTableProps {
	fees: TYaxisManagerData
	currencies: Currency[]
}

/**
 * Creates a deposit table for the savings account.
 */
const WithdrawTable: React.FC<WithdrawTableProps> = ({ fees, currencies }) => {
	const translate = useTranslation()

	const [balances, loading] = useAllTokenBalances()

	const { md } = useBreakpoint()

	const { call: handleWithdrawETH, loading: isSubmittingETH } =
		useContractWrite({
			contractName: 'vaults.eth.vault',
			method: 'withdraw',
			description: `withdrew from ETH Vault`,
		})

	const { call: handleWithdrawBTC, loading: isSubmittingBTC } =
		useContractWrite({
			contractName: 'vaults.btc.vault',
			method: 'withdraw',
			description: `withdrew from BTC Vault`,
		})

	const { call: handleWithdrawUSD, loading: isSubmittingUSD } =
		useContractWrite({
			contractName: 'vaults.usd.vault',
			method: 'withdraw',
			description: `withdrew from USD Vault`,
		})

	const { call: handleWithdrawLINK, loading: isSubmittingLINK } =
		useContractWrite({
			contractName: 'vaults.link.vault',
			method: 'withdraw',
			description: `withdrew from LINK Vault`,
		})

	const { call: handleWithdrawFRAX, loading: isSubmittingFRAX } =
		useContractWrite({
			contractName: 'vaults.frax.vault',
			method: 'withdraw',
			description: `withdrew from FRAX Vault`,
		})

	const { call: handleWithdrawTRICRYPTO, loading: isSubmittingTRICRYPTO } =
		useContractWrite({
			contractName: 'vaults.tricrypto.vault',
			method: 'withdraw',
			description: `withdrew from TRICRYPTO Vault`,
		})

	const { call: handleWithdrawCVX, loading: isSubmittinwCVX } =
		useContractWrite({
			contractName: 'vaultswCVX.vault',
			method: 'withdraw',
			description: `withdrew fromwCVX Vault`,
		})

	const callsLookup = useMemo(() => {
		return {
			handleWithdrawETH,
			isSubmittingETH,
			handleWithdrawBTC,
			isSubmittingBTC,
			handleWithdrawUSD,
			isSubmittingUSD,
			handleWithdrawLINK,
			isSubmittingLINK,
			handleWithdrawFRAX,
			isSubmittingFRAX,
			handleWithdrawTRICRYPTO,
			isSubmittingTRICRYPTO,
			handleWithdrawCVX,
			isSubmittinwCVX,
		}
	}, [
		handleWithdrawETH,
		isSubmittingETH,
		handleWithdrawBTC,
		isSubmittingBTC,
		handleWithdrawUSD,
		isSubmittingUSD,
		handleWithdrawLINK,
		isSubmittingLINK,
		handleWithdrawFRAX,
		isSubmittingFRAX,
		handleWithdrawTRICRYPTO,
		isSubmittingTRICRYPTO,
		handleWithdrawCVX,
		isSubmittinwCVX,
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

	const totalWithdrawing = useMemo(
		() => computeTotalDepositing(currencies, currencyValues, prices),
		[currencies, currencyValues, prices],
	)

	const handleSubmit = useCallback(async () => {
		const transactions = VaultsNoYAXIS.reduce<[string, string][]>(
			(previous, vault) => {
				const vaultToken = `cv:${vault}`
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
					callsLookup[`handleWithdraw${token}`]({
						args: [amount],
						descriptionExtra: totalWithdrawing,
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
	}, [currencies, currencyValues, callsLookup, totalWithdrawing])

	const data = useMemo(() => {
		return currencies.map<TableDataEntry>((c) => {
			const vault =
				c.tokenId !== 'yaxis'
					? c.tokenId.slice(3).toLowerCase()
					: c.tokenId
			const [lpToken] = LPVaults.find(([, v]) => {
				return vault === v
			})
			const vaultToken = `cv:${vault}`
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
			}
		})
	}, [currencies, prices, balances, currencyValues])

	const columns = useMemo(
		() =>
			makeColumns(
				loading,
				translate,
				handleFormInputChange(setCurrencyValues),
			),
		[translate, loading],
	)

	return (
		<>
			<Table columns={columns} dataSource={data} pagination={false} />
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
					{translate('Withdraw')}
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

export default WithdrawTable

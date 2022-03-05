import { useState, useMemo, useCallback } from 'react'
import { Currencies, Currency } from '../../../constants/currencies'
import { useVaultsBalances } from '../../../state/wallet/hooks'
import { Row, Grid, Form } from 'antd'
import { ColumnsType } from 'antd/es/table'
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
} from '../utils'
import BigNumber from 'bignumber.js'
import Value from '../../../components/Value'
import Input from '../../../components/Input'
import ApprovalCover from '../../../components/ApprovalCover'
import { DoubleApprovalCover } from '../../../components/ApprovalCover/DoubleApprovalCover'
import useTranslation from '../../../hooks/useTranslation'
import { TYaxisManagerData } from '../../../state/internal/hooks'
import { VaultC } from '../../../constants/contracts'
import { TVaults } from '../../../constants/type'

const { Text, Title } = Typography

const StyledText = styled(Text)`
	margin-left: 16px;
	font-size: 18px;
	line-height: 1em;
`
type SortOrder = 'descend' | 'ascend' | null

const makeColumns = (
	loading: boolean,
	translate: ReturnType<typeof useTranslation>,
	onChange: ReturnType<typeof handleFormInputChange>,
): ColumnsType<TableDataEntry> => {
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
			title: translate('Vault Balance'),
			key: 'balance',
			defaultSortOrder: 'descend' as SortOrder,
			sorter: (a, b) =>
				new BigNumber(a.balanceUSD).minus(b.balanceUSD).toNumber(),
			render: (text, record) => (
				<>
					<Value
						value={record.balanceUSD.toFixed(2)}
						numberPrefix="$"
						decimals={2}
					/>
					<Text type="secondary">
						{record.balance.toFormat(2)} {record.vaultCurrency}
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
							suffix={record.name}
							onClickMax={() =>
								onChange(
									record.tokenId,
									record.balance.toString() || '0',
								)
							}
						/>
					</Form.Item>
				)
			},
		},
	]
}

const { useBreakpoint } = Grid

interface TableDataEntry extends Currency {
	balance: BigNumber
	balanceUSD: BigNumber
	value: BigNumber
	vault: string
	vaultCurrency: string
	inputValue: string
	key: string
}

interface WithdrawHelperTableProps {
	fees: TYaxisManagerData
	vaults: [TVaults, VaultC][]
}

/**
 * Creates a deposit table for the savings account.
 */
const WithdrawHelperTable: React.FC<WithdrawHelperTableProps> = ({
	fees,
	vaults,
}) => {
	const translate = useTranslation()

	const { loading: loadingBalances, balances } = useVaultsBalances()

	const { contracts } = useContracts()
	const { md } = useBreakpoint()

	const { call: handleWithdraw, loading: isSubmitting } = useContractWrite({
		contractName: 'internal.vaultHelper',
		method: 'withdrawVault',
		description: `Vault withdraw`,
	})

	const { call: handleUnstakeYAXIS, loading: isSubmittingYAXIS } =
		useContractWrite({
			contractName: 'vaults.yaxis.gauge',
			method: 'withdraw(uint256)',
			description: `unstaked from YAXIS Gauge`,
		})

	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>({})

	const totalWithdrawing = useMemo(
		() =>
			vaults
				.reduce(
					(
						total,
						[
							vault,
							{
								gaugeToken: { tokenId },
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

	const disabled = useMemo(
		() =>
			computeInsufficientBalance(
				currencyValues,
				Object.fromEntries(
					vaults.map(([vault, { gaugeToken }]) => [
						gaugeToken.tokenId,
						balances[vault.toLowerCase()].gaugeToken,
					]),
				),
			),
		[vaults, currencyValues, balances],
	)

	const handleSubmit = useCallback(async () => {
		const transactions = vaults.reduce<[string, [string, string]][]>(
			(previous, [vault, contracts]) => {
				const lpToken = contracts.gaugeToken
				const _v = currencyValues[lpToken.tokenId]
				if (_v)
					previous.push([
						vault,
						[
							contracts.vault.address,
							numberToDecimal(
								_v,
								Currencies[lpToken.tokenId.toUpperCase()]
									.decimals,
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
						return handleUnstakeYAXIS({ args: [args[1]] })

					// Withdraw others using Vault Helper
					return handleWithdraw({
						args,
						descriptionExtra: totalWithdrawing,
					})
				}),
			)
			setCurrencyValues(
				vaults.reduce(
					(prev, [, contracts]) => ({
						...prev,
						[contracts.gaugeToken.tokenId]: '',
					}),
					{},
				),
			)
		}
	}, [
		vaults,
		contracts,
		currencyValues,
		handleWithdraw,
		totalWithdrawing,
		handleUnstakeYAXIS,
	])

	const data = useMemo(
		() =>
			vaults.map<TableDataEntry>(([vault, contracts]) => {
				const gaugeToken = contracts.gaugeToken
				const balance = balances[vault]
				return {
					...gaugeToken,
					vault,
					vaultCurrency: contracts.token.name,
					balance: balance?.gaugeToken.amount || new BigNumber(0),
					balanceUSD: balance?.usd,
					value: currencyValues
						? new BigNumber(currencyValues[gaugeToken.tokenId] || 0)
						: new BigNumber(0),
					inputValue: currencyValues[gaugeToken.tokenId],
					key: vault,
				}
			}),
		[vaults, balances, currencyValues],
	)

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
					if (key === 'yaxis')
						return (
							<tr
								key={key}
								className={className}
								style={{
									transform: 'translateY(0)',
								}}
							>
								<ApprovalCover
									contractName={`currencies.ERC677.${key}.contract`}
									approvee={
										contracts?.vaults[key].gauge.address
									}
									noWrapper
									buttonText={'Approve Withdraw'}
								>
									{children}
								</ApprovalCover>
							</tr>
						)
					return (
						<tr
							key={key}
							className={className}
							style={{
								transform: 'translateY(0)',
							}}
						>
							<DoubleApprovalCover
								noWrapper
								contractName1={`vaults.${key}.gaugeToken.contract`}
								approvee1={contracts?.vaults[key].gauge.address}
								buttonText1={'Approve Withdraw'}
								contractName2={`vaults.${key}.gaugeToken.contract`}
								approvee2={
									contracts?.internal.vaultHelper.address
								}
								buttonText2={'Approve Automatic Unstaking'}
							>
								{children}
							</DoubleApprovalCover>
						</tr>
					)
				},
			},
		}
	}, [contracts?.internal.vaultHelper.address, contracts?.vaults])

	return (
		<>
			<Table<TableDataEntry>
				columns={columns}
				dataSource={data}
				pagination={false}
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
					disabled={disabled}
					loading={isSubmitting || isSubmittingYAXIS}
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

export default WithdrawHelperTable

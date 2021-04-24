import { useState, useContext, useMemo, useCallback } from 'react'
import { InvestingDepositCurrencies } from '../../../utils/currencies'
import DepositAssetRow from './DepositAssetRow'
import Stable3PoolDeposit from './Stable3PoolDeposit'
import useMetaVault from '../../../hooks/useMetaVault'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import usePriceMap from '../../../hooks/usePriceMap'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { reduce } from 'lodash'
import { Row, Col, Grid, Typography, notification } from 'antd'
import styled from 'styled-components'
import { numberToDecimal } from '../../../yaxis/utils'
import useTransactionAdder from '../../../hooks/useTransactionAdder'
import { Transaction } from '../../../contexts/Transactions/types'
import useContractReadAccount from '../../../hooks/useContractReadAccount'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import useGlobal from '../../../hooks/useGlobal'
import Button from '../../../components/Button'
import {
	CurrencyValues,
	handleFormInputChange,
	computeInsufficientBalance,
	computeTotalDepositing,
} from '../utils'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const initialCurrencyValues: CurrencyValues = reduce(
	InvestingDepositCurrencies,
	(prev, curr) => ({
		...prev,
		[curr.tokenId]: '',
	}),
	{},
)

/**
 * Creates a deposit table for the savings account.
 */
export default function DepositTable() {
	const { account } = useWeb3Provider()
	const { yaxis } = useGlobal()
	const { md } = useBreakpoint()

	const { onDepositAll, isSubmitting } = useMetaVault()
	const { onAddTransaction } = useTransactionAdder()

	const priceMap = usePriceMap()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		initialCurrencyValues,
	)

	const { currenciesData } = useMetaVaultData('v1')

	const {
		loading: loading3crvAllowance,
		data: allowance3crv,
	} = useContractReadAccount({
		contractName: 'vault.threeCrv',
		method: 'allowance',
		args: [account, yaxis?.contracts?.yaxisMetaVault.options.address],
	})

	const disabled = useMemo(
		() =>
			loading3crvAllowance ||
			allowance3crv < 2 ** 256 - 1 ||
			computeInsufficientBalance(currencyValues, currenciesData),
		[currencyValues, currenciesData, allowance3crv, loading3crvAllowance],
	)

	const totalDepositing = useMemo(
		() =>
			computeTotalDepositing(
				InvestingDepositCurrencies,
				currencyValues,
				priceMap,
			),
		[currencyValues, priceMap],
	)

	const handleSubmit = useCallback(async () => {
		try {
			const amounts = InvestingDepositCurrencies.map((c) => {
				const _v = currencyValues[c.tokenId]
				if (_v) {
					return numberToDecimal(_v, c.decimals)
				}
				return '0'
			})
			const receipt = await onDepositAll(amounts, false)
			setCurrencyValues(initialCurrencyValues)
			onAddTransaction({
				hash: receipt.transactionHash,
				description: 'Deposit|$' + totalDepositing,
			} as Transaction)
		} catch (e) {
			notification.info({
				message: `Error while depositing:`,
				description: e.message,
			})
		}
	}, [currencyValues, onAddTransaction, onDepositAll, totalDepositing])

	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	return (
		<div className="deposit-table">
			<HeaderRow className="deposit-asset-header-row">
				<Col xs={6} sm={6} md={5}>
					<Text type="secondary">{phrases['Asset'][language]}</Text>
				</Col>
				<Col xs={8} sm={8} md={7}>
					<Text type="secondary">
						{phrases['Wallet Balance'][language]}
					</Text>
				</Col>
				<StyledCol xs={10} sm={10} md={12}>
					<Text type="secondary">{phrases['Amount'][language]}</Text>
				</StyledCol>
			</HeaderRow>
			<Stable3PoolDeposit
				set3crvValue={handleFormInputChange(setCurrencyValues)}
				value3crv={currencyValues}
			/>
			{[InvestingDepositCurrencies[3]].map((currency) => (
				<DepositAssetRow
					key={currency.name}
					currency={currency}
					onChange={handleFormInputChange(setCurrencyValues)}
					value={currencyValues[currency.tokenId]}
					containerStyle={{ borderTop: '1px solid #eceff1' }}
					contractName={`vault.threeCrv`}
					approvee={yaxis?.contracts?.yaxisMetaVault.options.address}
				/>
			))}
			<Row className="total" style={md ? {} : { padding: '0 10%' }}>
				<Col offset={md ? 12 : 0} xs={24} sm={24} md={11}>
					<Text type="secondary">{phrases['Total'][language]}</Text>
					<Title level={3}>${totalDepositing}</Title>
					<Button
						className="investing-btn"
						disabled={disabled}
						loading={isSubmitting}
						onClick={handleSubmit}
						style={{ fontSize: '18px' }}
					>
						{phrases['Deposit'][language]}
					</Button>
					<Text
						type="secondary"
						style={{ marginTop: '10px', display: 'block' }}
					>
						{phrases['Withdraw Fee'][language]}: 0.1%
					</Text>
				</Col>
			</Row>
		</div>
	)
}

const HeaderRow = styled(Row)`
	margin-top: 10px;
`

const StyledCol = styled(Col)`
	@media only screen and (max-width: 400px) {
		padding-left: 16px;
	}
`

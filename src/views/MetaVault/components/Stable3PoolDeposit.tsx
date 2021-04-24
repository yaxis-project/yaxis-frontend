import { useState, useContext, useMemo, useCallback } from 'react'
import { Currencies3Pool } from '../../../utils/currencies'
import DepositAssetRow from './DepositAssetRow'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import usePriceMap from '../../../hooks/usePriceMap'
import useGlobal from '../../../hooks/useGlobal'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { reduce } from 'lodash'
import { Row, Col, Grid, Typography } from 'antd'
import { numberToDecimal } from '../../../yaxis/utils'
import useContractWrite from '../../../hooks/useContractWrite'
import Button from '../../../components/Button'
import { ArrowDownOutlined } from '@ant-design/icons'
import {
	CurrencyValues,
	handleFormInputChange,
	computeInsufficientBalance,
	computeTotalDepositing,
} from '../utils'
import BigNumber from 'bignumber.js'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const initialCurrencyValues: CurrencyValues = reduce(
	Currencies3Pool,
	(prev, curr) => ({
		...prev,
		[curr.tokenId]: '',
	}),
	{},
)

/**
 * Creates a deposit table for the savings account.
 */
export default function Stable3PoolDeposit({ set3crvValue, value3crv }) {
	const { md } = useBreakpoint()
	const { yaxis } = useGlobal()
	const priceMap = usePriceMap()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		initialCurrencyValues,
	)

	const { currenciesData } = useMetaVaultData('v1')

	const disabled = useMemo(
		() => computeInsufficientBalance(currencyValues, currenciesData),
		[currencyValues, currenciesData],
	)

	const totalDepositing = useMemo(
		() => computeTotalDepositing(Currencies3Pool, currencyValues, priceMap),
		[currencyValues, priceMap],
	)

	const {
		call: handleDeposit3Pool,
		loading: loadingDeposit3Pool,
	} = useContractWrite({
		contractName: 'curve3Pool',
		method: 'add_liquidity',
		description: `get 3CRV`,
	})

	const handleSubmit = useCallback(async () => {
		try {
			const amounts = Currencies3Pool.map((c) => {
				const _v = currencyValues[c.tokenId]
				if (_v) {
					return numberToDecimal(_v, c.decimals)
				}
				return '0'
			})
			const expected =
				(await yaxis?.contracts.curve3Pool.methods
					.calc_token_amount(amounts, true)
					.call()) * 0.99
			const reciept = await handleDeposit3Pool({
				args: [amounts, new BigNumber(expected).toString()],
			})
			console.log(reciept)
			setCurrencyValues(initialCurrencyValues)
			set3crvValue('3CRV', value3crv['3CRV'] + reciept)
			// set deposit
		} catch {}
	}, [currencyValues, handleDeposit3Pool, yaxis, value3crv, set3crvValue])

	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	return (
		<>
			{Currencies3Pool.map((currency) => (
				<DepositAssetRow
					key={currency.name}
					currency={currency}
					onChange={handleFormInputChange(setCurrencyValues)}
					value={currencyValues[currency.tokenId]}
					contractName={`vault.${currency.tokenId}`}
					approvee={yaxis?.contracts?.curve3Pool.options.address}
				/>
			))}
			<Row
				className="total"
				style={md ? {} : { padding: '0 10%' }}
				align="middle"
			>
				<Col xs={24} sm={24} md={12}>
					<Row justify="center">
						<ArrowDownOutlined style={{ fontSize: '40px' }} />
					</Row>
				</Col>
				<Col xs={24} sm={24} md={4}>
					<Text type="secondary">{phrases['Total'][language]}</Text>
					<Title level={3}>${totalDepositing}</Title>
				</Col>
				<Col xs={24} sm={24} md={6}>
					<Button
						className="investing-btn"
						disabled={disabled}
						loading={loadingDeposit3Pool}
						onClick={handleSubmit}
					>
						Convert
					</Button>
				</Col>
			</Row>
		</>
	)
}

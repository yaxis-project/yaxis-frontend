import { useState, useContext, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { CRV3, Currencies3Pool } from '../../../utils/currencies'
import WithdrawAssetRow from './WithdrawAssetRow'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import usePriceMap from '../../../hooks/usePriceMap'
import useGlobal from '../../../hooks/useGlobal'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { reduce } from 'lodash'
import { Row, Col, Grid, Typography, Divider } from 'antd'
import useContractWrite from '../../../hooks/useContractWrite'
import Button from '../../../components/Button'
import { CurrencyValues, handleFormInputChange } from '../utils'
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
export default function Stable3PoolWithdraw() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const { md } = useBreakpoint()
	const { yaxis } = useGlobal()
	const priceMap = usePriceMap()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		initialCurrencyValues,
	)

	const { currenciesData } = useMetaVaultData('v1')

	const {
		call: handleWithdraw3Pool,
		loading: loadingWithdraw3Pool,
	} = useContractWrite({
		contractName: 'curve3Pool',
		method: 'remove_liquidity',
		description: `convert 3CRV`,
	})

	const currency3CRV = useMemo(
		() => currenciesData.find((c) => c.tokenId === '3crv'),
		[currenciesData],
	)

	const balance3CRV = useMemo(() => {
		if (!currency3CRV) return new BigNumber(0)
		return new BigNumber(currency3CRV.balance)
	}, [currency3CRV])

	const usdBalance3CRV = useMemo(
		() => balance3CRV.multipliedBy(priceMap?.Cure3Crv),
		[balance3CRV, priceMap],
	)

	const input3CRV = useMemo(
		() =>
			Object.entries(currencyValues).reduce(
				(acc, [symbol, value]) => acc.plus(value || 0),
				new BigNumber(0),
			),
		[currencyValues],
	)

	const error = useMemo(() => input3CRV.gt(balance3CRV), [
		input3CRV,
		balance3CRV,
	])

	const handleSubmit = useCallback(async () => {
		try {
			const conversions = Object.fromEntries(
				await Promise.all(
					Currencies3Pool.map(async (c, i) => {
						const conversion = await yaxis.contracts.curve3Pool.methods
							.calc_withdraw_one_coin(
								new BigNumber(1).multipliedBy(
									10 ** CRV3.decimals,
								),
								i,
							)
							.call()
						return [c?.tokenId, conversion]
					}),
				),
			)
			const amounts = Currencies3Pool.map((c) => {
				const _v = currencyValues[c.tokenId]
				if (_v)
					return new BigNumber(_v)
						.multipliedBy(conversions[c.tokenId])
						.times(10 ** c.decimals)
						.multipliedBy(0.99) // Account for slippage
						.toString()
				return '0'
			})
			const reciept = await handleWithdraw3Pool({
				args: [
					input3CRV.multipliedBy(10 ** CRV3.decimals).toString(),
					amounts,
				],
			})

			if (reciept) setCurrencyValues(initialCurrencyValues)
		} catch {}
	}, [currencyValues, input3CRV, handleWithdraw3Pool, yaxis])

	return (
		<>
			<Row gutter={20} align="middle" style={{ marginBottom: '10px' }}>
				<Col xs={4} sm={6}>
					<Text>{phrases['You have'][language]}</Text>
				</Col>
				<Col span={3}>
					<img src={CRV3.icon} height="36" alt="logo" />
				</Col>
				<Col>
					<Title
						level={4}
						style={{
							margin: 0,
						}}
					>
						{balance3CRV.toFixed(2)} 3CRV
					</Title>
					<Title level={5} type="secondary" style={{ margin: 0 }}>
						${usdBalance3CRV.toFixed(2)}
					</Title>
				</Col>
			</Row>
			<Divider style={{ marginTop: '0' }}>TO</Divider>
			{Currencies3Pool.map((currency) => (
				<PaddedRow key={currency.name}>
					<WithdrawAssetRow
						currency={currency}
						onChange={handleFormInputChange(setCurrencyValues)}
						value={currencyValues[currency.tokenId]}
						error={error}
						balance={balance3CRV}
						inputBalance={input3CRV}
					/>
				</PaddedRow>
			))}
			<Row style={md ? {} : { padding: '0 10%' }} align="middle">
				<Col xs={24} sm={24} md={24} style={{ marginTop: '10px' }}>
					<Button
						className="investing-btn"
						disabled={balance3CRV.eq(0) || error || input3CRV.eq(0)}
						loading={loadingWithdraw3Pool}
						onClick={handleSubmit}
					>
						Convert
					</Button>
				</Col>
			</Row>
		</>
	)
}

const PaddedRow = styled.div`
	margin-bottom: 10px;
`

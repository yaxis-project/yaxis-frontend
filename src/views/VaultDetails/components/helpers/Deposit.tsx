import { useState, useMemo, useCallback, useEffect } from 'react'
import { converterData } from '../../../../constants/currencies'
import DepositAssetRow from '../../../Vault/components/DepositAssetRow'
import { useAllTokenBalances } from '../../../../state/wallet/hooks'
import { usePrices } from '../../../../state/prices/hooks'
import { useContracts } from '../../../../contexts/Contracts'
import { reduce } from 'lodash'
import { Row, Col, Space } from 'antd'
import Typography from '../../../../components/Typography'
import { numberToDecimal } from '../../../../utils/number'
import useContractWrite from '../../../../hooks/useContractWrite'
import Button from '../../../../components/Button'
import {
	CurrencyValues,
	handleFormInputChange,
	computeInsufficientBalance,
	computeTotalDepositing,
} from '../../../Vault/utils'
import BigNumber from 'bignumber.js'

const { Title, Text } = Typography
// const { useBreakpoint } = Grid

/**
 * Creates a deposit table for the savings account.
 */
export default function Deposit({ set3crvValue, value3crv, vault }) {
	const [Currencies3Pool, setCurrencies3Pool] = useState<any>([])

	useEffect(() => {
		if (converterData[vault] === undefined) {
			setCurrencies3Pool(converterData['usd'])
		} else {
			setCurrencies3Pool(converterData[vault])
		}
	}, [vault])

	const initialCurrencyValues: CurrencyValues = reduce(
		Currencies3Pool,
		(prev, curr) => ({
			...prev,
			[curr.tokenId]: '',
		}),
		{},
	)
	const { contracts } = useContracts()
	const { prices } = usePrices()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		initialCurrencyValues,
	)

	const [tokenBalances] = useAllTokenBalances()

	const disabled = useMemo(
		() => computeInsufficientBalance(currencyValues, tokenBalances),
		[currencyValues, tokenBalances],
	)

	const totalDepositing = useMemo(
		() => computeTotalDepositing(Currencies3Pool, currencyValues, prices),
		[Currencies3Pool, currencyValues, prices],
	)

	const { call: handleDeposit3Pool, loading: loadingDeposit3Pool } =
		useContractWrite({
			contractName: 'externalLP.3pool.pool',
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
				(await contracts?.externalLP['3pool'].pool.calc_token_amount(
					amounts,
					true,
				)) * 0.99
			await handleDeposit3Pool({
				args: [amounts, new BigNumber(expected).toString()],
			})
			setCurrencyValues(initialCurrencyValues)
			set3crvValue('3CRV', value3crv['3CRV'])
		} catch {}
	}, [
		Currencies3Pool,
		contracts?.externalLP,
		handleDeposit3Pool,
		initialCurrencyValues,
		set3crvValue,
		value3crv,
		currencyValues,
	])

	return (
		<Row justify="center">
			<Col xs={22}>
				<Row justify="space-between">
					<Col xs={24}>
						<Space
							direction="vertical"
							size="small"
							style={{ width: '100%' }}
						>
							{Currencies3Pool.map((currency) => (
								<DepositAssetRow
									key={currency.name}
									currency={currency}
									onChange={handleFormInputChange(
										setCurrencyValues,
									)}
									value={currencyValues[currency.tokenId]}
									contractName={`currencies.ERC20.${currency.tokenId}.contract`}
									approvee={
										contracts?.externalLP['3pool'].pool
											.address
									}
								/>
							))}
						</Space>
					</Col>
				</Row>
				<Row
					className="total"
					style={{ marginTop: '1rem' }}
					align="middle"
					justify="center"
				>
					<Col xs={12}>
						<Text type="secondary">Total</Text>
						<Title level={3} style={{ margin: '0 0 10px 0' }}>
							${totalDepositing}
						</Title>
						<Button
							disabled={disabled}
							loading={loadingDeposit3Pool}
							onClick={handleSubmit}
							style={{ fontSize: '18px', width: '100%' }}
						>
							Deposit
						</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	)
}

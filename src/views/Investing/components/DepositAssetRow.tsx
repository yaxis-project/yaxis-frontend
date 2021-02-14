import React, { useState, useEffect } from 'react'
import { find } from 'lodash'
import { Currency } from '../../../utils/currencies'
import usePriceMap from '../../../hooks/usePriceMap'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import Value from '../../../components/Value'
import BigNumber from 'bignumber.js'

import { Row, Col, Typography, Input, Form, Button } from 'antd'

const { Text } = Typography

interface DepositAssetRowProps {
	currency: Currency
	onChange: Function
}

/**
 * Generates an input component for the given currency, with pricing and other details related to the
 * signed in user.
 * @param props DepositAssetRowProps
 */
export default function DepositAssetRow(props: DepositAssetRowProps) {
	const { currency, onChange } = props
	const { currenciesData } = useMetaVaultData('v1')

	const currencyData = find(
		currenciesData,
		(curr) => curr['name'] === currency.name,
	)
	const balance = currencyData
		? new BigNumber(currencyData.balance)
		: new BigNumber('0')

	const { [currency.priceMapKey]: price } = usePriceMap()

	const value = new BigNumber(price).times(balance).toFixed(2)

	const [currentInput, setCurrentInput] = useState<string>('')
	const [inputError, setInputError] = useState<boolean>(false)

	useEffect(() => {
		onChange(currency.tokenId, currentInput)
		setInputError(new BigNumber(currentInput).gt(new BigNumber(balance)))
	}, [currentInput])

	const maxAmount = () => setCurrentInput(currencyData.maxDeposit || '0')

	return (
		<>
			<Row className="deposit-asset-row">
				<Col span={5} className="currency">
					<img src={currency.icon} height="36" alt="logo" />
					<Text>{currency.name}</Text>
				</Col>
				<Col span={7} className="balance">
					<Value
						value={balance.toNumber()}
						numberPrefix="$"
						decimals={2}
					/>
					<Text type="secondary">
						{value} {currency.name}
					</Text>
				</Col>
				<Col span={12} className="amount">
					<Form.Item
						validateStatus={inputError && 'error'}
						style={{ marginBottom: 0 }}
					>
						<Input
							placeholder="0"
							size="large"
							type="number"
							suffix={
								<>
									<Text type="secondary">
										{currency.name}
									</Text>
									&nbsp;
									<Button
										block
										size="small"
										onClick={maxAmount}
									>
										MAX
									</Button>
								</>
							}
							onChange={(e) => setCurrentInput(e.target.value)}
						/>
					</Form.Item>
				</Col>
			</Row>
		</>
	)
}

import { useState } from 'react'
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
	value: string
	disabled: boolean
}

/**
 * Generates an input component for the given currency, with pricing and other details related to the
 * signed in user.
 * @param props DepositAssetRowProps
 */
export default function DepositAssetRow(props: DepositAssetRowProps) {
	const { currency, onChange, value, disabled } = props
	const { currenciesData } = useMetaVaultData('v1')

	const currencyData = find(
		currenciesData,
		(curr) => curr['name'] === currency.name,
	)
	const balance = currencyData
		? new BigNumber(currencyData.balance)
		: new BigNumber('0')

	const { [currency.priceMapKey]: price } = usePriceMap()

	const balanceUSD = new BigNumber(price).times(balance).toFixed(2)

	const [inputError, setInputError] = useState<boolean>(false)

	return (
		<>
			<Row className="deposit-asset-row">
				<Col xs={12} sm={6} md={5} className="currency">
					<img src={currency.icon} height="36" alt="logo" />
					<Text>{currency.name}</Text>
				</Col>
				<Col xs={12} sm={8} md={7} className="balance">
					<Value
						value={balanceUSD}
						numberPrefix="$"
						decimals={2}
					/>
					<Text type="secondary">
						{balance.toFixed(2)} {currency.name}
					</Text>
				</Col>
				<Col xs={24} sm={24} md={12} className="amount">
					<Form.Item
						validateStatus={inputError && 'error'}
						style={{ marginBottom: 0 }}
					>
						<Input
							placeholder="0"
							size="large"
							type="number"
							value={value}
							min={"0"}
							suffix={
								<>
									<Text type="secondary">
										{currency.name}
									</Text>
									&nbsp;
									<Button
										block
										size="small"
										onClick={
											() => onChange(currency.tokenId, currencyData?.maxDeposit || '0')
										}
									>
										MAX
									</Button>
								</>
							}
							onChange={(e) => {
								onChange(currency.tokenId, e.target.value)
								setInputError(new BigNumber(e.target.value).gt(new BigNumber(balance)))
							}
							}
							disabled={disabled}
						/>
					</Form.Item>
				</Col>
			</Row>
		</>
	)
}

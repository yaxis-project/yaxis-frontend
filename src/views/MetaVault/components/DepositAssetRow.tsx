import React, { useState, useMemo } from 'react'
import { find } from 'lodash'
import { Currency } from '../../../utils/currencies'
import usePriceMap from '../../../hooks/usePriceMap'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import Value from '../../../components/Value'
import Input from '../../../components/Input'
import ApprovalCover from '../../../components/ApprovalCover'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { Row, Col, Typography, Form } from 'antd'

const { Text } = Typography

interface DepositAssetRowProps {
	currency: Currency
	onChange: Function
	value: string
	contractName: string
	approvee: string
	containerStyle?: any
}

/**
 * Generates an input component for the given currency, with pricing and other details related to the
 * signed in user.
 * @param props DepositAssetRowProps
 */
const DepositAssetRow: React.FC<DepositAssetRowProps> = ({
	currency,
	onChange,
	value,
	contractName,
	approvee,
	containerStyle,
}) => {
	const { currenciesData } = useMetaVaultData('v1')

	const currencyData = useMemo(
		() => find(currenciesData, (curr) => curr['name'] === currency.name),
		[currenciesData, currency],
	)
	const balance = useMemo(
		() =>
			currencyData
				? new BigNumber(currencyData.balance)
				: new BigNumber('0'),
		[currencyData],
	)

	const { [currency.priceMapKey]: price } = usePriceMap()

	const balanceUSD = useMemo(
		() => new BigNumber(price).times(balance).toFixed(2),
		[balance, price],
	)

	const [inputError, setInputError] = useState<boolean>(false)

	return (
		<>
			<Row
				className="deposit-asset-row"
				justify="center"
				align="middle"
				style={containerStyle ? containerStyle : {}}
			>
				<Col xs={7} sm={6} md={6}>
					<Row align="middle">
						<img src={currency.icon} height="36" alt="logo" />
						<StyledText>{currency.name}</StyledText>
					</Row>
				</Col>
				<Col xs={11} sm={6} md={6} className="balance">
					<Value value={balanceUSD} numberPrefix="$" decimals={2} />
					<Text type="secondary">
						{balance.toFixed(2)} {currency.name}
					</Text>
				</Col>
				<Col xs={18} sm={12} md={12}>
					<ApprovalCover
						contractName={contractName}
						approvee={approvee}
						hidden={balance.eq(0)}
					>
						<Form.Item
							validateStatus={inputError && 'error'}
							style={{ marginBottom: 0 }}
						>
							<Input
								onChange={(e) => {
									onChange(currency.tokenId, e.target.value)
									setInputError(
										new BigNumber(e.target.value).gt(
											new BigNumber(balance),
										),
									)
								}}
								value={value}
								min={'0'}
								placeholder="0"
								disabled={balance.isZero()}
								suffix={currency.name}
								onClickMax={() =>
									onChange(
										currency.tokenId,
										currencyData?.maxDeposit || '0',
									)
								}
							/>
						</Form.Item>
					</ApprovalCover>
				</Col>
			</Row>
		</>
	)
}

export default DepositAssetRow

const StyledText = styled(Text)`
	margin-left: 16px;
	font-size: 18px;
	line-height: 1em;
`

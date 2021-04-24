import React, { useMemo } from 'react'
import { Currency, Currencies3Pool } from '../../../utils/currencies'
import usePriceMap from '../../../hooks/usePriceMap'
import Value from '../../../components/Value'
import ApprovalCover from '../../../components/ApprovalCover'
import BigNumber from 'bignumber.js'
import Input from '../../../components/Input'
import styled from 'styled-components'
import useContractRead from '../../../hooks/useContractRead'

import { Row, Col, Typography, Form } from 'antd'

const { Text } = Typography

interface WithdrawAssetRowProps {
	currency: Currency
	onChange: Function
	value: string
	error: boolean
	balance: BigNumber
	inputBalance: BigNumber
	approvee: string
	containerStyle?: any
}

/**
 * Generates an input component for the given currency, with pricing and other details related to the
 * signed in user.
 * @param props WithdrawAssetRowProps
 */
const WithdrawAssetRow: React.FC<WithdrawAssetRowProps> = ({
	currency,
	onChange,
	value,
	error,
	balance,
	inputBalance,
	approvee,
	containerStyle,
}) => {
	const currencyIndex = useMemo(
		() => Currencies3Pool.findIndex((c) => c.tokenId === currency.tokenId),
		[currency],
	)

	const { data: rate } = useContractRead({
		contractName: 'curve3Pool',
		method: 'calc_withdraw_one_coin',
		args: [new BigNumber(1).multipliedBy(10 ** 18), currencyIndex],
	})

	const conversionRate = useMemo(
		() => new BigNumber(rate || 0).dividedBy(10 ** currency.decimals),
		[rate, currency],
	)

	const { [currency.priceMapKey]: price } = usePriceMap()

	const balanceUSD = useMemo(
		() =>
			new BigNumber(value || 0)
				.times(conversionRate)
				.times(price)
				.toFixed(2),
		[conversionRate, value, price],
	)

	return (
		<>
			<Row
				className="deposit-asset-row"
				justify="center"
				align="middle"
				style={containerStyle ? containerStyle : {}}
			>
				<Col xs={18} sm={12} md={12}>
					<ApprovalCover
						contractName={`vault.${currency.tokenId}`}
						approvee={approvee}
						hidden={balance.eq(0)}
					>
						<Form.Item
							validateStatus={error && 'error'}
							style={{ marginBottom: 0 }}
						>
							<Input
								onChange={(e) => {
									onChange(currency.tokenId, e.target.value)
								}}
								value={value}
								min={'0'}
								placeholder="0"
								disabled={balance.isZero()}
								suffix={'3CRV'}
								onClickMax={() => {
									const max = balance.minus(inputBalance)
									if (max.gt(0))
										onChange(currency.tokenId, max)
								}}
							/>
						</Form.Item>
					</ApprovalCover>
				</Col>
				<Col xs={7} sm={7} md={7}>
					<Row align="middle" style={{ paddingLeft: '8px' }}>
						<img src={currency.icon} height="36" alt="logo" />
						<StyledText>{currency.name}</StyledText>
					</Row>
				</Col>
				<Col xs={11} sm={5} md={5} className="balance">
					<Value value={balanceUSD} numberPrefix="$" decimals={2} />
					<Text type="secondary">
						{new BigNumber(value || 0)
							.times(conversionRate)
							.toFixed(2)}{' '}
						{currency.name}
					</Text>
				</Col>
			</Row>
		</>
	)
}

export default WithdrawAssetRow

const StyledText = styled(Text)`
	margin-left: 16px;
	font-size: 18px;
	line-height: 1em;
`

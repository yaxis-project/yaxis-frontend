import React, { useState, useMemo, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import {
	Currency,
	MIM,
	DAI,
	USDT,
	USDC,
	RENCRV,
	WBTC,
	ALETHCRV,
	ETH,
	LINKCRV,
	LINK,
	threeCRV,
} from '../../../../constants/currencies'
import { useAllTokenBalances } from '../../../../state/wallet/hooks'
import { usePrices } from '../../../../state/prices/hooks'
import { useContracts } from '../../../../contexts/Contracts'
import { reduce } from 'lodash'
import { Row, Col, Divider, Form, Space } from 'antd'
import Typography from '../../../../components/Typography'
import useContractWrite from '../../../../hooks/useContractWrite'
import Button from '../../../../components/Button'
import { CurrencyValues, handleFormInputChange } from '../../../Vault/utils'
import BigNumber from 'bignumber.js'
import Value from '../../../../components/Value'
import ApprovalCover from '../../../../components/ApprovalCover'
import Input from '../../../../components/Input'
import { useSingleCallResult } from '../../../../state/onchain/hooks'

const { Title, Text } = Typography

/**
 * Creates a deposit table for the savings account.
 */
export default function Stable3PoolWithdraw({ vault }: any) {
	const [Currencies3Pool, setCurrencies3Pool] = useState<any>([])

	useEffect(() => {
		switch (vault) {
			case 'usd':
				setCurrencies3Pool([MIM, DAI, USDT, USDC])
				break
			case 'btc':
				setCurrencies3Pool([RENCRV, WBTC])
				break
			case 'eth':
				setCurrencies3Pool([ALETHCRV, ETH])
				break
			default:
				setCurrencies3Pool([LINKCRV, LINK])
				break
		}
	}, [vault])

	const initialCurrencyValues: CurrencyValues = reduce(
		[DAI, USDT, USDC],
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

	const balance3CRV = useMemo(
		() => tokenBalances['3crv']?.amount || new BigNumber(0),
		[tokenBalances],
	)

	const input3CRV = useMemo(
		() =>
			Object.entries(currencyValues).reduce(
				(acc, [symbol, value]) => acc.plus(value || 0),
				new BigNumber(0),
			),
		[currencyValues],
	)

	const { call: handleWithdraw3Pool, loading: loadingWithdraw3Pool } =
		useContractWrite({
			contractName: 'external.curve3pool',
			method: 'remove_liquidity_imbalance',
			description: `convert 3CRV`,
		})

	const usdBalance3CRV = useMemo(
		() => balance3CRV.multipliedBy(prices?.['3crv']),
		[balance3CRV, prices],
	)

	const error = useMemo(
		() => input3CRV.gt(balance3CRV),
		[input3CRV, balance3CRV],
	)

	const handleSubmit = useCallback(async () => {
		try {
			const conversions = Object.fromEntries(
				await Promise.all(
					Currencies3Pool.map(async (c, i) => {
						const conversion = await contracts?.externalLP[
							'3pool'
						].pool['calc_withdraw_one_coin'](
							new BigNumber(1)
								.multipliedBy(10 ** threeCRV.decimals)
								.toString(),
							`${i}`,
							{},
						)
						return [c?.tokenId, conversion]
					}),
				),
			)
			const amounts = Currencies3Pool.map((c) => {
				const _v = currencyValues[c.tokenId]
				if (_v)
					return new BigNumber(_v)
						.multipliedBy(conversions[c.tokenId].toString())
						.toFixed(0)
						.toString()
				return '0'
			})
			const reciept = await handleWithdraw3Pool({
				args: [
					amounts,
					input3CRV.multipliedBy(10 ** threeCRV.decimals).toString(),
				],
			})

			if (reciept) setCurrencyValues(initialCurrencyValues)
		} catch (e) {
			console.log(e)
		}
	}, [
		Currencies3Pool,
		handleWithdraw3Pool,
		input3CRV,
		initialCurrencyValues,
		contracts?.externalLP,
		currencyValues,
	])

	return (
		<>
			<Row
				align="middle"
				justify="center"
				style={{ marginBottom: '10px' }}
			>
				<Col xs={6}>
					<Row align="bottom">
						<img
							src={threeCRV.icon}
							height="36"
							width="36"
							alt="logo"
							style={{ marginBottom: '0.5rem' }}
						/>
						<div style={{ marginLeft: '0.8rem' }}>
							<Text>You have</Text>
							<Title
								level={4}
								style={{
									margin: 0,
								}}
							>
								{balance3CRV.toFixed(2)} 3CRV
							</Title>
							<Title
								level={5}
								type="secondary"
								style={{ margin: 0 }}
							>
								${usdBalance3CRV.toFixed(2)}
							</Title>
						</div>
					</Row>
				</Col>
			</Row>
			<Divider style={{ marginTop: '0' }}></Divider>
			<Row justify="center">
				<Col xs={22}>
					<Space
						direction="vertical"
						size="small"
						style={{ width: '100%' }}
					>
						{Currencies3Pool.map((currency) => (
							<PaddedRow key={currency.name}>
								<WithdrawAssetRow
									currency={currency}
									onChange={handleFormInputChange(
										setCurrencyValues,
									)}
									value={currencyValues[currency.tokenId]}
									error={error}
									balance={balance3CRV}
									inputBalance={input3CRV}
									approvee={
										contracts?.externalLP['3pool'].pool
											.address
									}
									Currencies3Pool={Currencies3Pool}
								/>
							</PaddedRow>
						))}
					</Space>
				</Col>
			</Row>
			<Row
				style={{ marginTop: '1.5rem' }}
				align="middle"
				justify="center"
			>
				<Col xs={12}>
					<Button
						disabled={balance3CRV.eq(0) || error || input3CRV.eq(0)}
						loading={loadingWithdraw3Pool}
						onClick={handleSubmit}
						style={{ fontSize: '18px', width: '100%' }}
					>
						Withdraw
					</Button>
				</Col>
			</Row>
		</>
	)
}

const PaddedRow = styled.div`
	margin-bottom: 10px;
`

interface WithdrawAssetRowProps {
	currency: Currency
	onChange: Function
	value: string
	error: boolean
	balance: BigNumber
	inputBalance: BigNumber
	approvee: string
	containerStyle?: any
	Currencies3Pool?: any
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
	Currencies3Pool,
}) => {
	const currencyIndex = useMemo(
		() => Currencies3Pool.findIndex((c) => c.tokenId === currency.tokenId),
		[Currencies3Pool, currency.tokenId],
	)
	const { contracts } = useContracts()

	const { result: rate } = useSingleCallResult(
		contracts?.externalLP['3pool'].pool,
		'calc_withdraw_one_coin',
		[new BigNumber(1).multipliedBy(10 ** 18).toString(), currencyIndex],
	)

	const conversionRate = useMemo(
		() =>
			new BigNumber(rate?.toString() || 0).dividedBy(
				10 ** currency.decimals,
			),
		[rate, currency],
	)

	const {
		prices: { [currency.priceMapKey]: price },
	} = usePrices()

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
						contractName={`currencies.ERC20.${currency.tokenId}.contract`}
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
								suffix={currency.name}
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
						<img
							src={currency.icon}
							height="36"
							width="36"
							alt="logo"
						/>
						<StyledText>{currency.name}</StyledText>
					</Row>
				</Col>
				<Col xs={11} sm={5} md={5} className="balance">
					<Value
						value={balanceUSD === 'NaN' ? '0.00' : balanceUSD}
						numberPrefix="$"
						decimals={2}
					/>
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

const StyledText = styled(Text)`
	margin-left: 16px;
	font-size: 18px;
	line-height: 1em;
`

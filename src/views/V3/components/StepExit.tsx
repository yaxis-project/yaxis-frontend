import { useMemo, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import { Row, Steps } from 'antd'
import Button from '../../../components/Button'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { currentConfig } from '../../../constants/configs'
import BigNumber from 'bignumber.js'
import useContractWrite from '../../../hooks/useContractWrite'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import useTranslation from '../../../hooks/useTranslation'

const { Step } = Steps

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
	complete: boolean
}

interface StepExitProps extends StepProps {
	stakedMVLT: BigNumber
	walletMVLT: BigNumber
}

const StepExit: React.FC<StepExitProps> = ({ stakedMVLT, walletMVLT }) => {
	const translate = useTranslation()

	const { chainId } = useWeb3Provider()

	const config = useMemo(() => currentConfig(chainId), [chainId])
	const uniYaxEthLP = useMemo(() => config.pools['Uniswap YAX/ETH'], [config])

	const { call: handleUnstake, loading: loadingUnstake } = useContractWrite({
		contractName: `rewards.MetaVault`,
		method: 'withdraw',
		description: `unstake MVLT`,
	})

	const unstakeMetaVault = useMemo(() => {
		if (stakedMVLT.gt(0))
			return (
				<Step
					title={
						<StyledButton
							onClick={async () =>
								handleUnstake({
									args: [stakedMVLT.multipliedBy(10 ** 18)],
								})
							}
							loading={loadingUnstake}
							height={'40px'}
						>
							{translate('Claim')} MetaVault{' '}
							{translate('rewards')}
						</StyledButton>
					}
					description={translate('Gather pending MetaVault rewards')}
					icon={<StyledIcon />}
				/>
			)
		return (
			<Step
				title={'MetaVault ' + translate('rewards')}
				description={translate('Done.')}
				status="finish"
			/>
		)
	}, [translate, stakedMVLT, handleUnstake, loadingUnstake])

	const { call: handleWithdraw, loading: submitting } = useContractWrite({
		contractName: 'internal.yAxisMetaVault',
		method: 'withdraw',
		description: `MetaVault withdraw`,
	})

	/////

	const message = useMemo(() => {
		if (stakedMVLT.gt(0) || walletMVLT.gt(0))
			return translate('First, exit the previous contract')

		return translate('Step complete.')
	}, [translate, stakedMVLT, walletMVLT])

	return (
		<>
			<DetailOverviewCardRow>
				<Description>{message}</Description>
				<Steps direction="vertical">{unstakeMetaVault}</Steps>
			</DetailOverviewCardRow>
		</>
	)
}

export default StepExit

const Description = styled(Row)`
	font-size: 16px;
	padding: 0 10px 20px 10px;
`
const StyledButton = styled(Button)`
	border: none;
	margin-bottom: 10px;
`
const StyledIcon = styled(ExclamationCircleOutlined)`
	font-size: 30px;
	color: gold;
	&:hover {
		transition: color 0.5s;
		color: #e8b923;
	}
`

// import { useState, useContext, useMemo, useCallback } from 'react'
// import styled from 'styled-components'
// import { threeCRV, Currencies3Pool } from '../../../constants/currencies'
// import WithdrawAssetRow from './WithdrawAssetRow'
// import { useAllTokenBalances } from '../../../state/wallet/hooks'
// import { usePrices } from '../../../state/prices/hooks'
// import { useContracts } from '../../../contexts/Contracts'
//
// import phrases from './translations'
// import { reduce } from 'lodash'
// import Typography from '../../../components/Typography'
// import { Row, Col, Grid } from 'antd'
// import useContractWrite from '../../../hooks/useContractWrite'
// import Button from '../../../components/Button'
// import Divider from '../../../components/Divider'
// import { CurrencyValues, handleFormInputChange } from '../utils'
// import BigNumber from 'bignumber.js'

// const { Title, Text } = Typography
// const { useBreakpoint } = Grid

// const initialCurrencyValues: CurrencyValues = reduce(
// 	Currencies3Pool,
// 	(prev, curr) => ({
// 		...prev,
// 		[curr.tokenId]: '',
// 	}),
// 	{},
// )

// /**
//  * Creates a deposit table for the savings account.
//  */
// export default function Stable3PoolWithdraw() {
// 	const languages = useContext(LanguageContext)
// 	const language = languages.state.selected

// 	const { md } = useBreakpoint()
// 	const { contracts } = useContracts()
// 	const { prices } = usePrices()
// 	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
// 		initialCurrencyValues,
// 	)

// 	const [tokenBalances] = useAllTokenBalances()

// 	const balance3CRV = useMemo(
// 		() => tokenBalances['3crv']?.amount || new BigNumber(0),
// 		[tokenBalances],
// 	)

// 	const input3CRV = useMemo(
// 		() =>
// 			Object.entries(currencyValues).reduce(
// 				(acc, [symbol, value]) => acc.plus(value || 0),
// 				new BigNumber(0),
// 			),
// 		[currencyValues],
// 	)

// 	const { call: handleWithdraw3Pool, loading: loadingWithdraw3Pool } =
// 		useContractWrite({
// 			contractName: 'external.curve3pool',
// 			method: 'remove_liquidity_imbalance',
// 			description: `convert 3CRV`,
// 		})

// 	const usdBalance3CRV = useMemo(
// 		() => balance3CRV.multipliedBy(prices?.['3crv']),
// 		[balance3CRV, prices],
// 	)

// 	const error = useMemo(
// 		() => input3CRV.gt(balance3CRV),
// 		[input3CRV, balance3CRV],
// 	)

// 	const handleSubmit = useCallback(async () => {
// 		try {
// 			const conversions = Object.fromEntries(
// 				await Promise.all(
// 					Currencies3Pool.map(async (c, i) => {
// 						const conversion = await contracts?.external.curve3pool[
// 							'calc_withdraw_one_coin'
// 						](
// 							new BigNumber(1)
// 								.multipliedBy(10 ** threeCRV.decimals)
// 								.toString(),
// 							`${i}`,
// 							{},
// 						)
// 						return [c?.tokenId, conversion]
// 					}),
// 				),
// 			)
// 			const amounts = Currencies3Pool.map((c) => {
// 				const _v = currencyValues[c.tokenId]
// 				if (_v)
// 					return new BigNumber(_v)
// 						.multipliedBy(conversions[c.tokenId].toString())
// 						.toFixed(0)
// 						.toString()
// 				return '0'
// 			})
// 			const reciept = await handleWithdraw3Pool({
// 				args: [
// 					amounts,
// 					input3CRV.multipliedBy(10 ** threeCRV.decimals).toString(),
// 				],
// 			})

// 			if (reciept) setCurrencyValues(initialCurrencyValues)
// 		} catch (e) {
// 			console.log(e)
// 		}
// 	}, [currencyValues, input3CRV, handleWithdraw3Pool, contracts])

// 	return (
// 		<>
// 			<Row gutter={20} align="middle" style={{ marginBottom: '10px' }}>
// 				<Col xs={4} sm={6}>
// 					<Text>{phrases['You have'][language]}</Text>
// 				</Col>
// 				<Col span={3}>
// 					<img src={threeCRV.icon} height="36" alt="logo" />
// 				</Col>
// 				<Col>
// 					<Title
// 						level={4}
// 						style={{
// 							margin: 0,
// 						}}
// 					>
// 						{balance3CRV.toFixed(2)} 3CRV
// 					</Title>
// 					<Title level={5} type="secondary" style={{ margin: 0 }}>
// 						${usdBalance3CRV.toFixed(2)}
// 					</Title>
// 				</Col>
// 			</Row>
// 			<Divider style={{ marginTop: '0' }}>
// 				<Text>TO</Text>
// 			</Divider>
// 			{Currencies3Pool.map((currency) => (
// 				<PaddedRow key={currency.name}>
// 					<WithdrawAssetRow
// 						currency={currency}
// 						onChange={handleFormInputChange(setCurrencyValues)}
// 						value={currencyValues[currency.tokenId]}
// 						error={error}
// 						balance={balance3CRV}
// 						inputBalance={input3CRV}
// 						approvee={contracts?.external.curve3pool.address}
// 					/>
// 				</PaddedRow>
// 			))}
// 			<Row style={md ? {} : { padding: '0 10%' }} align="middle">
// 				<Col xs={24} sm={24} md={24} style={{ marginTop: '10px' }}>
// 					<Button
// 						disabled={balance3CRV.eq(0) || error || input3CRV.eq(0)}
// 						loading={loadingWithdraw3Pool}
// 						onClick={handleSubmit}
// 					>
// 						Convert
// 					</Button>
// 				</Col>
// 			</Row>
// 		</>
// 	)
// }

// const PaddedRow = styled.div`
// 	margin-bottom: 10px;
// `

// import React, { useMemo } from 'react'
// import { Currency, Currencies3Pool } from '../../../constants/currencies'
// import { usePrices } from '../../../state/prices/hooks'
// import Value from '../../../components/Value'
// import ApprovalCover from '../../../components/ApprovalCover'
// import BigNumber from 'bignumber.js'
// import Input from '../../../components/Input'
// import styled from 'styled-components'
// import { useContracts } from '../../../contexts/Contracts'
// import { useSingleCallResult } from '../../../state/onchain/hooks'
// import Typography from '../../../components/Typography'

// import { Row, Col, Form } from 'antd'

// const { Text } = Typography

// interface WithdrawAssetRowProps {
// 	currency: Currency
// 	onChange: Function
// 	value: string
// 	error: boolean
// 	balance: BigNumber
// 	inputBalance: BigNumber
// 	approvee: string
// 	containerStyle?: any
// }

/**
 * Generates an input component for the given currency, with pricing and other details related to the
 * signed in user.
 * @param props WithdrawAssetRowProps
 */
// const WithdrawAssetRow: React.FC<WithdrawAssetRowProps> = ({
// 	currency,
// 	onChange,
// 	value,
// 	error,
// 	balance,
// 	inputBalance,
// 	approvee,
// 	containerStyle,
// }) => {
// 	const currencyIndex = useMemo(
// 		() => Currencies3Pool.findIndex((c) => c.tokenId === currency.tokenId),
// 		[currency],
// 	)
// 	const { contracts } = useContracts()

// 	const { result: rate } = useSingleCallResult(
// 		contracts?.external.curve3pool,
// 		'calc_withdraw_one_coin',
// 		[new BigNumber(1).multipliedBy(10 ** 18).toString(), currencyIndex],
// 	)

// 	const conversionRate = useMemo(
// 		() =>
// 			new BigNumber(rate?.toString() || 0).dividedBy(
// 				10 ** currency.decimals,
// 			),
// 		[rate, currency],
// 	)

// 	const {
// 		prices: { [currency.priceMapKey]: price },
// 	} = usePrices()

// 	const balanceUSD = useMemo(
// 		() =>
// 			new BigNumber(value || 0)
// 				.times(conversionRate)
// 				.times(price)
// 				.toFixed(2),
// 		[conversionRate, value, price],
// 	)

// 	return (
// 		<>
// 			<Row
// 				className="deposit-asset-row"
// 				justify="center"
// 				align="middle"
// 				style={containerStyle ? containerStyle : {}}
// 			>
// 				<Col xs={18} sm={12} md={12}>
// 					<ApprovalCover
// 						contractName={`currencies.ERC20.${currency.tokenId}.contract`}
// 						approvee={approvee}
// 						hidden={balance.eq(0)}
// 					>
// 						<Form.Item
// 							validateStatus={error && 'error'}
// 							style={{ marginBottom: 0 }}
// 						>
// 							<Input
// 								onChange={(e) => {
// 									onChange(currency.tokenId, e.target.value)
// 								}}
// 								value={value}
// 								min={'0'}
// 								placeholder="0"
// 								disabled={balance.isZero()}
// 								suffix={'3CRV'}
// 								onClickMax={() => {
// 									const max = balance.minus(inputBalance)
// 									if (max.gt(0))
// 										onChange(currency.tokenId, max)
// 								}}
// 							/>
// 						</Form.Item>
// 					</ApprovalCover>
// 				</Col>
// 				<Col xs={7} sm={7} md={7}>
// 					<Row align="middle" style={{ paddingLeft: '8px' }}>
// 						<img src={currency.icon} height="36" alt="logo" />
// 						<StyledText>{currency.name}</StyledText>
// 					</Row>
// 				</Col>
// 				<Col xs={11} sm={5} md={5} className="balance">
// 					<Value value={balanceUSD} numberPrefix="$" decimals={2} />
// 					<Text type="secondary">
// 						{new BigNumber(value || 0)
// 							.times(conversionRate)
// 							.toFixed(2)}{' '}
// 						{currency.name}
// 					</Text>
// 				</Col>
// 			</Row>
// 		</>
// 	)
// }

// export default WithdrawAssetRow

// const StyledText = styled(Text)`
// 	margin-left: 16px;
// 	font-size: 18px;
// 	line-height: 1em;
// `

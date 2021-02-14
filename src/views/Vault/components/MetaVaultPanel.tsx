import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Space, Row, Col, Button, Radio, notification, Alert } from 'antd'
import { BigNumber } from 'bignumber.js'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import _ from 'lodash'

import Card from '../../../components/Card'
import Spacer from '../../../components/Spacer'
import CurrencyInput from './CurrencyInput'
import { ICurrency, MetaVaultData } from '../../../hooks/useMetaVaultData'
import { getContract } from '../../../utils/erc20'
import { provider } from 'web3-core'
import { useWallet } from 'use-wallet'
import { callApprove, numberToDecimal } from '../../../yaxis/utils'
import { currentConfig } from '../../../yaxis/configs'
import useMetaVault from '../../../hooks/useMetaVault'
import { tokensConfig } from '../../../yaxis/configs'

const NavButton = styled.div`
	color: ${(props) => props.theme.color.grey[400]};
	cursor: pointer;
	font-weight: 700;
	border-radius: 6px;
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	border: 1px solid transparent;
	padding: 8px 16px;
	display: inline-block;
	&:hover {
		color: ${(props) => props.theme.color.grey[500]};
	}
	&.active {
		color: ${(props) => props.theme.color.primary.main};
		border-color: ${(props) => props.theme.color.primary.main};
	}
	@media (max-width: 400px) {
		padding-left: ${(props) => props.theme.spacing[2]}px;
		padding-right: ${(props) => props.theme.spacing[2]}px;
	}
`

const PanelRightTextPrimary = styled.div`
	color: ${(props) => props.theme.color.primary.main};
	font-weight: 600;
	font-size: 16px;
`

const PanelRightText = styled.div`
	font-weight: 600;
	font-size: 16px;
`

type Props = {
	currencies: Array<ICurrency>
	tokenName: string
	onUpdateAllowances?: () => void
	metaVaultData: MetaVaultData
	isEstimating: boolean
	callEstimateWithdrawals: (shares: string) => void
}

function MetaVaultPanel({
	currencies,
	tokenName,
	onUpdateAllowances,
	metaVaultData,
	isEstimating,
	callEstimateWithdrawals,
}: Props): React.ReactElement {
	const { account, ethereum } = useWallet()
	const { onDepositAll, isSubmitting, onWithdraw } = useMetaVault()

	const [currentTab, setCurrentTab] = useState<string>('deposit')
	const [currencyValues, setCurrencyValues] = useState<{
		[key: string]: string | undefined
	}>({})
	const [inputValue, setInputValue] = useState<string>('')
	const [tokenReceived, setTokenReceived] = useState<number>(0)
	const [areApproved, setApproved] = useState<boolean>(false)
	const [selectedTokenId, setSelectedTokenId] = useState<string>('3crv')
	const ratio = 0.5
	const isDeposit = currentTab === 'deposit'
	const isWithdraw = !isDeposit

	const selectedCurrency = useMemo((): ICurrency => {
		return currencies.find((c) => c.tokenId === selectedTokenId)
	}, [currencies, selectedTokenId])

	const handleInputChange = (key: string, value: string) => {
		setCurrencyValues((prev) => ({
			...prev,
			[key]: value,
		}))
	}

	const handleInputDebounce = _.debounce((value) => {
		callEstimateWithdrawals(value)
	}, 800)

	const handleSubmit = async () => {
		if (isDeposit) {
			const amounts = currencies.map((c) => {
				const _v = currencyValues[c.tokenId]
				if (_v) {
					return numberToDecimal(_v, c.decimals)
				}
				return '0'
			})
			onDepositAll(amounts)
		} else {
			if (!selectedCurrency) {
				notification.error({
					message: `[withdraw] Invalid currency`,
				})
				return
			}
			const sharesAmount = numberToDecimal(inputValue, 18)
			notification.info({
				message: 'Please confirm withdraw transaction',
			})
			onWithdraw(sharesAmount, selectedCurrency.address)
		}
	}

	// const onGlobalInfiniteApprovalChange = (e: any) => {
	//   console.log('global: ', e.target.checked);
	// }
	// const onAllCoinInBalanceChange = (e: any) => {
	//   console.log('all coin in balance: ', e.target.checked);
	// }
	// const onUseMaximumAmountChange = (e: any) => {
	//   console.log('use maximum amount: ', e.target.checked);
	// }
	const onSelectCurrency = (e: any) => {
		const { value } = e.target
		setSelectedTokenId(value === selectedTokenId ? '' : value)
	}
	const setTab = (key: string) => () => {
		setCurrentTab(key)
		setApproved(false)
	}

	useEffect(() => {
		// Calc token received
		// this is sample
		const received = Object.values(currencyValues)
			.map((c) => Number(c))
			.filter((v) => !isNaN(v))
			.reduce((sum, v) => (sum += v), 0)
		setTokenReceived(received)
	}, [currencyValues])

	// check currency need approval
	const currenciesNeededApproval = useMemo((): ICurrency[] => {
		const _cur: ICurrency[] = []
		if (isDeposit) {
			Object.entries(currencyValues).forEach(([symbol, v]) => {
				const value = new BigNumber(v || 0)
				const currency = currencies.find((c) => c.tokenId === symbol)
				if (
					!value.isNaN() &&
					currency &&
					value.gte(currency.allowance) &&
					value.lte(currency.balance)
				) {
					_cur.push(currency)
				}
			})
		}
		return _cur
	}, [currencyValues, currencies, isDeposit])

	const disabled = useMemo((): boolean => {
		if (isDeposit) {
			const noValue = !Object.values(currencyValues).find(
				(v) => parseFloat(v) > 0,
			)
			const insufficientBalance = !!Object.entries(currencyValues).find(
				([id, v]) => {
					const value = new BigNumber(v || 0)
					const currency = currencies.find((c) => c.tokenId === id)
					return value.gt(currency.balance || 0)
				},
			)
			return noValue || insufficientBalance
		} else {
			const bvalue = new BigNumber(inputValue || '0')
			return (
				!selectedTokenId ||
				bvalue.lte(0) ||
				bvalue.gt(metaVaultData.totalBalance || 0)
			)
		}
	}, [
		currencyValues,
		selectedTokenId,
		isDeposit,
		metaVaultData.totalBalance,
		currencies,
	])

	const handleApprove = async () => {
		setApproved(true)
		const approvalCalls: Promise<any>[] = []
		currenciesNeededApproval.forEach((currency, index) => {
			const contract = getContract(ethereum as provider, currency.address)
			approvalCalls.push(
				callApprove(
					contract,
					currentConfig.contractAddresses.yAxisMetaVault,
					account,
				),
			)
			setTimeout(() => {
				notification.info({
					message: `Please approve ${currency.name} for Meta Vault V1`,
				})
			}, 1000 * (index + 1))
		})
		try {
			await Promise.all(approvalCalls)
			setTimeout(async () => {
				await onUpdateAllowances()
				setApproved(false)
			}, 1000)
		} catch (e) {
			setApproved(false)
		}
	}

	if (new Date().getTime() < currentConfig.vault.metaVaultOpenTime) {
		const renderer = (countdownProps: CountdownRenderProps) => {
			const { hours, minutes, seconds } = countdownProps
			const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
			const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
			const paddedHours = hours < 10 ? `0${hours}` : hours
			return (
				<span style={{ width: '100%' }}>
					{paddedHours}:{paddedMinutes}:{paddedSeconds}
				</span>
			)
		}
		return (
			<Card>
				<div
					style={{
						textAlign: 'center',
						fontSize: '32px',
						fontWeight: 700,
					}}
				>
					<div style={{ fontSize: '16px' }}>Open Meta Vault V1</div>
					<Countdown
						date={new Date(currentConfig.vault.metaVaultOpenTime)}
						renderer={renderer}
					/>
				</div>
			</Card>
		)
	}

	return (
		<Card>
			<Row align={'middle'} justify={'space-between'}>
				<Space>
					<NavButton
						className={isDeposit ? 'active' : ''}
						onClick={setTab('deposit')}
					>
						Deposit
					</NavButton>
					<NavButton
						className={isWithdraw ? 'active' : ''}
						onClick={setTab('withdraw')}
					>
						Withdraw
					</NavButton>
				</Space>
				{/*<div style={{margin: '5px 0'}}>*/}
				{/*	<span>{'Reward per block: '}</span>*/}
				{/*	<Value inline value={metaVaultData?.rewardPerBlock} />*/}
				{/*	<span>{` ${tokensConfig.reward.name}`}</span>*/}
				{/*</div>*/}
			</Row>
			<Spacer />
			{isDeposit && (
				<>
					{/*<small>You can deposit one or more kind of the stable coins below, and the smart contract will automatically*/}
					{/*	balance the deposited assets proportionally</small>*/}
					<Spacer />
				</>
			)}
			{/*{isWithdraw && <small>Available amount：{new Intl.NumberFormat().format(parseFloat(metaVaultData?.balance))} </small>}*/}
			{/*{isWithdraw && selectedCurrency ? (*/}
			{/*	<small>*/}
			{/*		{'Available：'}*/}
			{/*		<b>{new Intl.NumberFormat().format(parseFloat(selectedCurrency?.maxWithdrawal))}</b>*/}
			{/*		{` ${selectedCurrency?.name}`}*/}
			{/*	</small>*/}
			{/*) : null}*/}
			{/*<Spacer/>*/}
			<Row gutter={24}>
				<Col xs={24} sm={12}>
					{isWithdraw ? (
						<>
							<div style={{ marginBottom: '0.25rem' }}>
								<span>Input</span>
							</div>
							<CurrencyInput
								id={tokensConfig.share.tokenId}
								value={inputValue}
								max={metaVaultData?.totalBalance}
								name={tokensConfig.share.name}
								loading={isEstimating}
								error={
									parseFloat(inputValue) < 0 ||
									new BigNumber(inputValue).gt(
										metaVaultData?.totalBalance,
									)
								}
								onChange={(id, value) => {
									setInputValue(value)
									handleInputDebounce(value)
								}}
							/>

							<div
								style={{
									marginTop: '1rem',
									marginBottom: '0.25rem',
								}}
							>
								<span>Output</span>
							</div>
							<Radio.Group
								style={{ width: '100%' }}
								defaultValue={selectedTokenId}
								onChange={onSelectCurrency}
							>
								{currencies.map((c) => {
									return (
										<CurrencyInput
											disabled
											key={c.tokenId}
											id={c.tokenId}
											max={c.maxWithdrawal}
											icon={c.icon}
											name={c.name}
											value={c.withdrawal}
											showRadioButton={!isDeposit}
											checked={
												selectedTokenId === c.tokenId
											}
											showMax={false}
										/>
									)
								})}
							</Radio.Group>
						</>
					) : (
						<React.Fragment>
							{currencies.map((c) => {
								const bvalue = new BigNumber(
									currencyValues[c.tokenId],
								)
								const error =
									bvalue.lt(0) || bvalue.gt(c.maxDeposit)
								return (
									<CurrencyInput
										key={c.tokenId}
										id={c.tokenId}
										value={currencyValues[c.tokenId]}
										max={c.maxDeposit}
										icon={c.icon}
										name={c.name}
										error={error}
										onChange={handleInputChange}
									/>
								)
							})}
						</React.Fragment>
					)}
					<Spacer />
					{/* <div>
            <Checkbox onChange={onGlobalInfiniteApprovalChange}>Global infinite approval</Checkbox>
          </div>
          {isDeposit && (
            <>
              <div>
                <Checkbox onChange={onAllCoinInBalanceChange}>Add all coins in a balanced proportion</Checkbox>
              </div>
              <div>
                <Checkbox onChange={onUseMaximumAmountChange}>Use maximum amount of coins available</Checkbox>
              </div>
            </>
          )} */}
				</Col>
				<Col xs={24} sm={12}>
					{/*<Row>*/}
					{/*	<Col flex="auto">*/}
					{/*		<PanelRightText>Max slippage</PanelRightText>*/}
					{/*	</Col>*/}
					{/*	<Col>*/}
					{/*		<PanelRightText>{ratio}%</PanelRightText>*/}
					{/*	</Col>*/}
					{/*</Row>*/}
					{isDeposit ? (
						<>
							<Row style={{ marginBottom: '0.5rem' }}>
								<Alert
									type={'info'}
									message={`MetaVault implements a 0.1% withdrawal fee`}
								></Alert>
							</Row>
							{/*<Row>*/}
							{/*<Col flex="auto">*/}
							{/*	<PanelRightTextPrimary>You will receive at least</PanelRightTextPrimary>*/}
							{/*</Col>*/}
							{/*<Col>*/}
							{/*	<Row gutter={4}>*/}
							{/*		<Col flex="auto">*/}
							{/*			<PanelRightTextPrimary>{new Intl.NumberFormat().format(tokenReceived)}</PanelRightTextPrimary>*/}
							{/*		</Col>*/}
							{/*		<Col>*/}
							{/*			<PanelRightText>*/}
							{/*				{tokenName} tokens*/}
							{/*			</PanelRightText>*/}
							{/*		</Col>*/}
							{/*	</Row>*/}
							{/*</Col>*/}
							{/*</Row>*/}
						</>
					) : (
						<>
							<div style={{ height: '22px' }} />
							{/*<Row style={{marginBottom: '0.5rem'}}>*/}
							{/*	<Alert type={"info"}*/}
							{/*				 message={`Note: current strategy (pickle) includes a ${ratio}% withdraw fee`}></Alert>*/}
							{/*</Row>*/}
							<Row style={{ marginBottom: '0.5rem' }}>
								<Alert
									type={'info'}
									message={`MetaVault implements a 0.1% withdrawal fee`}
								></Alert>
							</Row>
							<Row style={{ marginBottom: '0.5rem' }}>
								<Alert
									type={'info'}
									message={`Slippage for 3CRV-Stable swap is ~0.1%`}
								>
									\
								</Alert>
							</Row>
							{parseFloat(selectedCurrency.withdrawal || '0') >
							0 ? (
								<Row>
									<Col flex="auto">
										<PanelRightTextPrimary>
											You will receive at least
										</PanelRightTextPrimary>
									</Col>
									<Col>
										<Row gutter={4}>
											<Col flex="auto">
												<PanelRightTextPrimary>
													{new Intl.NumberFormat().format(
														parseFloat(
															selectedCurrency.withdrawal,
														),
													)}
												</PanelRightTextPrimary>
											</Col>
											<Col>
												<PanelRightText>
													{selectedCurrency.name}
												</PanelRightText>
											</Col>
										</Row>
									</Col>
								</Row>
							) : null}
						</>
					)}
				</Col>
			</Row>
			<Spacer />
			<Row>
				<Col flex="auto" />
				<Col>
					<Space>
						{/*{*/}
						{/*	currencyNeededApproval ? (*/}
						{/*		<Button*/}
						{/*			type="primary" size="large"*/}
						{/*			loading={!!areApproved && areApproved === currencyNeededApproval.name}*/}
						{/*			onClick={() => handleApprove(currencyNeededApproval)}*/}
						{/*		>*/}
						{/*			{`Approve ${currencyNeededApproval.name}`}*/}
						{/*		</Button>*/}
						{/*	) : null*/}
						{/*}*/}
						{currenciesNeededApproval.length ? (
							<Button
								type="primary"
								size="large"
								disabled={areApproved}
								loading={areApproved}
								onClick={handleApprove}
							>
								{areApproved ? 'Approving' : 'Approve'}
							</Button>
						) : (
							<Button
								type="primary"
								size="large"
								disabled={disabled || isSubmitting}
								loading={isSubmitting}
								onClick={handleSubmit}
								danger
							>
								{isDeposit ? 'Deposit' : 'Withdraw'}
							</Button>
						)}
					</Space>
				</Col>
			</Row>
		</Card>
	)
}

export default MetaVaultPanel

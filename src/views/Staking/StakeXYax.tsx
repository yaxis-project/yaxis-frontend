import React, { useContext, useEffect, useMemo, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import Spacer from '../../components/Spacer'
import useYax from '../../hooks/useYaxis'
import { getContract } from '../../utils/erc20'
import UnstakeXYax from './components/UnstakeXYax'
import StakeYaxis from './components/StakeYaxis'

import { getTotalStaking } from '../../yaxis/utils'
import BigNumber from 'bignumber.js'
import { currentConfig } from '../../yaxis/configs'
import { Button, Col, PageHeader, Row, Spin, Alert, Tooltip } from 'antd'
import BalanceCard from '../../components/Card/BalanceCard'
import Value from '../../components/Value'
import useTokenBalance from '../../hooks/useTokenBalance'
import useBlock from '../../hooks/useBlock'
import useStaking from '../../hooks/useStaking'
import usePriceMap from '../../hooks/usePriceMap'
import useMetaVaultData from '../../hooks/useMetaVaultData'
import useYAxisAPY from '../../hooks/useYAxisAPY'
import { InfoCircleOutlined } from '@ant-design/icons'

const StakeXYax: React.FC = () => {
	const { tokenAddress } = {
		tokenAddress: currentConfig.contractAddresses.xYaxStaking,
	}

	const [totalSupply, setTotalStaking] = useState<BigNumber>(new BigNumber(0))
	const [pricePerFullShare, setPricePerFullShare] = useState<BigNumber>(
		new BigNumber(0),
	)

	const block = useBlock()
	// const totalYaxInXYax = useTokenBalanceOf(currentConfig.contractAddresses.yaxis,
	// 	currentConfig.contractAddresses.xYaxStaking)
	const yaxis = useYax()
	const { ethereum } = useWallet()
	const priceMap = usePriceMap()
	const { metaVaultData } = useMetaVaultData('v1')
	const { yAxisAPY, isInitialized: yAxisAPYIsInitialized } = useYAxisAPY()
	const threeCrvApyPercent = new BigNumber(
		(yAxisAPY && yAxisAPY['3crv']) || 0,
	)
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	useEffect(() => {
		async function fetchTotalStakinga() {
			const totalStaking = await getTotalStaking(yaxis)
			setTotalStaking(totalStaking)
		}
		async function fetchPricePerFullShare() {
			try {
				const value = await yaxis.contracts.xYaxStaking.methods
					.getPricePerFullShare()
					.call()
				setPricePerFullShare(new BigNumber(value).div(1e18))
			} catch (e) {}
		}

		if (yaxis) {
			fetchTotalStakinga()
			fetchPricePerFullShare()
		}
	}, [yaxis, setTotalStaking, block])

	const loading = false
	// const rate = (totalSupply && totalYaxInXYax) ? new BigNumber(totalYaxInXYax ?? 0).dividedBy(totalSupply ?? 0).toNumber() : 0
	const rate = pricePerFullShare.toNumber()
	const lpContract = useMemo(() => {
		return getContract(ethereum as provider, tokenAddress)
	}, [ethereum, tokenAddress])

	const { stakingData, isExiting, onExit } = useStaking()
	const xYaxBalance = useTokenBalance(lpContract.options.address)
	const totalValueLocked =
		new BigNumber(totalSupply).div(1e18).times(priceMap?.YAX).toNumber() ||
		0
	const sumApy = new BigNumber(threeCrvApyPercent).div(100).multipliedBy(0.2)
	const annualProfits = sumApy
		.div(365)
		.plus(1)
		.pow(365)
		.minus(1)
		.times(metaVaultData?.tvl || 0)
	// total apy
	let metavaultAPY = new BigNumber(annualProfits)
		.dividedBy(totalValueLocked || 1)
		.multipliedBy(100)
	console.log('DEBUG_LOG==>>: metavaultAPY', {
		metavaultAPY: metavaultAPY.toString(),
	})
	let yaxAPY = new BigNumber(stakingData?.incentiveApy || 0)
		.div(pricePerFullShare)
		.div(100)
	const totalApy = yaxAPY.plus(metavaultAPY)
	const sYAXPrice = new BigNumber(rate).multipliedBy(priceMap?.YAX).toNumber()
	const { color: themeColor } = useContext(ThemeContext)
	const loadingAnnualProfits =
		loading ||
		!yAxisAPYIsInitialized ||
		typeof metaVaultData?.initialized === 'undefined'
	const loadingApy = loadingAnnualProfits || !stakingData?.initialized

	return (
		<>
			<PageHeader
				title="Stake YAX to Earn Rewards"
				// subTitle="Receive 20% of MetaVault farming profits"
				subTitle={
					<a
						href={`https://etherscan.io/address/${currentConfig.contractAddresses.xYaxStaking}`}
						target={'_blank'}
						rel="noopener noreferrer"
					>
						View Contract
					</a>
				}
			>
				{/* eslint-disable-next-line react/jsx-no-undef */}
				<Alert
					message={
						<div>
							<div>
								Staking earns 20% of MetaVault farming rewards
								(sold to YAX and distributed to stakers)
							</div>
							<div>Staking also earns additional YAX rewards</div>
							<div>All rewards are auto-compounded.</div>
						</div>
					}
					type="success"
				/>
				<Spacer size={'md'} />

				<Row gutter={[8, 8]}>
					<Col xs={12} md={8}>
						<BalanceCard
							title="Total value locked"
							balance={totalValueLocked}
							prefixSymbol={'$'}
							loading={loading}
						/>
					</Col>
					<Col xs={12} md={8}>
						{/*<BalanceCard*/}
						{/*	title="Total APY"*/}
						{/*	balance={totalApy.toNumber()}*/}
						{/*	symbol={'%'}*/}
						{/*	loading={loading}*/}
						{/*/>*/}
						<BalanceCard title="Total APY" loading={loading}>
							{loadingApy ? (
								<span>
									<Spin spinning={loadingApy} size="small" />
								</span>
							) : (
								<Tooltip
									title={
										<div>
											<div>
												{'YAX: '}
												<b>{yaxAPY?.toFixed(1)}%</b>
											</div>
											{/*<div>{'Pickle: '}<b>{pickleApyPercent?.toFixed(1)}%</b></div>*/}
											{/*<div>{'CurveLP: '}<b>{lpApyPercent?.toFixed(1)}%</b></div>*/}
											<div>
												{'CRV (20%): '}
												<b>
													{metavaultAPY?.toFixed(1)}%
												</b>
											</div>
											{/*<div>{'APR: '}<b>{totalApr?.toFixed(1)}%</b></div>*/}
										</div>
									}
								>
									<Value
										inline
										value={totalApy.toNumber()}
										decimals={1}
									/>
									<span>{'% '}</span>
									<InfoCircleOutlined
										style={{
											fontSize: 12,
											color: themeColor.primary.main,
										}}
									/>
								</Tooltip>
							)}
						</BalanceCard>
					</Col>
					{/*<Col xs={12} md={6}>*/}
					{/*	<BalanceCard*/}
					{/*		title={(*/}
					{/*			<>*/}
					{/*				{'Rate'}&nbsp;*/}
					{/*				{sYAXPrice ? (*/}
					{/*					<span style={{color: 'rgba(255,255,255,0.85)'}}>(≈${sYAXPrice?.toFixed(4)})</span>*/}
					{/*				) : null}*/}
					{/*			</>*/}
					{/*		)}*/}
					{/*		decimals={6}*/}
					{/*		balance={rate}*/}
					{/*		prefixSymbol={'1 sYAX = '}*/}
					{/*		symbol={'YAX'}*/}
					{/*		loading={loading}*/}
					{/*	/>*/}
					{/*</Col>*/}
					<Col xs={12} md={8}>
						<BalanceCard title="Annual profits from MetaVault">
							{loadingAnnualProfits ? (
								<span>
									<Spin spinning={loadingApy} size="small" />
								</span>
							) : (
								<>
									<span>{'$'}</span>
									<Value
										inline
										value={annualProfits.toNumber()}
										decimals={1}
									/>
								</>
							)}
						</BalanceCard>
					</Col>
				</Row>
				<Spacer size={'lg'} />
				<StyledFarm>
					<Row gutter={[8, 8]}>
						<StyledCardsWrapper>
							<StyledCardWrapper>
								<UnstakeXYax
									lpContract={lpContract}
									tokenPrice={sYAXPrice}
									rate={pricePerFullShare}
								/>
							</StyledCardWrapper>
							<Spacer />
							<StyledCardWrapper>
								<StakeYaxis />
							</StyledCardWrapper>
						</StyledCardsWrapper>
					</Row>
					<Spacer size="lg" />
					<Row gutter={[8, 8]}>
						<StyledCardsWrapper>
							{/*<StyledCardWrapper>*/}
							{/*	<Button*/}
							{/*		disabled={xYaxBalance.lte(0) || isClaiming}*/}
							{/*		loading={isClaiming}*/}
							{/*		ghost type="primary" size="large"*/}
							{/*		onClick={onClaimReward}*/}
							{/*	>*/}
							{/*		{isClaiming ? 'Claiming' : 'Claim rewards'}*/}
							{/*	</Button>*/}
							{/*</StyledCardWrapper>*/}
							{/*<Spacer/>*/}
							<StyledCardWrapper>
								<Button
									disabled={xYaxBalance.lte(0) || isExiting}
									loading={isExiting}
									ghost
									type="primary"
									size="large"
									onClick={onExit}
								>
									{isExiting
										? 'Exiting'
										: 'Exit: Claim and Unstake'}
								</Button>
							</StyledCardWrapper>
						</StyledCardsWrapper>
					</Row>

					{/*<Row gutter={[8, 8]}>*/}
					{/*	<StyledCardsWrapper>*/}
					{/*		<StyledCardWrapper>*/}
					{/*			<StyledInfo>*/}
					{/*				ℹ️️ You will earn a portion of the MetaVault reward based on the amount*/}
					{/*				of xYax held relative the weight of the staking. xYax can be minted*/}
					{/*				by staking Yax. To redeem Yax staked plus swap fees convert xYax*/}
					{/*				back to*/}
					{/*				Yax. {totalSupply ? `There are currently ${getBalanceNumber(totalSupply)} xYAX in the whole pool.` : ''}*/}
					{/*			</StyledInfo>*/}
					{/*		</StyledCardWrapper>*/}
					{/*	</StyledCardsWrapper>*/}
					{/*</Row>*/}
					<Spacer size="lg" />
				</StyledFarm>
			</PageHeader>
		</>
	)
}

const StyledFarm = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	@media (max-width: 768px) {
		width: 100%;
	}
`

const StyledCardsWrapper = styled.div`
	display: flex;
	width: 600px;
	@media (max-width: 768px) {
		width: 100vw;
		flex-flow: column nowrap;
		align-items: center;
	}
`

const StyledCardWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	@media (max-width: 768px) {
		width: 80%;
	}
`

const StyledInfo = styled.h3`
	color: ${(props) => props.theme.color.grey[400]};
	font-size: 16px;
	font-weight: 400;
	margin: 0;
	padding: 0;
	text-align: center;
`

export default StakeXYax

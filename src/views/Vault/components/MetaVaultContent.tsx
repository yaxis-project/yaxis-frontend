import React, {useCallback, useState, useEffect, useContext} from 'react';
import {Space, Row, Col, Divider, Button, Spin, Tooltip} from 'antd';
import {InfoCircleOutlined} from '@ant-design/icons'
import styled, {ThemeContext} from 'styled-components';
import {NavLink, useRouteMatch} from 'react-router-dom';
import {useWallet} from 'use-wallet';
import {BigNumber} from 'bignumber.js';

import Spacer from '../../../components/Spacer';
import useMetaVaultData from '../../../hooks/useMetaVaultData';
import BalanceCard, {BalanceTitle} from '../../../components/Card/BalanceCard';
import Title from './Title';
import WalletProviderModal from '../../../components/WalletProviderModal';
import useModal from '../../../hooks/useModal';
import CurrencyReservePlaceholder from './CurrencyReservePlaceholder';
import MetaVaultPanel from './MetaVaultPanel';
import useAllowance from "../../../hooks/useAllowance";
import useTokenBalances from "../../../hooks/useTokenBalances";
import {currentConfig} from "../../../yaxis/configs";
import useAllowances from "../../../hooks/useAllowances";
import useMetaVault from '../../../hooks/useMetaVault';
import Value from '../../../components/Value';
import {tokensConfig} from '../../../yaxis/configs'
import { getCurveApyApi } from '../../../yaxis/utils';
import useYAxisAPY from '../../../hooks/useYAxisAPY';
import usePickle from "../../../hooks/usePickle";
import usePriceMap from '../../../hooks/usePriceMap';
import { abbrNumber } from '../../../utils/formatBalance';

const NavButton = styled(NavLink)`
  color: ${(props) => props.theme.color.grey[400]};
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
`;

const AvatarCoin = styled.div`
  width: 90px;
  height: 90px;
  background: white;
  border-radius: 6px;
  margin-right: 16px;
  padding: 5px;
  text-align: center;
`;

const CoinIcon = styled.img`
  width: 40px;
  height: 40px;
  display: inline-block;
`;

function MetaVaultContent() {
	const {params: {id}} = useRouteMatch();
	const {
		balance, loading, name, currenciesData,
		tabs, onUpdateAllowances,
		metaVaultData,
		onFetchMetaVaultData,
		isEstimating, callEstimateWithdrawals
	} = useMetaVaultData(id);
	const { isClaiming, onGetRewards } = useMetaVault()
	const icons = currenciesData.map(c => c.icon);
	const [curveApy, setCurveApy] = useState<number>(0)
	const [curveApyIsInitialized, setCurveApyIsInitialized] = useState<boolean>(false);
	const { color: themeColor } = useContext(ThemeContext)
	const { yAxisAPY, isInitialized: yAxisAPYIsInitialized } = useYAxisAPY()
  // const {pickleAPY} = usePickle()
	const { YAX: YAXPrice } = usePriceMap()
	useEffect(() => {
		const fetchCurveApy = async () => {
			const value = await getCurveApyApi()
			setCurveApy(value)
			setCurveApyIsInitialized(true)
		}
		fetchCurveApy()
	}, [setCurveApy])

	const handleClaimRewards = async () => {
		try {
			await onGetRewards()
			onFetchMetaVaultData()
		} catch (e) {
			console.error(e)
		}
	}
	const yaxApyPercent = new BigNumber(metaVaultData?.apy || 0)
	const pickleApyPercent =  new BigNumber(0)// new BigNumber(pickleAPY).multipliedBy(0.8)
	const lpApyPercent = new BigNumber(curveApy).times(100)
	const threeCrvApyPercent = new BigNumber((yAxisAPY && yAxisAPY['3crv']) || 0).multipliedBy(0.8)

	const totalPickleApy = new BigNumber(pickleApyPercent)
		.plus(lpApyPercent)
		.plus(threeCrvApyPercent)
	const pickleApy = totalPickleApy
		.div(100).div(365).plus(1).pow(365).minus(1).times(100)
		.decimalPlaces(18)
	const totalApr = yaxApyPercent.plus(totalPickleApy)
	const totalApy = yaxApyPercent.plus(pickleApy)

	const pendingReward = parseFloat(metaVaultData?.pendingYax || '0')
	const totalBalanceUsd = new BigNumber(metaVaultData?.totalBalance || '0')
		.multipliedBy(metaVaultData?.mvltPrice || '0')
		.toNumber()
	const loadingApy = !yAxisAPYIsInitialized || !curveApyIsInitialized || typeof metaVaultData?.initialized === 'undefined'

	return (
		<>
			{/*<Space>*/}
			{/*  {tabs.map(t => (*/}
			{/*    <NavButton*/}
			{/*      key={t.id}*/}
			{/*      exact*/}
			{/*      activeClassName="active"*/}
			{/*      to={`/metavault/${t.id}`}*/}
			{/*    >*/}
			{/*      {t.name}*/}
			{/*    </NavButton>*/}
			{/*  ))}*/}
			{/*</Space>*/}
			{/*<Spacer />*/}
			<Row gutter={[8, 8]}>
				<Col xs={24} sm={16}>
					<Row gutter={4}>
						<Spin spinning={loading} size="small">
							<AvatarCoin>
								{icons.slice(0, 4).map(ic => (
									<CoinIcon src={ic} alt="token" key={ic} />
								))}
							</AvatarCoin>
						</Spin>
						<Col flex="auto">
							<Title
								text={name}
								loading={loading}
							/>
							{/*pJar0c + p3crv PICKLE farm +*/}
							<h3>Current Strategy: 3CRV LP + YAX rewards</h3>
							<a
								href={`https://etherscan.io/address/${currentConfig.contractAddresses.yAxisMetaVault}`}
								target={'_blank'}
								rel="noopener noreferrer"
							>
								View Contract
							</a>
						</Col>
					</Row>
				</Col>
				<Col xs={24} sm={8}>
					<BalanceCard
						loading={loading}
						height={'auto'}
						prefixSymbol={'$'}
						symbol={' (1crv = $1)'}
					>
						<>
							<Row align={'middle'} justify={'space-between'}>
								<BalanceTitle>{'Total value locked'}</BalanceTitle>
								<Row align={'middle'} justify={'space-between'}>
									{/*<Tooltip title="1crv = $1">*/}
									{/*	<InfoCircleOutlined style={{fontSize: 12, color: '#43d2ff'}} />*/}
									{/*</Tooltip>*/}
									<span style={{padding: '0 2px 0 5px'}}>$</span>
									<Value
										inline
										value={metaVaultData.tvl}
									/>
								</Row>
							</Row>
							<Row align={'middle'} justify={'space-between'}>
								<BalanceTitle>{'Reward per block'}</BalanceTitle>
								<div>
									<Value
										inline fontSize={'14px'}
										value={metaVaultData?.rewardPerBlock}
									/>
									<span>{` ${tokensConfig.reward.name}`}</span>
								</div>
							</Row>
						</>
					</BalanceCard>
				</Col>
			</Row>
			<Divider/>
			{/*{!account && (*/}
			{/*  <>*/}
			{/*    <Row>*/}
			{/*      <Col>*/}
			{/*        <span>You haven't connected wallet </span>*/}
			{/*        <Button*/}
			{/*          title="Connect wallet"*/}
			{/*          onClick={onPresentWalletProviderModal}*/}
			{/*        >*/}
			{/*          Connect wallet*/}
			{/*        </Button>*/}
			{/*      </Col>*/}
			{/*    </Row>*/}
			{/*    <Spacer />*/}
			{/*  </>*/}
			{/*)}*/}
			{(currenciesData.length === 0 && loading) && (
			  <CurrencyReservePlaceholder />
			)}
			{currenciesData.length > 0 && (
			  <Row gutter={[8, 8]}>
					<Col xs={12} sm={8}>
						<BalanceCard
							title="Total APY"
							loading={loading}
						>
							{loadingApy ? (
								<span>
									<Spin spinning={loadingApy} size="small" />
								</span>
							) : (
								<Tooltip title={(
									<div>
										<div>{'YAX: '}<b>{yaxApyPercent?.toFixed(1)}%</b></div>
										{/*<div>{'Pickle: '}<b>{pickleApyPercent?.toFixed(1)}%</b></div>*/}
										<div>{'CurveLP: '}<b>{lpApyPercent?.toFixed(1)}%</b></div>
										<div>{'CRV (80%): '}<b>{threeCrvApyPercent?.toFixed(1)}%</b></div>
										<div>{'APR: '}<b>{totalApr?.toFixed(1)}%</b></div>
									</div>
								)}>
									<Value inline value={totalApy.toNumber()} decimals={1} />
									<span>{'% '}</span>
									<InfoCircleOutlined style={{fontSize: 12, color: themeColor.primary.main}} />
								</Tooltip>
							)}
						</BalanceCard>
					</Col>
					<Col xs={12} sm={8}>
						<BalanceCard
							title="Your shares"
							balance={parseFloat(metaVaultData?.totalBalance || '0')}
							symbol={tokensConfig.share.name}
							loading={loading}
							suffix={totalBalanceUsd ? (
								<small>&nbsp;(${abbrNumber(totalBalanceUsd)})</small>
							) : null}
						/>
					</Col>
					<Col xs={12} sm={8}>
						<BalanceCard
							title={'Your pending reward'}
							loading={loading}
						>
							<div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
								<div>
									<div style={{display: 'inline-block'}}>
										<Value value={pendingReward} />
									</div>
									<span>{' YAX'}</span>&nbsp;
									{YAXPrice && pendingReward > 0 ? (
										<small>(${abbrNumber(pendingReward * YAXPrice)})</small>
									) : null}
								</div>
								<div>
									{
										parseFloat(metaVaultData?.pendingYax || '0') > 0 ? (
											<Button
												ghost type="primary" size="small"
												loading={isClaiming}
												style={{padding: '0 15px'}}
												onClick={handleClaimRewards}
											>
												Claim
											</Button>
										) : null
									}
								</div>
							</div>
						</BalanceCard>
					</Col>
			  </Row>
			)}
			<Spacer/>
			<Spin spinning={loading} tip="loading...">
				<MetaVaultPanel
					key={id}
					currencies={currenciesData}
					tokenName={name}
					metaVaultData={metaVaultData}
					onUpdateAllowances={onUpdateAllowances}
					isEstimating={isEstimating}
					callEstimateWithdrawals={callEstimateWithdrawals}
				/>
			</Spin>
		</>
	);
}

export default MetaVaultContent;

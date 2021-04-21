import React, { useMemo } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import LiquidityCard from './components/LiquidityCard'
import LiquidityOverviewCard from './components/LiquidityOverviewCard'
import PairStatsCard from './components/PairStatsCard'
import './index.less'
import useLPContractData from '../../hooks/useLPContractData'
import usePriceMap from '../../hooks/usePriceMap'
import { StakePool } from '../../yaxis/type'
import Stake from './components/Stake'
import LegacyStake from './components/LegacyStake'
import { red } from '../../theme/colors'
import BigNumber from 'bignumber.js'
type Props = {
	pool: StakePool
}

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

const Liquidity: React.FC<Props> = ({ pool }) => {
	const { stakedBalance, reserves, totalSupply } = useLPContractData(pool)
	const { YAXIS, ETH } = usePriceMap()
	const balanceUSD = useMemo(() => {
		if (!reserves || !ETH || !YAXIS || !totalSupply || !stakedBalance)
			return new BigNumber(0)
		const share = new BigNumber(stakedBalance).div(totalSupply)
		const shareT0 = new BigNumber(reserves['_reserve0'])
			.multipliedBy(share)
			.dividedBy(10 ** 18)
		const shareT1 = new BigNumber(reserves['_reserve1'])
			.multipliedBy(share)
			.dividedBy(10 ** 18)
		return shareT0.multipliedBy(YAXIS).plus(shareT1.multipliedBy(ETH))
	}, [YAXIS, ETH, reserves, totalSupply, stakedBalance])
	return (
		<div className="liquidity-view">
			<Page
				loading={false}
				mainTitle={pool.name}
				secondaryText={
					pool?.legacy ? 'Legacy Liquidity Pool' : 'Liquidity Pool'
				}
				value={
					pool?.legacy
						? 'No longer supported.'
						: '$' +
						  Number(balanceUSD).toLocaleString(
								undefined, // leave undefined to use the browser's locale,
								// or use a string like 'en-US' to override it.
								{ minimumFractionDigits: 2 },
						  )
				}
				valueInfo={
					pool?.legacy
						? 'Please unstake, remove funds, and move to a new LP.'
						: 'Your Position'
				}
				background={pool?.legacy ? red[100] : undefined}
			>
				<Row gutter={16}>
					<Col xs={24} sm={24} md={24} lg={16}>
						<LiquidityCard pool={pool} />
						{pool?.legacy ? (
							<LegacyStake
								pid={pool.pid}
								tokenName={pool.symbol.toUpperCase()}
							/>
						) : (
							<Stake pool={pool} />
						)}
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<Row>
							<LiquidityOverviewCard
								pool={pool}
								totalUSDBalance={balanceUSD}
							/>
							<PairStatsCard farmID={pool.symbol} />
						</Row>
					</StyledCol>
				</Row>
			</Page>
		</div>
	)
}

export default Liquidity

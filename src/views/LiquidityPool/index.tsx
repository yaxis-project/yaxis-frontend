import React from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import LiquidityCard from './components/LiquidityCard'
import LiquidityOverviewCard from './components/LiquidityOverviewCard'
import PairStatsCard from './components/PairStatsCard'
import './index.less'
import useLPContractData from '../../hooks/useLPContractData'
import { numberToFloat } from '../../yaxis/utils'
import { StakePool } from '../../yaxis/type'
import Stake from './components/Stake'
import LegacyStake from './components/LegacyStake'
import { red } from '../../theme/colors'

type Props = {
	pool: StakePool
}

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

const Liqudity: React.FC<Props> = ({ pool }) => {
	// should use this method to get 'stakedBalance' rather than 'userBalance' below
	// as it's hooked up to block updates & other internal data
	const { stakedBalance } = useLPContractData(pool.symbol)
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
						: `${numberToFloat(stakedBalance)} LPT`
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
							<LiquidityOverviewCard pool={pool} />
							<PairStatsCard farmID={pool.symbol} />
						</Row>
					</StyledCol>
				</Row>
			</Page>
		</div>
	)
}

export default Liqudity

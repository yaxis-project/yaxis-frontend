import React from 'react'
import Page from '../../components/Page/Page'
import YaxisPriceGraph from '../../components/YaxisPriceGraph'
import { Row, Col } from 'antd'
import LiquidityCard from './components/LiquidityCard'
import LiquidityOverviewCard from './components/LiquidityOverviewCard'
import PairStatsCard from './components/PairStatsCard'
import './index.less'
import useLPContractData from '../../hooks/useLPContractData'
import { numberToFloat } from '../../yaxis/utils'
import { StakePool } from '../../yaxis/type'

type Props = {
	pool: StakePool
}

const Liqudity: React.FC<Props> = ({ pool }) => {
	// should use this method to get 'stakedBalance' rather than 'userBalance' below
	// as it's hooked up to block updates & other internal data
	const { stakedBalance } = useLPContractData(pool.symbol)
	return (
		<div className="liquidity-view">
			<Page
				loading={false}
				mainTitle={pool.name}
				secondaryText="Provide Liquidity"
				value={`${numberToFloat(stakedBalance)} LPT`}
				valueInfo="Your Position"
			>
				<Row gutter={16}>
					<Col span={16}>
						{/* TODO: Graph */}
						{/* <YaxisPriceGraph /> */}
						<LiquidityCard pool={pool} />
					</Col>
					<Col span={8}>
						<Row>
							<LiquidityOverviewCard farmID={pool.symbol} />
							<PairStatsCard farmID={pool.symbol} />
						</Row>
					</Col>
				</Row>
			</Page>
		</div>
	)
}

export default Liqudity

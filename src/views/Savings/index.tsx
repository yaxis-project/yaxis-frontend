import React, { useContext } from 'react'
import Page from '../../components/Page/Page'
import YaxisPriceGraph from '../../components/YaxisPriceGraph'
import { Row, Col } from 'antd'
import { LanguageContext } from '../../contexts/Language'
import phrases from './translations'
import StakingCard from './components/StakingCard'
import SavingsOverviewCard from './components/SavingsOverviewCard'
import VaultStatsCard from './components/VaultStatsCard'
import './index.less'
import { YAX } from '../../utils/currencies'
import useYaxisStaking from '../../hooks/useYaxisStaking'
import usePriceMap from '../../hooks/usePriceMap'
import BigNumber from 'bignumber.js'

const Savings: React.FC = () => {
	const { stakedBalance } = useYaxisStaking(YAX)
	const { YAX: YAXPrice } = usePriceMap()

	const totalUSDBalance = new BigNumber(stakedBalance || '0')
		.multipliedBy(YAXPrice || '0')
		.toFixed(2)

	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	return (
		<div className="savings-view">
			<Page
				loading={false}
				mainTitle={phrases['Staking Account'][language]}
				secondaryText={phrases['YAX Staking'][language]}
				value={'$' + totalUSDBalance}
				valueInfo={phrases['Balance'][language]}
			>
				<Row gutter={16}>
					<Col span={16}>
						<YaxisPriceGraph />
						<StakingCard />
					</Col>
					<Col span={8}>
						<Row>
							<SavingsOverviewCard />
						</Row>
						<Row style={{ marginTop: 15 }}>
							<VaultStatsCard />
						</Row>
					</Col>
				</Row>
			</Page>
		</div>
	)
}

export default Savings

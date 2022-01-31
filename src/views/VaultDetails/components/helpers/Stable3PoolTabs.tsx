import React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import useTranslation from '../../../../hooks/useTranslation'
import Card from '../../../../components/Card'
import Tabs from '../../../../components/Tabs'

import Stable3PoolDeposit from './Stable3PoolDeposit'
import Stable3PoolWithdraw from './Stable3PoolWithdraw'
const { TabPane } = Tabs
const StyledCard = styled(Card)`
	border: none;
	.ant-card-body {
		padding: 0;
	}
	.ant-tabs-tabpane {
		padding: 1rem;
	}
`

const Stable3PoolTabs = function () {
	const t = useTranslation()
	const [value3crv, set3crvValue] = React.useState()
	const [active, setActive] = useState('deposit')
	return (
		<StyledCard>
			<Tabs activeKey={active} onTabClick={(key) => setActive(key)}>
				<TabPane tab={t('Deposit')} key="deposit">
					<Stable3PoolDeposit
						set3crvValue={set3crvValue}
						value3crv={value3crv}
					/>
				</TabPane>
				<TabPane tab={t('Withdraw')} key="withdraw">
					<Stable3PoolWithdraw />
				</TabPane>
			</Tabs>
		</StyledCard>
	)
}

export { Stable3PoolTabs }

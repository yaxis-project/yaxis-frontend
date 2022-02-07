import React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import useTranslation from '../../../../hooks/useTranslation'
import Card from '../../../../components/Card'
import Tabs from '../../../../components/Tabs'

import Deposit from './Deposit'
import Withdraw from './Withdraw'
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

type props = {
	vault: string
}

const ConverterTabs = function ({ vault }: props) {
	const t = useTranslation()
	const [value3crv, set3crvValue] = React.useState()
	const [active, setActive] = useState('deposit')
	return (
		<StyledCard>
			<Tabs activeKey={active} onTabClick={(key) => setActive(key)}>
				<TabPane tab={t('Deposit')} key="deposit">
					<Deposit
						set3crvValue={set3crvValue}
						value3crv={value3crv}
						vault={vault}
					/>
				</TabPane>
				<TabPane tab={t('Withdraw')} key="withdraw">
					<Withdraw vault={vault} />
				</TabPane>
			</Tabs>
		</StyledCard>
	)
}

export { ConverterTabs }

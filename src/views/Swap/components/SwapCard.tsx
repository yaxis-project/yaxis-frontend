import { useMemo } from 'react'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import { Affix, Row, Col } from 'antd'
import useYAXStaking from '../../../hooks/useYAXISStaking'
import Button from '../../../components/Button'
import { ArrowRightOutlined } from '@ant-design/icons'

export default function VaultStatsCard() {
	const {
		balances: { stakedBalance, walletBalance },
	} = useYAXStaking()
	const totalYAX = useMemo(() => stakedBalance.plus(walletBalance), [
		stakedBalance,
		walletBalance,
	])
	return (
		<Affix offsetTop={50}>
			<DetailOverviewCard title={'Swap'}>
				<DetailOverviewCardRow>
					<Row justify={'space-around'}>
						<Col span={8}>
							<Row justify="center">{totalYAX.toFixed(2)}</Row>
							<Row justify="center">YAX</Row>
						</Col>
						<Col span={2}>
							<ArrowRightOutlined style={{ fontSize: '30px' }} />
						</Col>
						<Col span={8}>
							<Row justify="center">{totalYAX.toFixed(2)}</Row>
							<Row justify="center">YAXIS</Row>
						</Col>
					</Row>
				</DetailOverviewCardRow>
				<div style={{ margin: '10px' }}>
					<Button disabled={totalYAX.eq(0)}>Swap</Button>
				</div>
			</DetailOverviewCard>
		</Affix>
	)
}

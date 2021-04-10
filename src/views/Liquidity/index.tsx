import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import Page from '../../components/Page/Page'
import { Collapse, Card, Table } from 'antd'
import './index.less'
import useFarms from '../../hooks/useFarms'
const { Panel } = Collapse

const columns = [
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
	},
]

const Liqudity: React.FC = () => {
	const { farms } = useFarms()
	const activePools = useMemo(() => farms.filter((pool) => pool.active), [
		farms,
	])
	const legacyPools = useMemo(() => farms.filter((pool) => pool.legacy), [
		farms,
	])
	const history = useHistory()
	return (
		<div className="liquidity-view">
			<Page>
				<>
					<Card
						title={<strong>Active Liquidity Pools</strong>}
						bodyStyle={{ padding: 0 }}
					>
						<Table
							columns={columns}
							dataSource={activePools}
							pagination={false}
							rowKey={'name'}
							rowClassName="LP-Table-Row"
							onRow={(record, rowIndex) => {
								return {
									onClick: (event) =>
										history.push(
											`/liquidity/${record.lpAddress}`,
										),
								}
							}}
						/>
					</Card>

					<Collapse
						defaultActiveKey={['1']}
						expandIconPosition="right"
					>
						<Panel header={'Legacy Liquidity Pools'} key="1">
							<Table
								columns={columns}
								dataSource={legacyPools}
								pagination={false}
								rowKey={'name'}
								rowClassName="LP-Table-Row"
								onRow={(record, rowIndex) => {
									return {
										onClick: (event) =>
											history.push(
												`/liquidity/${record.lpAddress}`,
											),
									}
								}}
							/>
						</Panel>
					</Collapse>
				</>
			</Page>
		</div>
	)
}

export default Liqudity

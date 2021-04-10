import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import Page from '../../components/Page/Page'
import Tooltip from '../../components/Tooltip'
import { Collapse, Card, Table, Row, Col } from 'antd'
import info from '../../assets/img/info.svg'
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
						title={
							<Col style={{ fontSize: '18px', fontWeight: 700 }}>
								Active Liquidity Pools
							</Col>
						}
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

					<Collapse expandIconPosition="right">
						<Panel
							header={
								<Row gutter={10}>
									<Col>Legacy Liquidity Pools</Col>
									<Col>
										<Tooltip
											title={
												'LPs that are no longer supported'
											}
											placement={'right'}
										>
											<img
												src={info}
												height="20"
												alt="Legacy Liquidity Pools info"
											/>
										</Tooltip>
									</Col>
								</Row>
							}
							key="1"
						>
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

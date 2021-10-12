import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Page from '../../components/Page/Page'
import Tooltip from '../../components/Tooltip'
import Table from '../../components/Table'
import { Row, Col } from 'antd'
import Card from '../../components/Card'
import Typography from '../../components/Typography'
import Collapse from '../../components/Collapse'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useContracts } from '../../contexts/Contracts'
import useTranslation from '../../hooks/useTranslation'

const { Panel } = Collapse
const { Text } = Typography
const columns = [
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
	},
]

const Liquidity: React.FC = () => {
	const translate = useTranslation()

	const { contracts } = useContracts()
	const activePools = useMemo(
		() =>
			Object.values(contracts?.pools || {}).filter((pool) => pool.active),
		[contracts],
	)
	const legacyPools = useMemo(
		() =>
			Object.values(contracts?.pools || {}).filter((pool) => pool.legacy),
		[contracts],
	)
	const history = useHistory()
	return (
		<div className="liquidity-view">
			<Page>
				<>
					{/* <Card
						title={
							<Col
								style={{
									fontSize: '18px',
									fontWeight: 700,
								}}
							>
								<Text>
									{translate('What is a Liquidity Pool?')}
								</Text>
							</Col>
						}
						bodyStyle={{ padding: 0 }}
					>
					</Card> */}

					<Card
						title={
							<Col style={{ fontSize: '18px', fontWeight: 700 }}>
								<Text>
									{translate('Active Liquidity Pools')}
								</Text>
							</Col>
						}
						bodyStyle={{ padding: 0 }}
					>
						<StyledTable
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
						<StyledPanel
							header={
								<Row gutter={10}>
									<Col>
										<Text>
											{translate(
												'Legacy Liquidity Pools',
											)}
										</Text>
									</Col>
									<Col>
										<Tooltip
											title={translate(
												'LPs that are no longer supported',
											)}
											placement={'right'}
										>
											<StyledInfoIcon
												alt={translate(
													'Legacy Liquidity Pools info',
												)}
											/>
										</Tooltip>
									</Col>
								</Row>
							}
							key="1"
						>
							<StyledTable
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
						</StyledPanel>
					</Collapse>
				</>
			</Page>
		</div>
	)
}

export default Liquidity

const StyledInfoIcon = styled(InfoCircleOutlined)`
	margin-left: 5px;
	color: ${(props) => props.theme.secondary.font};
	font-size: 15px;
`

const StyledTable = styled(Table)`
	tbody > tr:last-child td:last-child {
		border-bottom: none;
	}

	.LP-Table-Row {
		&:hover {
			cursor: pointer;
			background: ${(props) => props.theme.secondary.backgroundHover};
		}
	}
`

const StyledPanel = styled(Panel)`
	background: ${(props) => props.theme.secondary.background};
	border-color: ${(props) => props.theme.secondary.border};

	.ant-collapse {
		border: none;
	}
`

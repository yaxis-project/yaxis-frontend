import React, { useMemo, useState } from 'react'
import { Slider, Row } from 'antd'
import Table from '../../../components/Table'
import Button from '../../../components/Button'
import Typography from '../../../components/Typography'
import { Vaults } from '../../../constants/type'
import useContractWrite from '../../../hooks/useContractWrite'
import { useContracts } from '../../../contexts/Contracts'
import useTranslation from '../../../hooks/useTranslation'

const { Text } = Typography

const initialWeights = Vaults.map((v) => 0)

const GaugeWeight: React.FC = () => {
	const translate = useTranslation()

	const [weights, setWeights] = useState(initialWeights)

	const { contracts } = useContracts()

	const { call, loading } = useContractWrite({
		contractName: 'internal.gaugeController',
		method: 'vote_for_gauge_weights',
		description: `vote for gauge weights`,
	})

	const data = useMemo(() => {
		return Vaults.map((name, i) => {
			return {
				key: i,
				name: name.slice(0, 1).toUpperCase() + name.slice(1),
				vaultWeight: weights[i],
			}
		})
	}, [weights])

	const columns = useMemo(
		() => [
			{
				title: translate('Name'),
				dataIndex: 'name',
				key: 'name',
				render: (text, record) => <Text>{text}</Text>,
			},
			{
				title: translate('Weight'),
				key: 'action',

				render: (text, record) => (
					<div style={{ width: '300px' }}>
						<Slider
							defaultValue={record.vaultWeight}
							onChange={(value) => {
								const nextWeights = [...weights]
								nextWeights.splice(record.key, 1, value)
								setWeights(nextWeights)
							}}
						/>
					</div>
				),
			},
		],
		[translate, weights],
	)

	return (
		<>
			<Row justify="center">
				<Table columns={columns} dataSource={data} pagination={false} />
			</Row>
			<Row style={{ padding: '2% 30% 0 30%' }}>
				<Button
					loading={loading}
					onClick={() =>
						weights.forEach((weight, i) => {
							if (weight > 0)
								call({
									args: [
										contracts.vaults[Vaults[i]].gauge
											.address,
										weight * 100,
									],
								})
						})
					}
				>
					{translate('Vote')}
				</Button>
			</Row>
		</>
	)
}

export { GaugeWeight }

import React, { useMemo, useState } from 'react'
import { Slider, Row, Tooltip } from 'antd'
import Table from '../../../components/Table'
import Button from '../../../components/Button'
import Typography from '../../../components/Typography'
import { Vaults } from '../../../constants/type'
import useContractWrite from '../../../hooks/useContractWrite'
import { useContracts } from '../../../contexts/Contracts'
import useTranslation from '../../../hooks/useTranslation'
import { useLock } from '../../../state/wallet/hooks'
import moment from 'moment'

const { Text } = Typography

const initialWeights = Vaults.map(() => 0)

const GaugeWeight: React.FC = () => {
	const translate = useTranslation()

	const [weights, setWeights] = useState(initialWeights)

	const { contracts } = useContracts()

	const lock = useLock()

	const { call, loading } = useContractWrite({
		contractName: 'internal.gaugeController',
		method: 'vote_for_gauge_weights',
		description: `vote for gauge weights`,
	})

	const data = useMemo(() => {
		return Vaults.map((name, i) => {
			return {
				key: i,
				name: name.toUpperCase(),
				vaultWeight: weights[i],
			}
		})
	}, [weights])

	const disabled = useMemo(
		() =>
			moment(lock.end.toNumber() * 1000).isBefore(
				moment().add(7, 'days'),
			) || lock.loading,
		[lock.end, lock.loading],
	)

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
							disabled={disabled}
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
		[translate, weights, disabled],
	)

	return (
		<>
			<Row justify="center">
				<Table columns={columns} dataSource={data} pagination={false} />
			</Row>

			<Row style={{ padding: '2% 30% 0 30%' }}>
				<Tooltip
					visible={
						!lock.loading &&
						moment(lock.end.toNumber() * 1000).isBefore(
							moment().add(7, 'days'),
						)
					}
					placement="top"
					title={translate(
						'Must be locked for more than 7 days to vote!',
					)}
					zIndex={1}
				>
					<Button
						loading={loading}
						disabled={disabled}
						onClick={() => {
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
						}}
					>
						{translate('Vote')}
					</Button>
				</Tooltip>
			</Row>
		</>
	)
}

export { GaugeWeight }

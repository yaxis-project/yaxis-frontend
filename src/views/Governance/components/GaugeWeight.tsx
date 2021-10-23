import React, { useEffect, useMemo, useState } from 'react'
import { Slider, Row, Tooltip } from 'antd'
import Table from '../../../components/Table'
import Button from '../../../components/Button'
import Typography from '../../../components/Typography'
import { Vaults } from '../../../constants/type'
import useContractWrite from '../../../hooks/useContractWrite'
import { useContracts } from '../../../contexts/Contracts'
import useTranslation from '../../../hooks/useTranslation'
import { useLock, useUserGaugeWeights } from '../../../state/wallet/hooks'
import moment from 'moment'

const WEIGHT_VOTE_DELAY = 10 * 86400

const { Text } = Typography

const initialWeights = Vaults.map(() => 0)

const GaugeWeight: React.FC = () => {
	const translate = useTranslation()

	const [weights, setWeights] = useState(initialWeights)
	const [hasInitialWeights, setHasInitialWeight] = useState(false)
	const { contracts } = useContracts()

	const lock = useLock()

	const [loadingVotedWeights, votedWeights] = useUserGaugeWeights()

	const { call, loading } = useContractWrite({
		contractName: 'internal.gaugeController',
		method: 'vote_for_gauge_weights',
		description: `vote for gauge weights`,
	})

	useEffect(() => {
		if (!loadingVotedWeights && !hasInitialWeights) {
			setHasInitialWeight(true)
			setWeights(
				Vaults.map((vault) =>
					votedWeights[vault].power.div(100).toNumber(),
				),
			)
		}
	}, [
		loadingVotedWeights,
		votedWeights,
		hasInitialWeights,
		setWeights,
		setHasInitialWeight,
	])

	const data = useMemo(() => {
		return Vaults.map((name, i) => {
			return {
				key: i,
				name: name.toUpperCase(),
				vaultWeight: weights[i],
				...votedWeights[name],
			}
		})
	}, [weights, votedWeights])

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
				render: (text) => <Text>{text}</Text>,
			},
			{
				title: translate('Weight'),
				key: 'action',
				render: (record) => (
					<div style={{ width: '300px' }}>
						<Slider
							value={weights[record.key]}
							tipFormatter={(value) => `${value}%`}
							disabled={
								disabled ||
								moment().isBefore(
									moment(record.end.toNumber() * 1000).add(
										WEIGHT_VOTE_DELAY * 1000,
									),
								)
							}
							onChange={(value) => {
								const nextWeights = [...weights]
								nextWeights.splice(record.key, 1, value)
								const total = nextWeights.reduce(
									(acc, curr) => acc + curr,
									0,
								)
								if (total <= 100) setWeights(nextWeights)
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
			{/* TODO: What is this? */}
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

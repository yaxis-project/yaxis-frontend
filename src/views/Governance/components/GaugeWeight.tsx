import React, { useEffect, useMemo, useState } from 'react'
import { Row, Tooltip } from 'antd'
import Table from '../../../components/Table'
import Button from '../../../components/Button'
import Slider from '../../../components/Slider'
import Typography from '../../../components/Typography'
import { Vaults } from '../../../constants/type'
import useContractWrite from '../../../hooks/useContractWrite'
import { useContracts } from '../../../contexts/Contracts'
import useTranslation from '../../../hooks/useTranslation'
import { useLock, useUserGaugeWeights } from '../../../state/wallet/hooks'
import moment from 'moment'
import { Currencies } from '../../../constants/currencies'

const WEIGHT_VOTE_DELAY = 10 * 86400

const { Text } = Typography

const initialWeights = Vaults.map(() => 0)

const GaugeWeight: React.FC = () => {
	const translate = useTranslation()

	const [weights, setWeights] = useState(initialWeights)
	const totalWeight = useMemo(
		() => weights.reduce((acc, curr) => acc + curr, 0),
		[weights],
	)
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
				title: translate('Vault').toUpperCase(),
				key: 'vault',
				width: '20%',
				render: (record) => (
					<Row align={'middle'}>
						<img
							src={Currencies[record.name].icon}
							height="36"
							width="36"
							alt="logo"
							style={{ marginRight: '10px' }}
						/>
						<Text>{record.name}</Text>
					</Row>
				),
			},
			{
				title: translate('Weight').toUpperCase(),
				key: 'action',
				width: '80%',
				render: (record) => {
					const cooldown = moment(record.end.toNumber() * 1000).add(
						WEIGHT_VOTE_DELAY * 1000,
					)
					return (
						<div style={{ position: 'relative' }}>
							{record.end.gt(0) && (
								<div
									style={{
										position: 'absolute',
										top: -20,
										left: 30,
									}}
								>
									Unlocks in {cooldown.fromNow()}
								</div>
							)}
							<Slider
								value={weights[record.key]}
								tipFormatter={(value) => `${value}%`}
								disabled={
									disabled || moment().isBefore(cooldown)
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
					)
				},
			},
		],
		[translate, weights, disabled],
	)

	return (
		<>
			<Row style={{ marginTop: '10px' }}>{/* TODO: What is this? */}</Row>
			<Row justify={'center'} style={{ margin: '10px 0' }}>
				<Text>
					Voting power left to distribute: {100 - totalWeight}%.
				</Text>
			</Row>

			<Table columns={columns} dataSource={data} pagination={false} />

			<Row style={{ padding: '5%' }}>
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
						style={{ width: '100%' }}
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

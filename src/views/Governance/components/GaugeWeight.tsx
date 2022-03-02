import React, { useEffect, useMemo, useState } from 'react'
import { Row, Tooltip } from 'antd'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import Table from '../../../components/Table'
import Button from '../../../components/Button'
import Slider from '../../../components/Slider'
import Typography from '../../../components/Typography'
import useContractWrite from '../../../hooks/useContractWrite'
import { useContracts } from '../../../contexts/Contracts'
import useTranslation from '../../../hooks/useTranslation'
import {
	useLock,
	useUserGaugeWeights,
	useBoosts,
} from '../../../state/wallet/hooks'
import { useRewardRate } from '../../../state/internal/hooks'
import moment from 'moment'
import { Currencies } from '../../../constants/currencies'
import BigNumber from 'bignumber.js'
import { useChainInfo } from '../../../state/user'

const WEIGHT_VOTE_DELAY = 10 * 86400

const { Text } = Typography

const GaugeWeight: React.FC<{ vaults: readonly string[] }> = ({ vaults }) => {
	const translate = useTranslation()
	const lock = useLock()
	const rate = useRewardRate()
	const boost = useBoosts()

	const [weights, setWeights] = useState(vaults.map(() => 0))
	const totalWeight = useMemo(
		() => weights.reduce((acc, curr) => acc + curr, 0),
		[weights],
	)
	const [initialWeights, setInitialWeights] = useState(-1)
	const { contracts } = useContracts()
	const chainInfo = useChainInfo()

	const [loadingVotedWeights, votedWeights] = useUserGaugeWeights(
		chainInfo.blockchain,
	)

	const { call, loading } = useContractWrite({
		contractName: 'internal.gaugeController',
		method: 'vote_for_gauge_weights',
		description: `vote for gauge weights`,
	})

	useEffect(() => {
		if (!loadingVotedWeights && initialWeights === -1) {
			const nextWeights = vaults.reduce((acc, vault) => {
				acc.push(votedWeights[vault]?.power.div(100).toNumber())
				return acc
			}, [])
			setInitialWeights(nextWeights.reduce((acc, curr) => acc + curr, 0))
			setWeights(nextWeights)
		}
	}, [
		loadingVotedWeights,
		votedWeights,
		initialWeights,
		setWeights,
		setInitialWeights,
	])

	const data = useMemo(() => {
		return vaults.reduce((acc, name, i) => {
			const userShare = boost[name].workingSupply.isZero()
				? new BigNumber(0)
				: boost[name].workingBalance.dividedBy(
						boost[name].workingSupply,
				  )

			// YAXIS vault has been deprecated.
			// Filter it out if the user has redistributed out.
			if (name === 'yaxis' && votedWeights[name]?.power.toNumber() === 0)
				return acc

			acc.push({
				key: i,
				name: name.toUpperCase(),
				vaultWeight: weights[i],
				userShare,
				...votedWeights[name],
			})
			return acc
		}, [])
	}, [weights, votedWeights, boost])

	const disabled = useMemo(
		() =>
			moment(lock.end.toNumber() * 1000).isBefore(
				moment().add(7, 'days'),
			) || lock.loading,
		[lock.end, lock.loading],
	)

	const hasChange = useMemo(() => {
		if (loadingVotedWeights || initialWeights === -1) return false

		const nextWeights = vaults.reduce((acc, vault) => {
			acc.push(votedWeights[vault]?.power.div(100).toNumber())
			return acc
		}, [])
		return JSON.stringify(nextWeights) !== JSON.stringify(weights)
	}, [loadingVotedWeights, initialWeights, votedWeights, weights])

	const columns = useMemo(
		() => [
			{
				title: translate('Vault').toUpperCase(),
				key: 'vault',
				width: '20%',
				render: (record) => (
					<NavLink to={`/vault/${record.name}`}>
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
					</NavLink>
				),
			},
			{
				title: translate('Weight').toUpperCase(),
				key: 'action',
				width: '60%',
				render: (record) => {
					const lastVote = record.lastVote?.toNumber() ?? 0
					const cooldown = moment(lastVote * 1000).add(
						WEIGHT_VOTE_DELAY * 1000,
					)
					return (
						<div style={{ position: 'relative' }}>
							{record.name === 'YAXIS' && (
								<div>
									*YAXIS vault deprecated in{' '}
									<TextLink
										rel="noopener noreferrer"
										target="_blank"
										href="https://discord.com/channels/754774398304649308/916162568509333554/919013222550482976"
									>
										YIP-14
									</TextLink>
									.
								</div>
							)}

							{record.name === 'YAXIS' && (
								<div>
									Set the slider to 0 and redistribute
									elsewhere.
								</div>
							)}
							{cooldown.isAfter(Date.now()) && (
								<div
									style={{
										position: 'absolute',
										top: -20,
										left: 30,
									}}
								>
									Unlocks {cooldown.fromNow()}
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
			{
				title: 'Total emissions per day',
				key: 'rate',
				width: '20%',
				render: (record) => (
					<Text>
						{rate
							.multipliedBy(60 * 60 * 24)
							.multipliedBy(weights[record.key])
							.dividedBy(100)
							.toFormat(3)}
					</Text>
				),
			},
			{
				title: 'Your rewards per day',
				key: 'rate',
				width: '20%',
				render: (record) => (
					<Text>
						{rate
							.multipliedBy(60 * 60 * 24)
							.multipliedBy(weights[record.key])
							.dividedBy(100)
							.multipliedBy(record.userShare)
							.toFormat(3)}
					</Text>
				),
			},
		],
		[translate, weights, disabled, rate],
	)

	return (
		<>
			<Row style={{ marginTop: '10px' }} justify="center">
				<Text style={{ fontSize: '18px', padding: '10px' }}>
					There is a total of{' '}
					{rate.multipliedBy(60 * 60 * 24).toFormat(3)} YAXIS reward
					emissions every day.
				</Text>
				<Text style={{ fontSize: '18px', padding: '0 10px 10px 10px' }}>
					Vote to determine which Vaults it gets distributed to.
				</Text>
			</Row>

			<Table columns={columns} dataSource={data} pagination={false} />

			{!lock.loading &&
				moment(lock.end.toNumber() * 1000).isAfter(
					moment().add(7, 'days'),
				) && (
					<Row justify={'center'} style={{ marginTop: '20px' }}>
						<Text style={{ fontSize: '16px' }}>
							{100 - totalWeight}% of your voting power available.
						</Text>
					</Row>
				)}

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
						disabled={disabled || !hasChange}
						onClick={() => {
							weights.forEach((weight, i) => {
								const hasChange =
									weight * 100 !==
									votedWeights[vaults[i]].power.toNumber()
								if (hasChange)
									call({
										args: [
											contracts.vaults[vaults[i]].gauge
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

const TextLink = styled.a`
	color: ${(props) => props.theme.primary.main};
	font-weight: 600;
`

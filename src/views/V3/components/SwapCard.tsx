import { useEffect, useState, useMemo, useCallback } from 'react'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { Col, Row, Steps, Result } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import StepExit from './StepExit'
import StepReenter from './StepReenter'
import StepUnstake from './StepUnstake'
import StepBoost from './StepBoost'
import {
	useRewardsBalances,
	useAllTokenBalances,
} from '../../../state/wallet/hooks'
import BigNumber from 'bignumber.js'
const { Step } = Steps

export default function SwapCard() {
	const { account } = useWeb3Provider()
	const [current, setCurrent] = useState(3)
	const [initialized, setInitialized] = useState(false)
	const [toDo, setToDo] = useState([false, false, false, false])

	const [balances, loading] = useAllTokenBalances()
	const { walletBalance: walletMVLT, stakedBalance: stakedMVLT } =
		useRewardsBalances('mvlt', 'MetaVault')
	const { stakedBalance: stakedYAXIS } = useRewardsBalances('yaxis', 'Yaxis')

	const step1 = useMemo(
		() => stakedMVLT?.gt(0) || walletMVLT?.gt(0),
		[stakedMVLT, walletMVLT],
	)

	const step2 = useMemo(
		() =>
			balances?.dai?.amount.gt(0) ||
			balances?.usdc?.amount.gt(0) ||
			balances?.usdt?.amount.gt(0),
		[balances],
	)

	const step3 = useMemo(() => stakedYAXIS.gt(0), [stakedYAXIS])

	const step4 = useMemo(() => balances?.yaxis?.amount.gt(0), [balances])

	useEffect(() => {
		if (!loading) {
			setToDo([step1, step2, step3, step4])
			if (!initialized) {
				setInitialized(true)
				if (step1) setCurrent(0)
				if (step2) setCurrent(1)
				if (step3) setCurrent(2)
			}
		}
	}, [initialized, loading, step1, step2, step3, step4])

	const ExitContent = useMemo(
		() => (
			<StepExit
				step={0}
				current={current}
				setCurrent={setCurrent}
				complete={toDo[0]}
				stakedMVLT={stakedMVLT}
				walletMVLT={walletMVLT}
			/>
		),
		[current, toDo, stakedMVLT, walletMVLT],
	)

	const ReenterContent = useMemo(
		() => (
			<StepReenter
				step={1}
				current={current}
				setCurrent={setCurrent}
				complete={toDo[1]}
				usdcBalance={balances?.usdc?.amount || new BigNumber(0)}
				usdtBalance={balances?.usdt?.amount || new BigNumber(0)}
				daiBalance={balances?.dai?.amount || new BigNumber(0)}
			/>
		),
		[current, toDo, balances?.usdc, balances?.dai, balances?.usdt],
	)

	const UnstakeContent = useMemo(
		() => (
			<StepUnstake
				step={2}
				current={current}
				setCurrent={setCurrent}
				complete={toDo[2]}
				stakedYAXIS={stakedYAXIS}
			/>
		),
		[current, toDo, stakedYAXIS],
	)

	const BoostContent = useMemo(
		() => (
			<StepBoost
				step={3}
				current={current}
				setCurrent={setCurrent}
				complete={toDo[3]}
				yaxisBalance={balances?.yaxis?.amount || new BigNumber(0)}
			/>
		),
		[current, toDo, balances?.yaxis],
	)

	const getStatus = useCallback((account, todo, current, index) => {
		if (!account) return 'wait'
		if (!todo) return 'finish'
		if (current === index) return 'process'
		return 'wait'
	}, [])

	const steps = useMemo(
		() => [
			{
				title: 'Exit MetaVault',
				content: ExitContent,
				status: getStatus(account, toDo[0], current, 0),
			},
			{
				title: 'Re-enter Vaults',
				content: ReenterContent,
				status: getStatus(account, toDo[2], current, 1),
			},
			{
				title: 'Unstake YAXIS',
				content: UnstakeContent,
				status: getStatus(account, toDo[2], current, 2),
			},
			{
				title: 'Boost your rewards',
				content: BoostContent,
				status: getStatus(account, toDo[2], current, 3),
			},
		],
		[
			ExitContent,
			ReenterContent,
			UnstakeContent,
			BoostContent,
			toDo,
			current,
			account,
			getStatus,
		],
	)

	const content = useMemo(() => {
		if (!account)
			return (
				<Result
					status="warning"
					title="Connect a wallet to see if actions are needed."
				/>
			)
		if (!initialized)
			return (
				<Row
					justify="center"
					align="middle"
					style={{ minHeight: '200px' }}
				>
					<LoadingOutlined style={{ fontSize: 54 }} spin />
				</Row>
			)
		if (steps[current]) return steps[current].content
		return <Result status="success" title="All up to date!" />
	}, [account, current, initialized, steps])

	return (
		<DetailOverviewCard title={'Version 3'}>
			<Row style={{ padding: '20px' }} justify="center">
				<Col>
					<Steps
						current={current}
						onChange={(current) => setCurrent(current)}
					>
						{steps.map((item) => (
							<Step
								key={item.title}
								title={item.title}
								status={
									item.status as
										| 'error'
										| 'process'
										| 'finish'
										| 'wait'
								}
								disabled={!account}
							/>
						))}
					</Steps>
				</Col>
			</Row>
			<div className="steps-content">{content}</div>
		</DetailOverviewCard>
	)
}

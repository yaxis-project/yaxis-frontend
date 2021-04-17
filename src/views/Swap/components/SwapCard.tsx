import { useEffect, useState, useMemo, useCallback } from 'react'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { Affix, Row, Steps, Result } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import useSwapData from '../../../hooks/useSwapData'
import BigNumber from 'bignumber.js'
import StepClaim from './StepClaim'
import StepSwap from './StepSwap'
import StepStake from './StepStake'
const { Step } = Steps

export default function SwapCard() {
	const { account, chainId } = useWeb3Provider()
	const [current, setCurrent] = useState(3)
	const [initialized, setInitialized] = useState(false)
	const [toDo, setToDo] = useState([false, false, false])
	const { data, loading: loadingData } = useSwapData()

	const ClaimContent = useMemo(
		() => (
			<StepClaim
				step={0}
				current={current}
				setCurrent={setCurrent}
				earnings={data?.earnings}
				pendingYax={new BigNumber(data?.mvEarnings || 0)}
				stakedUniLP={data?.stakedUniLP}
				uniLPBalance={data?.uniLPBalance}
				linkLPBalance={data?.linkLPBalance}
			/>
		),
		[data, current],
	)

	const SwapContent = useMemo(
		() => (
			<StepSwap
				step={0}
				current={current}
				setCurrent={setCurrent}
				balances={data?.balances}
			/>
		),
		[data, current],
	)

	const StakeContent = useMemo(
		() => (
			<StepStake
				step={0}
				current={current}
				setCurrent={setCurrent}
				yaxisBalance={data?.yaxisBalance}
				mvltBalance={data?.mvltBalance}
				stakedMvlt={data?.stakedMvlt}
			/>
		),
		[data, current],
	)

	const getStatus = useCallback((account, todo, current, index) => {
		if (!account) return 'wait'
		if (!todo) return 'finish'
		if (current === index) return 'process'
		console.log(current, index)
		return 'wait'
	}, [])

	const steps = useMemo(
		() => [
			{
				title: 'Claim',
				content: ClaimContent,
				status: getStatus(account, toDo[0], current, 0),
			},
			{
				title: 'Swap',
				content: SwapContent,
				status: getStatus(account, toDo[1], current, 1),
			},
			{
				title: 'Stake',
				content: StakeContent,
				status: getStatus(account, toDo[2], current, 2),
			},
		],
		[
			ClaimContent,
			SwapContent,
			StakeContent,
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

	useEffect(() => {
		const determineStep = () => {
			const {
				earnings,
				mvEarnings,
				balances,
				yaxisBalance,
				stakedUniLP,
				uniLPBalance,
				linkLPBalance,
				mvltBalance,
				stakedMvlt,
			} = data

			const step1 =
				earnings.gt(0) ||
				new BigNumber(mvEarnings).gt(0) ||
				stakedUniLP.gt(0) ||
				uniLPBalance.gt(0) ||
				linkLPBalance.gt(0)

			const step2 =
				balances?.stakedBalance.gt(0) || balances?.yaxBalance.gt(0)

			const step3 =
				yaxisBalance.gt(0) || mvltBalance.gt(0) || stakedMvlt.gt(0)

			setToDo([step1, step2, step3])

			if (step1) setCurrent(0)
			else if (step2) setCurrent(1)
			else if (step3) setCurrent(2)
			else setCurrent(3)
			setInitialized(true)
		}

		if (!loadingData) {
			determineStep()
		}
	}, [initialized, chainId, loadingData, data])

	return (
		<Affix offsetTop={80}>
			<DetailOverviewCard title={'Steps'}>
				<Row style={{ padding: '20px' }}>
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
				</Row>
				<div className="steps-content">{content}</div>
			</DetailOverviewCard>
		</Affix>
	)
}

import { useEffect, useState, useMemo } from 'react'
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
	const { chainId } = useWeb3Provider()
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
				stakedUniLP={data?.stakedUniLP}
				uniLPBalance={data?.uniLPBalance}
				linkLPBalance={data?.linkLPBalance}
				mvltBalance={data?.mvltBalance}
				stakedMvlt={data?.stakedMvlt}
			/>
		),
		[data, current],
	)

	const steps = useMemo(
		() => [
			{
				title: 'Claim',
				content: ClaimContent,
				status: toDo[1]
					? current === 0
						? 'process'
						: 'wait'
					: 'finish',
			},
			{
				title: 'Swap',
				content: SwapContent,
				status: toDo[1]
					? current === 1
						? 'process'
						: 'wait'
					: 'finish',
			},
			{
				title: 'Stake',
				content: StakeContent,
				status: toDo[2]
					? current === 2
						? 'process'
						: 'wait'
					: 'finish',
			},
		],
		[ClaimContent, SwapContent, StakeContent, toDo, current],
	)

	const content = useMemo(() => {
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
	}, [current, initialized, steps])

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

			const step1 = earnings.gt(0) || new BigNumber(mvEarnings).gt(0)

			const step2 =
				balances?.stakedBalance.gt(0) || balances?.yaxBalance.gt(0)

			const step3 =
				yaxisBalance.gt(0) ||
				stakedUniLP.gt(0) ||
				uniLPBalance.gt(0) ||
				linkLPBalance.gt(0) ||
				mvltBalance.gt(0) ||
				stakedMvlt.gt(0)

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
							/>
						))}
					</Steps>
				</Row>
				<div className="steps-content">{content}</div>
			</DetailOverviewCard>
		</Affix>
	)
}

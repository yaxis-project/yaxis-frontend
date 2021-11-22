import { useEffect, useState, useMemo, useCallback } from 'react'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { Affix, Row } from 'antd'
import Steps from '../../../components/Steps'
import Result from '../../../components/Result'
import { LoadingOutlined } from '@ant-design/icons'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import useSwapData from '../../../hooks/useSwapData'
import BigNumber from 'bignumber.js'
import StepClaim from './StepClaim'
import StepSwap from './StepSwap'
import StepStake from './StepStake'
const { Step } = Steps

export default function SwapCard() {
	const { account } = useWeb3Provider()
	const [current, setCurrent] = useState(3)
	const [initialized, setInitialized] = useState(false)
	const [toDo, setToDo] = useState([false, false, false])
	const {
		loading,
		earnings,
		mvEarnings,
		balances,
		yaxisBalance,
		stakedUniLP,
		uniLPBalance,
		linkLPBalance,
		mvltBalance,
		stakedMvlt,
	} = useSwapData()

	const step1 = useMemo(
		() =>
			earnings.gt(0) ||
			new BigNumber(mvEarnings).gt(0) ||
			stakedUniLP.gt(0) ||
			uniLPBalance.gt(0) ||
			linkLPBalance.gt(0) ||
			stakedMvlt.gt(0),
		[
			earnings,
			linkLPBalance,
			mvEarnings,
			stakedMvlt,
			stakedUniLP,
			uniLPBalance,
		],
	)

	const step2 = useMemo(
		() => balances?.stakedBalance.gt(0) || balances?.yaxBalance.gt(0),
		[balances],
	)

	const step3 = useMemo(
		() => yaxisBalance.gt(0) || mvltBalance.gt(0),
		[yaxisBalance, mvltBalance],
	)

	useEffect(() => {
		if (!loading) {
			setToDo([step1, step2, step3])
			if (!initialized) {
				setInitialized(true)
				if (step1) setCurrent(0)
				if (step2) setCurrent(1)
				if (step3) setCurrent(2)
			}
		}
	}, [initialized, loading, step1, step2, step3])

	const ClaimContent = useMemo(
		() => (
			<StepClaim
				step={0}
				current={current}
				setCurrent={setCurrent}
				complete={toDo[0]}
				earnings={earnings}
				pendingYax={new BigNumber(mvEarnings || 0)}
				stakedUniLP={stakedUniLP}
				uniLPBalance={uniLPBalance}
				linkLPBalance={linkLPBalance}
				stakedMvlt={stakedMvlt}
			/>
		),
		[
			earnings,
			mvEarnings,
			stakedUniLP,
			uniLPBalance,
			linkLPBalance,
			stakedMvlt,
			current,
			toDo,
		],
	)

	const SwapContent = useMemo(
		() => (
			<StepSwap
				step={1}
				current={current}
				setCurrent={setCurrent}
				complete={toDo[1]}
				balances={balances}
			/>
		),
		[balances, current, toDo],
	)

	const StakeContent = useMemo(
		() => (
			<StepStake
				step={2}
				current={current}
				setCurrent={setCurrent}
				complete={toDo[2]}
				yaxisBalance={yaxisBalance}
				mvltBalance={mvltBalance}
			/>
		),
		[yaxisBalance, mvltBalance, current, toDo],
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

import React, { useState, useContext, useEffect } from 'react'
import useLPContractData from '../../../hooks/useLPContractData'

import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'

import { Row, Col, Typography, Card, Button } from 'antd'
// import useStake from '../../../hooks/useStake'
// import useUnstake from '../../../hooks/useUnstake'
import BigNumber from 'bignumber.js'
// import useAllowance from '../../../hooks/useAllowance'
// import useApprove from '../../../hooks/useApprove'
// import useTokenBalance from '../../../hooks/useTokenBalance'
// import { getFullDisplayBalance } from '../../../utils/formatBalance'
import useMyLiquidity from '../../../hooks/useMyLiquidity'
import useFarms from '../../../hooks/useFarms'
import { StakePool } from '../../../yaxis/type'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import * as currencies from '../../../utils/currencies'

const { Text } = Typography

const TableHeader = (props: any) => (
	<Col span={props.span}>
		<Text type="secondary">{props.value}</Text>
	</Col>
)

interface LiquidityRowProps {
	icon: string
	name: string
	balance: string
	symbol: string
	//gutter: number;
}

/**
 * Generate a styled liquidity row.
 * @param props LiquidityRowProps
 */
const LiquidityRow = (props: LiquidityRowProps) => {
	const { icon, name, balance, symbol } = props
	return (
		<Row className="liquidity-row">
			<Col span={9}>
				<img src={icon} height="36" alt="logo" />
				<Text>{name}</Text>
			</Col>
			<Col span={15}>
				<Row>
					<Col style={{ marginRight: "10px" }}>
						<Text>
							{balance}
						</Text>
					</Col>
					<Col>

						<Text>
							{symbol}
						</Text>
					</Col>
				</Row>
			</Col>
		</Row>
	)
}

/**
 * Controls and views for user interactions with metavault liquidity pools.
 */

type Props = {
	pool: StakePool
}

const LiquidityCard: React.FC<Props> = ({ pool }) => {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	// const gutter = 10

	const {
		farmData: { pid, lpUrl },
		stakedBalance,
		// lpContract,
	} = useLPContractData(pool.symbol)
	// const tokenBalance = useTokenBalance(lpContract?.options?.address)
	// const { onStake } = useStake(pid)
	// const { onUnstake } = useUnstake(pid)
	// const allowance = useAllowance(lpContract)
	// const { onApprove } = useApprove(lpContract)
	const { userPoolShare } = useMyLiquidity(pool.symbol)
	const { stakedValues } = useFarms()
	const defaultUserBalances = {}
	pool.lpTokens.forEach(token => defaultUserBalances[token.symbol] = 0)
	const [userBalances, setUserBalances] = useState(defaultUserBalances)
	useEffect(() => {
		const stakedValue = stakedValues.find((farm) => farm.pid === pid)
		// TODO: currently only handles 'uni' type
		if (stakedValue) {
			const nextState = {}
			pool.lpTokens.forEach(
				(token, i) =>
					nextState[token.symbol] = new BigNumber(stakedValue?.reserve[i])
						.times(userPoolShare)
						.toFixed(2))
			setUserBalances(nextState)
		}
	}, [stakedValues, pid, userPoolShare, pool])

	const hasBalance = Object.values(userBalances).some(val => Number(val)) || Number(stakedBalance.toFixed(2))

	// const onDeposit = async () => {
	// 	await onStake(getFullDisplayBalance(tokenBalance))
	// }

	// const onWithdraw = async () => {
	// 	await onUnstake(getFullDisplayBalance(stakedBalance))
	// }

	// const approve = async () => {
	// 	await onApprove()
	// }

	return (
		<Card
			className="liquidity-card"
			title={<strong>Your Liquidity</strong>}
		>
			<Row className="title-row">
				<TableHeader value={phrases['Asset'][language]} span={9} />
				<TableHeader value={phrases['Balance'][language]} span={15} />
			</Row>

			<LiquidityRow
				// TODO: Make a dynamic currency icon component with fallback
				icon={currencies.currencyMap[pool.symbol]?.icon || currencies.UNI_ETH_YAX_LP.icon}
				name={'Pool Tokens'}
				balance={stakedBalance.toFixed(2)}
				symbol={pool.symbol}
			/>
			{pool.lpTokens.map(({ symbol }, i) =>
				<LiquidityRow
					key={`LiqudityRow-${symbol}-${i}`}
					icon={currencies[symbol]?.icon}
					name={symbol}
					balance={userBalances[symbol]}
					symbol={symbol}
				/>
			)}

			<Row gutter={18}>
				<Col span={12}>
					<Button
						className="staking-btn-link"
						block
						type="primary"
						disabled={!lpUrl || !hasBalance}
						icon={<MinusOutlined />}
						href={lpUrl}
						target="_blank"
					>
						Remove
					</Button>
				</Col>
				<Col span={12}>
					<Button
						className="staking-btn-link"
						block
						type="primary"
						disabled={!lpUrl}
						icon={<PlusOutlined />}
						href={lpUrl}
						target="_blank"
					>
						Add
					</Button>
				</Col>
			</Row>
		</Card>
	)
}

export default LiquidityCard
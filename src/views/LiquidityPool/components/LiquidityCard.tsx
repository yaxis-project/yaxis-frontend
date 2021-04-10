import React, { useState, useContext, useEffect, useMemo } from 'react'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { Row, Col, Typography, Card, Button } from 'antd'
import BigNumber from 'bignumber.js'
import Value from '../../../components/Value'
import useLP from '../../../hooks/useMyLiquidity'
import useFarms from '../../../hooks/useFarms'
import { StakePool } from '../../../yaxis/type'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import * as currencies from '../../../utils/currencies'
import { getFullDisplayBalance } from '../../../utils/formatBalance'

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
				<Row style={{ borderBottom: 'none' }}>
					<Col style={{ marginRight: '10px' }}>
						<Value value={Number(balance)} decimals={2} secondary />
					</Col>
					<Col>
						<Text>{symbol}</Text>
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

	const {
		farm: { lpUrl, id },
		userBalance,
		userPoolShare,
		stakedBalance,
	} = useLP(pool)
	const totalBalance = userBalance.plus(stakedBalance)

	const defaultUserBalances = useMemo(() => {
		const output = {}
		pool.lpTokens.forEach((token) => (output[token.symbol] = 0))
		return output
	}, [pool])
	const [userBalances, setUserBalances] = useState(defaultUserBalances)

	const { stakedValues } = useFarms()
	useEffect(() => {
		const stakedValue = stakedValues.find((farm) => farm.id === id)
		if (stakedValue) {
			const nextState = {}
			pool.lpTokens.forEach(
				(token, i) =>
					(nextState[token.symbol] = new BigNumber(
						stakedValue?.reserve[i],
					)
						.times(userPoolShare)
						.toFixed(2)),
			)
			setUserBalances(nextState)
		}
	}, [stakedValues, userPoolShare, pool, id])

	// const hasBalance = Object.values(userBalances).some(val => Number(val)) || Number(stakedBalance.toFixed(2))

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
				icon={
					currencies.currencyMap[pool.symbol]?.icon ||
					currencies.UNI_ETH_YAX_LP.icon
				}
				name={'Pool Tokens'}
				balance={getFullDisplayBalance(totalBalance)}
				symbol={pool.symbol}
			/>
			{pool.lpTokens.map(({ symbol }, i) => (
				<LiquidityRow
					key={`LiqudityRow-${symbol}-${i}`}
					icon={
						typeof currencies[symbol] === 'function'
							? currencies[symbol]()?.icon
							: currencies[symbol]?.icon
					}
					name={symbol}
					balance={userBalances[symbol]}
					symbol={symbol}
				/>
			))}

			<Row gutter={18} justify="center">
				<Col span={12}>
					<Button
						className="staking-btn-link"
						block
						type="primary"
						disabled={!lpUrl || !userBalance.toNumber()}
						icon={<MinusOutlined />}
						href={lpUrl}
						target="_blank"
					>
						Remove
					</Button>
				</Col>
				{!pool?.legacy && (
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
				)}
			</Row>
		</Card>
	)
}

export default LiquidityCard

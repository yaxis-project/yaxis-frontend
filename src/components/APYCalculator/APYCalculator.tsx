import React, { useState, useCallback, useEffect } from 'react'
import { Row, Col, Slider, Tooltip, Typography } from 'antd'
import { CardRow } from '../../components/ExpandableSidePanel'
import Value from '../../components/Value'
import info from '../../assets/img/info.svg'
import BigNumber from 'bignumber.js'

const { Text } = Typography
type Props = { balance: BigNumber; APY: number; loading: boolean }

const marks = {
	1: {
		style: {
			color: 'white',
		},
		label: <strong>1 mo</strong>,
	},
	6: {
		style: {
			color: 'white',
		},
		label: <strong>6 mo</strong>,
	},
	12: {
		style: {
			color: 'white',
			width: '50px',
			overflow: 'visible',
		},
		label: <strong>12 mo</strong>,
	},
}

const APYCalculator: React.FC<Props> = ({
	balance: walletBalance,
	APY,
	loading,
}) => {
	const [value, setValue] = useState(12)

	const handleOnChange = useCallback(
		(value) => {
			setValue(value)
			const monthlyAPY = new BigNumber(APY).div(100).div(12)
			const displayAPY = monthlyAPY.multipliedBy(value)
			const earnings = walletBalance.multipliedBy(displayAPY)
			const futureBalance = walletBalance.plus(earnings)
			setBalance(futureBalance)
		},
		[walletBalance, APY],
	)
	const [balance, setBalance] = useState(() => {
		const monthlyAPY = new BigNumber(APY).div(100)
		const earnings = walletBalance.multipliedBy(monthlyAPY)
		const futureBalance = walletBalance.plus(earnings)
		return futureBalance
	})

	useEffect(() => {
		handleOnChange(value)
	}, [handleOnChange, value])

	return (
		<>
			<CardRow
				main={
					<Tooltip
						placement="topLeft"
						title={
							<Col style={{ margin: '10px 20px' }}>
								<Row>
									Slide to change your <br></br>estimated
									future balance
								</Row>

								<Slider
									value={value}
									marks={marks}
									defaultValue={12}
									min={1}
									max={12}
									tipFormatter={(value) => `${value} months`}
									onChange={handleOnChange}
								/>
							</Col>
						}
					>
						<Text type="secondary">Future Balance</Text>
						<img
							style={{
								position: 'relative',
								top: -1,
								marginLeft: '3px',
							}}
							src={info}
							height="15"
							alt="YAXIS Supply Rewards"
						/>
					</Tooltip>
				}
				secondary={
					<Value
						value={balance.toNumber()}
						numberPrefix="$"
						decimals={2}
					/>
				}
			/>
		</>
	)
}

export default APYCalculator

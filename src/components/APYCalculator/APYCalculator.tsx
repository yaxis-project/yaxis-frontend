import React, { useState, useCallback, useEffect } from 'react'
import { Row, Col, Slider, Tooltip, Typography, Radio } from 'antd'
import { CardRow } from '../../components/ExpandableSidePanel'
import Value from '../../components/Value'
import info from '../../assets/img/info.svg'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

const { Text } = Typography
type Props = {
	balance: BigNumber
	APR: number
	yearlyCompounds?: number
	loading?: boolean
}

const StyledRadio = styled(Radio.Group)`
	span {
		color: white;
	}
	margin-bottom: 15px;
`

const StyledRow = styled(Row)`
	font-weight: 700;
	margin-top: 10px;
`

const options = [
	{ label: 'Daily', value: '365' },
	{ label: 'Weekly', value: '52' },
	{ label: 'Monthly', value: '12' },
]

const sliderMarks = {
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
	APR,
	yearlyCompounds = 365,
}) => {
	const [duration, setDuration] = useState(12)
	const [compoundFrequency, setCompoundFrequency] = useState(yearlyCompounds)

	const handleOnDurationChange = useCallback(
		(duration) => {
			setDuration(duration)
			const monthlyAPR = new BigNumber(APR).div(12)
			const displayAPR = monthlyAPR.multipliedBy(duration)
			const adjustedCompounds = Math.round(
				(duration / 12) * compoundFrequency,
			)
			const displayAPY = displayAPR
				.div(100)
				.dividedBy(adjustedCompounds)
				.plus(1)
				.pow(adjustedCompounds)
				.minus(1)
			const earnings = walletBalance.multipliedBy(displayAPY)
			const futureBalance = walletBalance.plus(earnings)
			setBalance(futureBalance)
		},
		[walletBalance, APR, compoundFrequency],
	)
	const [balance, setBalance] = useState(() => {
		const monthlyAPR = new BigNumber(APR).div(100).div(12)
		const displayAPR = monthlyAPR.multipliedBy(duration)
		const adjustedCompounds = Math.round(
			(duration / 12) * compoundFrequency,
		)
		const displayAPY = displayAPR
			.div(100)
			.dividedBy(adjustedCompounds)
			.plus(1)
			.pow(adjustedCompounds)
			.minus(1)
			.multipliedBy(100)
		const earnings = walletBalance.multipliedBy(displayAPY)
		const futureBalance = walletBalance.plus(earnings)
		return futureBalance
	})

	useEffect(() => {
		handleOnDurationChange(duration)
	}, [handleOnDurationChange, duration])

	return (
		<>
			<CardRow
				main={
					<Tooltip
						style={{ minWidth: '350px' }}
						placement="topLeft"
						title={
							<Col style={{ margin: '10px 20px' }}>
								<StyledRow
									style={{
										marginBottom: '10px',
									}}
								>
									Annual Percentage Rate: {APR.toFixed(2)}%
								</StyledRow>
								<StyledRow
									style={{
										marginBottom: '8px',
									}}
								>
									Compounding Frequency:
								</StyledRow>
								<StyledRadio
									options={options}
									defaultValue="365"
									onChange={({ target: { value } }) => {
										setCompoundFrequency(Number(value))
									}}
									size="small"
									style={{ color: 'white' }}
								/>
								<StyledRow>See Your Balance In:</StyledRow>

								<Slider
									style={{ width: '90%' }}
									value={duration}
									marks={sliderMarks}
									defaultValue={12}
									min={1}
									max={12}
									tipFormatter={(value) =>
										value > 1
											? `${value} months`
											: `${value} month`
									}
									onChange={handleOnDurationChange}
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

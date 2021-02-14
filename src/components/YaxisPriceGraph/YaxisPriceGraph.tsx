import React, { Fragment, useState, useEffect } from 'react'
import { Card, Radio } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import {
	getYAXPriceData,
	SelectableDay,
	dayOptions,
} from '../../hooks/useYAXPriceData'
import { find } from 'ramda'
import styled from 'styled-components'
import usePriceMap from '../../hooks/usePriceMap'
import moment from 'moment'

// @ts-ignore-line
import {
	WithTooltip,
	Sparkline,
	LineSeries,
	PointSeries,
} from '@data-ui/sparkline'

const RadioGroup = styled(Radio.Group)`
	.ant-radio-button-wrapper {
		border: 0px;
		border-radius: 0px;
		padding: 0 10px;
		opacity: 0.5;
		order-color: #2eabd9 !important;
	}
	.ant-radio-button-wrapper-checked {
		//border: 0px;
		//border-radius: 0px;
		opacity: 1;
	}
	.ant-radio-button-wrapper:not(:first-child)::before {
		display: none;
	}
`

const StyledCard = styled(Card)`
	margin-bottom: 16px;
	height: 357px;

	.loading-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: 0.4;
		font-size: 30px;
	}

	&[data-is-loading='true'] {
		svg {
			opacity: 0.5;
		}
	}

	.ant-card-body {
		padding: 0 !important;
	}
`

/**
 * Generates a sparkline graph card for YAX prices.
 */
//const PriceGraph = ({className}) => {
const PriceGraph: React.FC = () => {
	const [data, setData] = useState<any>({ values: [], max: 0, min: 0 })
	const [isLoading, setLoading] = useState(true)
	const [selectedDay, setDate] = useState<SelectableDay>(dayOptions[3])

	const { YAX: yaxisPrice } = usePriceMap()

	const handleChange = (e: any) => {
		const day =
			find((day: SelectableDay) => day.name === e.target.value)(
				dayOptions,
			) || dayOptions[3]
		if (day) setDate(day)
	}

	const getData = async () => {
		setLoading(true)
		await getYAXPriceData(selectedDay, setData)
		setLoading(false)
	}

	useEffect(() => {
		getData()
	}, [selectedDay])

	return (
		<StyledCard
			title={
				<span>
					<strong>Yax Price:</strong> ${yaxisPrice}
				</span>
			}
			extra={
				<RadioGroup
					className="range-selector"
					value={selectedDay.name}
					onChange={handleChange}
				>
					{dayOptions.map((day) => (
						<Radio.Button key={day.name} value={day.name}>
							{day.name}
						</Radio.Button>
					))}
				</RadioGroup>
			}
			className={`price-graph`}
			data-is-loading={isLoading}
		>
			<WithTooltip
				renderTooltip={({ index }) => {
					const date = moment(data.dates[index]).format(
						'Do MMM YY @ HH:mm',
					)
					const price = data.values[index].toFixed(2)

					return (
						<Fragment>
							<div>{date}</div>
							<div>${price}</div>
						</Fragment>
					)
				}}
				tooltipTimeout={500}
			>
				<Sparkline
					width={734}
					height={270}
					data={data.values}
					margin={{ top: 20, right: 0, bottom: 10, left: 0 }}
				>
					<LineSeries strokeWidth={1} stroke="#016EAC" />
					<PointSeries points={['all']} size={0} stroke="none" />
				</Sparkline>
			</WithTooltip>

			{isLoading && <LoadingOutlined className={'loading-icon'} />}
		</StyledCard>
	)
}

export default PriceGraph

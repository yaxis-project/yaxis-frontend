import React, {
	Fragment,
	useState,
	useEffect,
	useMemo,
	useCallback,
} from 'react'
import { Radio, Row, Col } from 'antd'
import Card from '../../Card'
import { LoadingOutlined } from '@ant-design/icons'
import { getYAXPriceData, SelectableDay, dayOptions } from './utils'
import useWindowWidth from '../../../hooks/useWindowWidth'
import styled from 'styled-components'
import { usePrices } from '../../../state/prices/hooks'
import moment from 'moment'
import { defaultBaseTheme } from '../../../theme'
import BigNumber from 'bignumber.js'
import useTranslation from '../../../hooks/useTranslation'

import {
	WithTooltip,
	Sparkline,
	LineSeries,
	PointSeries,
} from '@data-ui/sparkline'
import { RadioChangeEvent } from 'antd/lib/radio'

/**
 * Generates a sparkline graph card for YAX prices.
 */

export interface State {
	values: number[]
	dates: number[]
	max: number
	min: number
}
const defaultState: State = { values: [], dates: [], max: 0, min: 0 }

const PriceGraph: React.FC = () => {
	const translate = useTranslation()

	const [data, setData] = useState(defaultState)
	const [isLoading, setLoading] = useState(true)
	const [selectedDay, setDate] = useState<SelectableDay>(dayOptions[3])

	const {
		prices: { yaxis: yaxisPrice },
	} = usePrices()

	const windowWidth = useWindowWidth()
	const chartWidth = useMemo(() => {
		if (windowWidth < 725) return windowWidth
		if (windowWidth < 992) return Math.round(windowWidth * 0.74)
		if (windowWidth < defaultBaseTheme.siteWidth + 300)
			return Math.round(windowWidth * 0.53)

		return 733
	}, [windowWidth])

	const handleChange = (e: RadioChangeEvent) => {
		const day =
			dayOptions.find(
				(day: SelectableDay) => day.name === e.target.value,
			) || dayOptions[3]
		if (day) setDate(day)
	}

	const getData = useCallback(async () => {
		setLoading(true)
		await getYAXPriceData(selectedDay, setData)
		setLoading(false)
	}, [selectedDay])

	useEffect(() => {
		getData()
	}, [selectedDay, getData])

	return (
		<StyledCard
			title={
				<Row
					style={{ width: '100%' }}
					justify="space-between"
					align="middle"
				>
					<Col>
						<Row>
							<Col style={{ paddingRight: '10px' }}>
								<StyledText>
									<strong>{translate('YAXIS Price')}:</strong>
								</StyledText>
							</Col>
							<Col>
								<StyledText>
									${new BigNumber(yaxisPrice).toFixed(2)}
								</StyledText>
							</Col>
						</Row>
					</Col>
					<Col>
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
					</Col>
				</Row>
			}
			data-is-loading={isLoading}
		>
			<WithTooltip
				renderTooltip={({ index }) => {
					const date = moment(data.dates[index]).format(
						'MMM Do YYYY @ HH:mm',
					)
					const price = data.values[index]?.toFixed(2)

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
					width={chartWidth}
					height={270}
					data={data.values}
					ariaLabel="yAxis price graph"
				>
					<LineSeries strokeWidth={1} stroke="#016EAC" />
					<PointSeries points={['all']} size={0} stroke="none" />
				</Sparkline>
			</WithTooltip>

			{isLoading && <StyledLoadingOutlined className={'loading-icon'} />}
		</StyledCard>
	)
}

export default PriceGraph

const RadioGroup = styled(Radio.Group)`
	.ant-radio-button-wrapper {
		${(props) =>
			props.theme.type === 'dark'
				? `background: ${props.theme.secondary.background};`
				: `background: ${props.theme.primary.background};`}
		${(props) =>
			props.theme.type === 'dark'
				? `color: ${props.theme.primary.font};`
				: ''}

		border: 0px;
		border-radius: 0px;
		padding: 0 10px;
		opacity: 0.5;
		order-color: #2eabd9 !important;
	}
	.ant-radio-button-wrapper-checked {
		opacity: 1;
	}
	.ant-radio-button-wrapper:not(:first-child)::before {
		display: none;
	}
`

const StyledCard = styled(Card)`
	margin-bottom: 16px;
	height: 357px;
	background: ${(props) => props.theme.secondary.background};
	border-color: ${(props) => props.theme.secondary.border};

	.loading-icon {
		position: absolute;
		top: 50%;
		left: 50%;
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

	.ant-card-head {
		border-color: ${(props) => props.theme.secondary.border};
	}
`
const StyledText = styled.span`
	color: ${(props) => props.theme.primary.font};
`

const StyledLoadingOutlined = styled(LoadingOutlined)`
	color: ${(props) => props.theme.primary.font};
`

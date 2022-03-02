import { min, max } from 'lodash'
import moment from 'moment'
import { State } from './YaxisPriceGraph'

export interface SelectableDay {
	name: string
	unit: moment.unitOfTime.DurationConstructor
}

export const dayOptions: SelectableDay[] = [
	{
		name: '1h',
		unit: 'hours',
	},
	{
		name: '24h',
		unit: 'days',
	},
	{
		name: '1w',
		unit: 'weeks',
	},
	{
		name: '1m',
		unit: 'months',
	},
	{
		name: '1y',
		unit: 'years',
	},
]

interface PriceResponse {
	market_caps: [number, number][]
	prices: [number, number][]
	total_volumes: [number, number][]
}
/**
 * Generate YAX price data for sparklines.
 */
export async function getYAXPriceData(
	selectedDay: SelectableDay,
	setYaxData: React.Dispatch<React.SetStateAction<State>>,
): Promise<void> {
	const start = moment().subtract(1, selectedDay.unit).format('X')
	const end = moment().format('X')

	const api = `https://api.coingecko.com/api/v3/coins/yaxis/market_chart/range?vs_currency=usd&from=${start}&to=${end}`
	try {
		const data = await fetch(api)
		const converted: PriceResponse = await data.json()
		const prices = converted?.prices
		const dates = prices.map((p) => p[0])
		const values = prices.map((p) => p[1])
		setYaxData({
			values: values,
			dates: dates,
			max: max(values) * 1.2,
			min: min(values) * 0.8,
		})
	} catch {
		//
	}
}

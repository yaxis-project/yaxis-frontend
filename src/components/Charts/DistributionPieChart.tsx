import React, { useMemo } from 'react'
import { Row, Col } from 'antd'
import { Pie } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useGauges, useRewardRate } from '../../state/internal/hooks'
import { LoadingOutlined } from '@ant-design/icons'

const Colors: { [vault: string]: [number, number, number] } = {
	usd: [0, 150, 0],
	btc: [255, 159, 64],
	eth: [77, 97, 233],
	link: [24, 45, 142],
	yaxis: [0, 0, 0],
	frax: [54, 162, 235],
	tricrypto: [255, 99, 132],
	cvx: [153, 102, 255],
}

// 		'rgba(255, 99, 132, 1)',
// 		'rgba(54, 162, 235, 1)',
// 		'rgba(255, 206, 86, 1)',
// 		'rgba(75, 192, 192, 1)',
// 		'rgba(153, 102, 255, 1)',

const randomBetween = (min, max) =>
	min + Math.floor(Math.random() * (max - min + 1))
const generateRGBA = (
	r = randomBetween(0, 255),
	g = randomBetween(0, 255),
	b = randomBetween(0, 255),
	a = randomBetween(0, 1),
) => `rgba(${r},${g},${b},${a})`

interface Props {
	type: 'relativeWeight' | 'nextRelativeWeight'
}

const DistributionPieChart: React.FC<Props> = ({ type }) => {
	const { loading, gauges } = useGauges()

	const rate = useRewardRate()

	const gaugeData = useMemo(
		() =>
			Object.entries(gauges)
				// YAXIS gauge removed in YIP-14
				.filter(([name, data]) => name !== 'yaxis' && data[type].gt(0)),
		[gauges, type],
	)

	const colors = useMemo(
		() =>
			gaugeData.reduce(
				(acc, [name]) => {
					const [r, g, b] = Colors[name] || [
						randomBetween(0, 255),
						randomBetween(0, 255),
						randomBetween(0, 255),
					]
					acc.background.push(generateRGBA(r, g, b, 0.2))
					acc.border.push(generateRGBA(r, g, b, 1))
					return acc
				},
				{ background: [], border: [] },
			),
		[gaugeData],
	)

	const data = useMemo(() => {
		if (loading)
			return {
				labels: [],
				datasets: [
					{
						data: [],
						backgroundColor: [],
						borderColor: [],
						borderWidth: 2,
					},
				],
			}

		return {
			labels: [],
			datasets: [
				{
					id: 'current',
					labels: gaugeData.map(([gauge]) => gauge),
					data: gaugeData.map(([, data]) => data[type].toNumber()),
					datalabels: {
						anchor: 'end' as const,
					},
					backgroundColor: colors.background,
					borderColor: colors.border,
					borderWidth: 2,
				},
				// TODO: second dataset for upcoming

				// {
				// 	id: 'upcoming',
				// 	labels: gaugeData.map(([gauge]) => gauge + '1'),
				// 	data: gaugeData.map(([, { relativeWeight }]) =>
				// 		relativeWeight.toNumber(),
				// 	),
				// 	datalabels: {
				// 		anchor: 'end' as const,
				// 	},
				// 	backgroundColor: [
				// 		'rgba(255, 99, 132, 0.2)',
				// 		'rgba(54, 162, 235, 0.2)',
				// 		'rgba(255, 206, 86, 0.2)',
				// 		'rgba(75, 192, 192, 0.2)',
				// 		'rgba(153, 102, 255, 0.2)',
				// 		'rgba(255, 159, 64, 0.2)',
				// 	],
				// 	borderColor: [
				// 		'rgba(255, 99, 132, 1)',
				// 		'rgba(54, 162, 235, 1)',
				// 		'rgba(255, 206, 86, 1)',
				// 		'rgba(75, 192, 192, 1)',
				// 		'rgba(153, 102, 255, 1)',
				// 		'rgba(255, 159, 64, 1)',
				// 	],
				// 	borderWidth: 2,
				// },
			],
		}
	}, [loading, gaugeData, type, colors])

	return (
		<>
			{loading ? (
				<Row justify="center" align="middle">
					<Col>
						<LoadingOutlined style={{ fontSize: 270 }} spin />
					</Col>
				</Row>
			) : (
				<Pie
					data={data}
					options={{
						layout: {
							padding: {
								top: 10,
								bottom: 20,
							},
						},
						plugins: {
							tooltip: {
								callbacks: {
									label: function (context) {
										return (
											' ' +
											rate
												.multipliedBy(60 * 60 * 24)
												.multipliedBy(
													context.formattedValue,
												)
												.toFixed(3) +
											' YAXIS / day'
										)
									},
								},
							},
							datalabels: {
								display: (context) =>
									context.datasetIndex === 0,
								padding: {
									left: 10,
									right: 10,
									top: 6,
									bottom: 6,
								},
								backgroundColor: (context) =>
									context.dataset.borderColor as string,
								borderColor: 'white',
								borderRadius: 25,
								borderWidth: 2,
								color: 'white',
								font: {
									weight: 'bold',
								},
								formatter: (value, context) =>
									(context.dataset as any).labels[
										context.dataIndex
									],
							},
						},
					}}
				/>
			)}
		</>
	)
}

export { DistributionPieChart }

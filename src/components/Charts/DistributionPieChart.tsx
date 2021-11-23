import React, { useMemo } from 'react'
import { Row, Col } from 'antd'
import { Chart, Pie } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useGauges, useRewardRate } from '../../state/internal/hooks'
import { LoadingOutlined } from '@ant-design/icons'

Chart.register(ChartDataLabels)

// TODO: fixed colors

// const colors = {
// 	'3crv': '',
// 	wbtc: '',
// 	weth: '',
// 	link: '',
// 	yaxis: '',
// }

interface Props {
	type: 'relativeWeight' | 'nextRelativeWeight'
}

const DistributionPieChart: React.FC<Props> = ({ type }) => {
	const { loading, gauges } = useGauges()

	const rate = useRewardRate()

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

		const gaugeData = Object.entries(gauges)

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
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)',
						'rgba(255, 159, 64, 0.2)',
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)',
					],
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
	}, [loading, gauges, type])

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

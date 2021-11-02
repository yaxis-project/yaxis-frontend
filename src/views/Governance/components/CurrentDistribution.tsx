import React, { useMemo } from 'react'
import useTranslation from '../../../hooks/useTranslation'
import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'
import { Pie } from '@ant-design/charts'
import { useGauges } from '../../../state/internal/hooks'

const CurrentDistribution: React.FC = () => {
	const translate = useTranslation()

	const [loading, gauges] = useGauges()

	const data = useMemo(() => {
		if (loading) return []
		return Object.entries(gauges).map(([gauge, { relativeWeight }]) => {
			return { type: gauge, value: relativeWeight.toNumber() }
		})
	}, [loading, gauges])

	const config = useMemo(() => {
		return {
			data: data,
			angleField: 'value',
			colorField: 'type',
			radius: 1,
			legend: false as any,
			padding: 0,
			label: {
				type: 'inner',
				offset: '-30%',
				content: function content(_ref) {
					var percent = _ref.percent
					return ''.concat((percent * 100).toFixed(0), '%')
				},
				style: {
					fontSize: 14,
					textAlign: 'center',
				},
			},
			interactions: [{ type: 'element-active' }],
		}
	}, [data])

	return (
		<ExpandableSidePanel header={translate('Current Distribution')}>
			<CardRow main={<Pie {...config} />} secondary={null} last />
		</ExpandableSidePanel>
	)
}

export { CurrentDistribution }

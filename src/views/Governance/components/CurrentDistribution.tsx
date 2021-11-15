import React, { useMemo } from 'react'
import styled from 'styled-components'
import useTranslation from '../../../hooks/useTranslation'
import { ExpandableSidePanel } from '../../../components/ExpandableSidePanel'
import { Pie } from '@ant-design/charts'
import { useGauges, useRewardRate } from '../../../state/internal/hooks'

const CurrentDistribution: React.FC = () => {
	const translate = useTranslation()

	const [loading, gauges] = useGauges()

	const rate = useRewardRate()

	const data = useMemo(() => {
		if (loading) return []
		return Object.entries(gauges).map(([gauge, { relativeWeight }]) => {
			return {
				type: gauge.toUpperCase(),
				value: relativeWeight.toNumber(),
			}
		})
	}, [loading, gauges])

	return (
		<ExpandableSidePanel header={translate('Current Distribution')}>
			<StyledRow>
				<Pie
					data={data}
					angleField={'value'}
					colorField={'type'}
					radius={1}
					legend={false}
					padding={10}
					label={{
						type: 'inner',
						offset: '-30%',
						content: function content(_ref) {
							var percent = _ref.percent
							return ''.concat((percent * 100).toFixed(0), '%')
						},
						style: {
							fontSize: 26,
							textAlign: 'center',
						},
					}}
					tooltip={{
						formatter: ({ type, value }) => {
							return {
								name: type,
								value:
									rate
										.multipliedBy(60 * 60 * 24)
										.multipliedBy(value)
										.dividedBy(100)
										.toFixed(3) + ' YAXIS / day',
							}
						},
					}}
					interactions={[{ type: 'element-active' }]}
				/>
			</StyledRow>
		</ExpandableSidePanel>
	)
}

export { CurrentDistribution }

const StyledRow = styled.div`
	&&& {
		background: ${(props) => props.theme.secondary.background};
		border-color: ${(props) => props.theme.secondary.border};
	}
`
